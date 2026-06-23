/* ---------------------------------------------------------------------------
   Footnote hover/focus tooltips.
   Progressive enhancement over kramdown's endnotes: the endnote list at the
   bottom of the post is left untouched; this just surfaces the same text in a
   floating tooltip when a reader hovers (or keyboard-focuses) a footnote
   marker. No-op on pages without footnotes.
--------------------------------------------------------------------------- */
(function () {
  "use strict";

  function init() {
    var refs = document.querySelectorAll("a.footnote");
    if (!refs.length) return;

    var tip = document.createElement("div");
    tip.className = "fn-tooltip";
    tip.setAttribute("role", "tooltip");
    tip.hidden = true;
    document.body.appendChild(tip);

    var hideTimer = null;
    var activeRef = null;

    function contentFor(ref) {
      var href = ref.getAttribute("href"); // "#fn:name"
      if (!href || href.charAt(0) !== "#") return null;
      var def = document.getElementById(href.slice(1));
      if (!def) return null;
      var clone = def.cloneNode(true);
      // Drop the "↩" back-reference link(s) — useless in a tooltip.
      var backs = clone.querySelectorAll(".reversefootnote, .footnote-backref");
      for (var i = 0; i < backs.length; i++) backs[i].parentNode.removeChild(backs[i]);
      return clone.innerHTML.trim();
    }

    function position(ref) {
      var r = ref.getBoundingClientRect();
      var docEl = document.documentElement;
      var scrollY = window.pageYOffset || docEl.scrollTop;
      var scrollX = window.pageXOffset || docEl.scrollLeft;
      var margin = 8;

      var tw = tip.offsetWidth;
      var th = tip.offsetHeight;

      // Center over the marker, then clamp inside the viewport.
      var left = scrollX + r.left + r.width / 2 - tw / 2;
      var minLeft = scrollX + margin;
      var maxLeft = scrollX + docEl.clientWidth - tw - margin;
      if (left > maxLeft) left = maxLeft;
      if (left < minLeft) left = minLeft;

      // Prefer above the marker; flip below if there isn't room.
      tip.classList.remove("below");
      var top = scrollY + r.top - th - margin;
      if (r.top - th - margin < 0) {
        top = scrollY + r.bottom + margin;
        tip.classList.add("below");
      }

      tip.style.left = Math.round(left) + "px";
      tip.style.top = Math.round(top) + "px";
    }

    function show(ref) {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      var html = contentFor(ref);
      if (!html) return;
      activeRef = ref;
      tip.innerHTML = html;
      tip.hidden = false;
      position(ref);
    }

    function scheduleHide() {
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(function () {
        tip.hidden = true;
        activeRef = null;
      }, 200);
    }

    for (var i = 0; i < refs.length; i++) {
      var ref = refs[i];
      ref.addEventListener("mouseenter", (function (r) { return function () { show(r); }; })(ref));
      ref.addEventListener("mouseleave", scheduleHide);
      ref.addEventListener("focus", (function (r) { return function () { show(r); }; })(ref));
      ref.addEventListener("blur", scheduleHide);
    }

    // Keep the tooltip open while the pointer is inside it, so any links in the
    // footnote stay clickable.
    tip.addEventListener("mouseenter", function () {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    });
    tip.addEventListener("mouseleave", scheduleHide);

    function reposition() {
      if (!tip.hidden && activeRef) position(activeRef);
    }
    window.addEventListener("scroll", reposition, { passive: true });
    window.addEventListener("resize", reposition);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !tip.hidden) {
        tip.hidden = true;
        activeRef = null;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
