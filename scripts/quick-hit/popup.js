/*
 * Quick hit popup. On open it reads the active tab (title, link, site name and any
 * highlighted text), puts the cursor in the comment box, and on Publish commits
 * one file to _links/ through the GitHub contents API. GitHub Pages rebuilds the
 * site from that commit, so the quick hit is live a minute or so later.
 *
 * The page can also go to an Apple Reminders list (AI Reading by default) through the
 * helper in native/ (Chrome native messaging), with the comment and quote as notes:
 * "Only add to AI Reading" does just that and publishes nothing, and the "Also add"
 * checkbox (on by default) sends every published quick hit and draft there too.
 *
 * What you type is kept per page in session storage until it is published, so
 * closing the popup by accident loses nothing.
 */
import { buildFile, cleanUrl, filePath, permalink, sourceFromUrl, toBase64 } from "./lib.js";
import { HELPER, loadSettings, saveSettings } from "./settings.js";

const $ = (id) => document.getElementById(id);
const fields = ["comment", "quote", "title", "link", "source"];
const status = $("status");
let settings;
let draftKey = null;

// Runs inside the page: what the popup needs to fill itself in.
function grab() {
  const meta = (sel) => (document.querySelector(sel)?.getAttribute("content") || "").trim();
  const canonical = document.querySelector('link[rel="canonical"]')?.href || "";
  let url = location.href;
  try {
    const c = new URL(canonical);
    // Some sites point every page's canonical at the home page; only trust a real one.
    if (c.hostname === location.hostname && c.pathname !== "/") url = c.href;
  } catch { /* no canonical */ }
  return {
    title: meta('meta[property="og:title"]') || meta('meta[name="twitter:title"]') || document.title,
    url,
    siteName: meta('meta[property="og:site_name"]'),
    selection: String(window.getSelection() || "").trim(),
  };
}

async function readTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let page = { title: tab?.title || "", url: tab?.url || "", siteName: "", selection: "" };
  try {
    const [res] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: grab });
    if (res?.result) page = res.result;
  } catch { /* chrome:// pages, the Web Store, PDFs: fall back to the tab's own title and URL */ }
  return page;
}

