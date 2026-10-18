/* Homepage news feed: Writing / Links / Releases toggles (_layouts/home.html).
 *
 * The list is fully rendered by Jekyll with every kind present. This script
 * only sets data-hide on .wf-writing (a space-separated list of the kinds
 * switched off: posts, links, releases), which the CSS uses to hide those
 * items, then hides any month that has nothing left to show, both in the list
 * and in the "By month" rail, and rewrites the month counts. Without
 * JavaScript everything stays visible. The choice is remembered per browser in
 * localStorage and can be preset with ?show=writing|links|releases|all (or a
 * comma-separated mix such as ?show=writing,links).
 */
(function () {
  var wrap = document.querySelector('.wf-writing');
  var buttons = document.querySelectorAll('.wf-tog');
  if (!wrap || !buttons.length) return;

  var KEY = 'wf-news-show';
  var KINDS = ['posts', 'links', 'releases'];
  var NOUN = { posts: 'post', links: 'link', releases: 'release' };
  var state = { posts: true, links: true, releases: true };

  function shown() {
    return KINDS.filter(function (k) { return state[k]; });
  }

  function apply(save) {
    wrap.setAttribute('data-hide', KINDS.filter(function (k) { return !state[k]; }).join(' '));
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', state[b.getAttribute('data-kind')] ? 'true' : 'false');
    });

    // Hide months left empty by the current filter, in the list and the rail.
    wrap.querySelectorAll('.wf-month').forEach(function (sec) {
      sec.hidden = total(sec) === 0;
      var out = sec.querySelector('.wf-month-n');
      if (out) out.textContent = label(sec);
    });
    wrap.querySelectorAll('.wf-months li[data-month]').forEach(function (li) {
      var n = total(li);
      li.hidden = n === 0;
      var out = li.querySelector('.wf-months-n');
      if (out) out.textContent = n;
    });
    // Year labels in the rail: hide when every month under them is hidden.
    wrap.querySelectorAll('.wf-months-year').forEach(function (yr) {
      var any = false;
      var el = yr.nextElementSibling;
      while (el && !el.classList.contains('wf-months-year')) {
        if (!el.hidden) any = true;
        el = el.nextElementSibling;
      }
      yr.hidden = !any;
    });

    if (save) {
      try { localStorage.setItem(KEY, shown().join(',')); } catch (e) { /* private mode etc. */ }
    }
  }

  function n(el, kind) { return +el.getAttribute('data-' + kind) || 0; }

  function total(el) {
    return shown().reduce(function (sum, k) { return sum + n(el, k); }, 0);
  }

  // "2 posts · 1 link", counting only the kinds shown.
  function label(el) {
    return shown().filter(function (k) { return n(el, k) > 0; }).map(function (k) {
      var c = n(el, k);
      return c + ' ' + NOUN[k] + (c === 1 ? '' : 's');
    }).join(' · ');
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var kind = b.getAttribute('data-kind');
      // Never leave the list empty: switching off the last kind shown brings the others back.
      if (state[kind] && shown().length === 1) {
        KINDS.forEach(function (k) { state[k] = k !== kind; });
      } else {
        state[kind] = !state[kind];
      }
      apply(true);
    });
  });

  // Initial state: URL parameter wins, then the remembered choice, then everything.
  // Older saved values ("all", "posts", "releases") still read correctly.
  function parse(v) {
    if (!v) return null;
    if (v === 'all') return KINDS.slice();
    var ks = v.split(',').map(function (s) {
      s = s.trim();
      return s === 'writing' ? 'posts' : s;
    }).filter(function (s) { return KINDS.indexOf(s) !== -1; });
    return ks.length ? ks : null;
  }
  var preset = null;
  try {
    preset = parse(new URLSearchParams(location.search).get('show')) || parse(localStorage.getItem(KEY));
  } catch (e) { /* ignore */ }
  if (preset) KINDS.forEach(function (k) { state[k] = preset.indexOf(k) !== -1; });
  apply(false);
})();
