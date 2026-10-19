import { DEFAULTS, HELPER, loadSettings, saveSettings } from "./settings.js";

const $ = (id) => document.getElementById(id);
const keys = Object.keys(DEFAULTS);
const status = $("status");

function say(text, kind = "") {
  status.className = `status ${kind}`;
  status.textContent = text;
}

function values() {
  return Object.fromEntries(keys.map((k) => [k, $(k).value.trim()]));
}

// Asks GitHub whether the token can push to the repository.
async function check() {
  const v = values();
  if (!v.token) return say("Paste a token first.", "bad");
  say("Checking…");
  try {
    const res = await fetch(`https://api.github.com/repos/${v.repo}`, {
      headers: { Authorization: `Bearer ${v.token}`, Accept: "application/vnd.github+json" },
    });
    if (res.status === 401) return say("GitHub didn't accept the token.", "bad");
    if (!res.ok) return say(`The token can't see ${v.repo} (GitHub said ${res.status}).`, "bad");
    const repo = await res.json();
    if (repo.permissions?.push) say(`Good: the token can write to ${repo.full_name}.`, "ok");
    else say(`The token can read ${repo.full_name} but not write to it. Give it Contents: Read and write.`, "bad");
  } catch (err) {
    say(`Couldn't reach GitHub: ${err.message}`, "bad");
  }
}

// Asks the Reminders helper (native/install.sh) to answer.
function checkHelper() {
  const out = $("helperStatus");
  out.className = "status";
  out.textContent = "Checking…";
  chrome.runtime.sendNativeMessage(HELPER, { action: "ping" }, (reply) => {
    if (chrome.runtime.lastError || !reply?.ok) {
      out.className = "status bad";
      out.textContent = "The helper isn't installed. Run sh scripts/quick-hit/native/install.sh, then restart Chrome if this persists.";
    } else {
      out.className = "status ok";
      out.textContent = `Good: the helper answered (version ${reply.version}).`;
    }
  });
}

async function init() {
  const s = await loadSettings();
  for (const k of keys) $(k).value = s[k];
  $("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    await saveSettings(values());
    say("Saved.", "ok");
  });
  $("check").addEventListener("click", check);
  $("checkHelper").addEventListener("click", checkHelper);
}

init();
