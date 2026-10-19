#!/usr/bin/python3
"""Chrome native messaging host: adds a link to an Apple Reminders list.

Chrome starts this script when the Quick Hit popup calls
chrome.runtime.sendNativeMessage("com.wildfiring.quick_hit", message), sends one
message (a 4-byte length, then JSON), and reads one reply in the same framing.
install.sh registers it with Chrome; nothing else runs it.

Messages:
  {"action": "ping"}
      -> {"ok": true, "version": ...}
  {"action": "add", "list": "AI Reading", "title": ..., "url": ..., "notes": ...}
      -> {"ok": true} | {"ok": true, "duplicate": true} | {"ok": false, "error": ...}

The reminder's name is the page title; its notes are the URL, then the comment
and quote if any. (AppleScript cannot set a reminder's URL field, so the link goes
in the notes, where Reminders makes it clickable.) An open reminder in the same
list whose notes already hold the URL counts as a duplicate and is left alone.

Values reach AppleScript as arguments, never pasted into the script text.
Each request and its outcome is appended to ~/Library/Logs/wildfiring-quick-hit.log.
The first run makes macOS ask whether Google Chrome may control Reminders.
"""
import datetime
import json
import os
import re
import struct
import subprocess
import sys

VERSION = "0.2.2"
LOG = os.path.expanduser("~/Library/Logs/wildfiring-quick-hit.log")

ADD_SCRIPT = """
on run argv
  set listName to item 1 of argv
  set theTitle to item 2 of argv
  set theUrl to item 3 of argv
  set theBody to item 4 of argv
  tell application "Reminders"
    -- Read the names rather than asking "exists list": when Chrome is not yet allowed to
    -- control Reminders, "exists" quietly answers false instead of raising the error.
    set listNames to name of every list
    if listNames does not contain listName then error "There is no Reminders list named " & listName & "." number 1001
    set target to list listName
    if (count of (reminders of target whose completed is false and body contains theUrl)) > 0 then return "duplicate"
    make new reminder at end of target with properties {name:theTitle, body:theBody}
  end tell
  return "added"
end run
"""


def log(*parts):
    try:
        with open(LOG, "a", encoding="utf-8") as f:
            f.write(datetime.datetime.now().isoformat(timespec="seconds") + " " + " | ".join(str(p) for p in parts) + "\n")
    except OSError:
        pass  # logging must never stop the helper


def read_message():
    raw = sys.stdin.buffer.read(4)
    if len(raw) < 4:
        return None
    (length,) = struct.unpack("<I", raw)
    return json.loads(sys.stdin.buffer.read(length).decode("utf-8"))


def send(obj):
    data = json.dumps(obj).encode("utf-8")
    sys.stdout.buffer.write(struct.pack("<I", len(data)))
    sys.stdout.buffer.write(data)
    sys.stdout.buffer.flush()


def explain(stderr):
    if "-1743" in stderr or "Not authorized" in stderr:
        return ("macOS hasn't allowed Chrome to control Reminders. Turn it on in System Settings > "
                "Privacy & Security > Automation > Google Chrome > Reminders.")
    own = re.search(r"execution error: (.*) \(1001\)", stderr)
    if own:  # our own "no such list" error: keep just its message
        return own.group(1).strip()
    return stderr.strip() or "osascript failed without saying why."


def add(msg):
    title = " ".join(str(msg.get("title") or "").split()) or str(msg.get("url") or "")
    url = str(msg.get("url") or "").strip()
    if not url:
        return {"ok": False, "error": "No link to add."}
    notes = str(msg.get("notes") or "").strip()
    body = url + ("\n\n" + notes if notes else "")
    list_name = str(msg.get("list") or "AI Reading")
    try:
        res = subprocess.run(
            ["/usr/bin/osascript", "-e", ADD_SCRIPT, list_name, title, url, body],
            capture_output=True, text=True, timeout=30,
        )
    except subprocess.TimeoutExpired:
        return {"ok": False, "error": "Reminders took too long to answer. Is a permission prompt waiting?"}
    log("osascript", "exit=%s" % res.returncode, "out=%r" % res.stdout.strip(), "err=%r" % res.stderr.strip())
    if res.returncode != 0:
        return {"ok": False, "error": explain(res.stderr)}
    return {"ok": True, "duplicate": res.stdout.strip() == "duplicate", "list": list_name}


def main():
    try:
        msg = read_message()
        if msg is None:
            return
        action = msg.get("action")
        log("request", action, msg.get("list", ""), msg.get("url", ""))
        if action == "ping":
            reply = {"ok": True, "version": VERSION}
        elif action == "add":
            reply = add(msg)
        else:
            reply = {"ok": False, "error": "Unknown action: %s" % action}
        log("reply", json.dumps(reply))
        send(reply)
    except Exception as exc:  # report, don't crash: Chrome only sees a closed pipe otherwise
        log("crash", repr(exc))
        send({"ok": False, "error": "Helper error: %s" % exc})


if __name__ == "__main__":
    main()