function say(html, kind = "") {
  status.className = `status ${kind}`;
  status.innerHTML = html;
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

async function saveDraft() {
  if (!draftKey) return;
  const value = Object.fromEntries(fields.map((f) => [f, $(f).value]));
  try { await chrome.storage.session.set({ [draftKey]: value }); } catch { /* storage unavailable */ }
}

async function putFile(path, content, message) {
  const url = `https://api.github.com/repos/${settings.repo}/contents/${path.split("/").map(encodeURIComponent).join("/")}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${settings.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({ message, content: toBase64(content), branch: settings.branch }),
  });
  let body = null;
  try { body = await res.json(); } catch { /* empty body */ }
  return { res, body };
}

function explain(res, body) {
  if (res.status === 401) return "GitHub didn't accept the token. Check it in Settings.";
  if (res.status === 403 || res.status === 404) return `The token can't write to ${settings.repo}. It needs Contents: Read and write on that repository.`;
  return `GitHub said ${res.status}: ${body?.message || res.statusText}`;
}

async function publish(draft) {
  const form = $("form");
  if (!form.reportValidity()) return;
  const buttons = [$("publish"), $("draft")];
  buttons.forEach((b) => (b.disabled = true));
  say(draft ? "Saving draft…" : "Publishing…");

  const entry = {
    title: $("title").value,
    link: cleanUrl($("link").value),
    source: $("source").value,
    quote: $("quote").value,
    comment: $("comment").value,
    date: new Date(),
    draft,
  };
  try {
    const content = buildFile(entry);
    const message = `Quick hit${draft ? " (draft)" : ""}: ${entry.title.trim()}`;
    // A second quick hit with the same title on the same day gets a -2 suffix, and so on.
    for (let n = 1; n <= 5; n++) {
      const { path, slug } = filePath(entry.title, entry.date, n);
      const { res, body } = await putFile(path, content, message);
      if (res.status === 422 && n < 5) continue; // name taken: GitHub wants the old file's sha
      if (!res.ok) throw new Error(explain(res, body));

      if (draftKey) await chrome.storage.session.remove(draftKey).catch(() => {});
      const page = permalink(settings.siteUrl, entry.date, slug);
      const edit = `https://github.com/${settings.repo}/edit/${settings.branch}/${path}`;
      document.body.classList.add("done");
      // Also to Reminders, when the box is ticked; its result is a second line under the first.
      let also = "";
      if ($("alsoRemind").checked) {
        const r = await toReminders(draft ? "" : `Quick hit: ${page}`);
        also = `<span class="also ${r.ok ? "ok" : "bad"}">${r.html}</span>`;
      }
      if (draft) {
        say(`Saved as a draft. To publish it, delete the <code>published: false</code> line.
          <span class="links"><a href="${esc(edit)}" target="_blank">Edit on GitHub</a></span>${also}`, "ok");
      } else {
        say(`Published. The page is live in about a minute.
          <span class="links"><a href="${esc(page)}" target="_blank">Open page</a><a href="#" id="copy">Copy link</a><a href="${esc(body?.commit?.html_url || edit)}" target="_blank">Commit</a></span>${also}`, "ok");
        $("copy").addEventListener("click", async (e) => {
          e.preventDefault();
          await navigator.clipboard.writeText(page);
          e.target.textContent = "Copied";
        });
      }
      return;
    }
  } catch (err) {
    say(esc(err.message), "bad");
    buttons.forEach((b) => (b.disabled = false));
  }
}

// Sends the page to the Reminders list through the native helper. Resolves to
// { ok, html }: a one-line, already-escaped result to show in the status area.
function toReminders(extraNotes = "") {
  const list = settings.remindersList;
  const link = cleanUrl($("link").value);
  if (!/^https?:\/\//i.test(link)) return Promise.resolve({ ok: false, html: "Only web pages can go to Reminders." });
  const quote = $("quote").value.trim();
  const notes = [$("comment").value.trim(), quote && `“${quote}”`, extraNotes].filter(Boolean).join("\n\n");
  return new Promise((resolve) => {
    chrome.runtime.sendNativeMessage(HELPER, { action: "add", list, title: $("title").value, url: link, notes }, (reply) => {
      if (chrome.runtime.lastError) {
        return resolve({ ok: false, html: `Couldn't reach the Reminders helper, so nothing went to ${esc(list)}. Install it once: <code>sh scripts/quick-hit/native/install.sh</code> in the blog checkout.` });
      }
      if (!reply?.ok) return resolve({ ok: false, html: `Not added to ${esc(list)}: ${esc(reply?.error || "the helper didn't say why.")}` });
      resolve({ ok: true, html: reply.duplicate ? `Already in ${esc(list)}.` : `Added to ${esc(list)}.` });
    });
  });
}

// "Only add to AI Reading": the reading queue, nothing published.
async function remind() {
  const button = $("remind");
  button.disabled = true;
  say(`Adding to ${esc(settings.remindersList)}…`);
  const r = await toReminders();
  button.disabled = false;
  say(r.html, r.ok ? "ok" : "bad");
  if (r.ok) setTimeout(() => window.close(), 1200);
}

async function init() {
  settings = await loadSettings();
  if (!settings.token) {
    $("setup").hidden = false;
    $("publish").disabled = true;
    $("draft").disabled = true;
  }

  const page = await readTab();
  const link = cleanUrl(page.url);
  $("title").value = page.title.replace(/\s+/g, " ").trim();
  $("link").value = link;
  $("source").value = page.siteName || sourceFromUrl(link);
  $("quote").value = page.selection;

  // Restore anything typed for this page before the popup last closed.
  draftKey = `draft:${link}`;
  try {
    const saved = (await chrome.storage.session.get(draftKey))[draftKey];
    if (saved) {
      for (const f of fields) if (saved[f] !== undefined && (f !== "quote" || !page.selection)) $(f).value = saved[f];
    }
  } catch { /* storage unavailable */ }

  fields.forEach((f) => $(f).addEventListener("input", saveDraft));
  $("comment").focus();

  // Enter in a field must not publish: only the button or ⌘↵ does.
  $("form").addEventListener("submit", (e) => e.preventDefault());
  $("publish").addEventListener("click", () => publish(false));
  $("draft").addEventListener("click", () => publish(true));
  document.querySelectorAll(".remind-list").forEach((el) => (el.textContent = settings.remindersList));
  $("alsoRemind").checked = settings.alsoRemind !== false;
  $("alsoRemind").addEventListener("change", () => saveSettings({ alsoRemind: $("alsoRemind").checked }));
  $("remind").addEventListener("click", remind);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || !(e.metaKey || e.ctrlKey)) return;
    e.preventDefault();
    if (e.shiftKey) { if (!$("remind").disabled) remind(); }
    else if (!$("publish").disabled) publish(false);
  });
}

init();
