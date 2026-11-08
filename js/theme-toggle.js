// Light / dark theme switch. head.html sets data-theme on <html> before first paint
// (the reader's pick from localStorage, else the system setting); this wires every
// [data-theme-toggle] button, follows system changes while the reader hasn't picked,
// and retunes the giscus comments frame. Picking the theme the system already shows
// clears the stored pick, so the site goes back to following the system.
(function () {
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function systemTheme() { return mq && mq.matches ? "dark" : "light"; }
  function storedTheme() { try { return localStorage.getItem("theme"); } catch (e) { return null; } }
  function current() { return root.getAttribute("data-theme") || systemTheme(); }

  function sync() {
    var dark = current() === "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
      b.setAttribute("aria-pressed", dark ? "true" : "false");
      b.title = dark ? "Dark mode: on" : "Dark mode: off";
    });
  }

  function tuneComments(theme) {
    var f = document.querySelector("iframe.giscus-frame");
    if (!f || !f.contentWindow) return;
    f.contentWindow.postMessage(
      { giscus: { setConfig: { theme: theme === "dark" ? "transparent_dark" : "light" } } },
      "https://giscus.app"
    );
  }

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    sync();
    tuneComments(theme);
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-theme-toggle]");
    if (!b) return;
    var next = current() === "dark" ? "light" : "dark";
    try {
      if (next === systemTheme()) localStorage.removeItem("theme");
      else localStorage.setItem("theme", next);
    } catch (err) { /* private window: the switch still works for this page */ }
    apply(next);
  });

  if (mq) {
    var onChange = function () { if (!storedTheme()) apply(systemTheme()); };
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  sync();
})();
