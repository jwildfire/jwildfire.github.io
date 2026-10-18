// Settings shared by the popup and the settings page. Kept in chrome.storage.local
// (this browser only), never chrome.storage.sync, so the token is not copied to
// other machines through the Google account.
export const DEFAULTS = {
  token: "",
  repo: "jwildfire/jwildfire.github.io",
  branch: "main",
  siteUrl: "https://jwildfire.github.io",
};

export async function loadSettings() {
  const saved = await chrome.storage.local.get(Object.keys(DEFAULTS));
  const out = { ...DEFAULTS };
  for (const k of Object.keys(DEFAULTS)) if (saved[k]) out[k] = saved[k];
  return out;
}

export async function saveSettings(values) {
  await chrome.storage.local.set(values);
}
