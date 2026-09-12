/* Homepage news feed: Writing / Releases toggles (_layouts/home.html).
 *
 * The list is fully rendered by Jekyll with both kinds present. This script
 * only sets data-show on .wf-writing (all | posts | releases), which the CSS
 * uses to hide one kind, then hides any month that has nothing left to show,
 * both in the list and in the "By month" rail, and updates the rail counts.
 * Without JavaScript everything stays visible. The choice is remembered per
 * browser in localStorage and can be preset with ?show=writing|releases.
 */
(function () {
  var wrap = document.querySelector('.wf-writing');
  var buttons = document.querySelectorAll('.wf-tog');
  if (!wrap || !buttons.length) return;

  var KEY = 'wf-news-show';
  var state = { posts: true, releases: true };

  function mode() {
    if (state.posts && state.releases) return 'all';
    return state.posts ? 'posts' : 'releases';
  }

  function apply(save) {
    var m = mode();
    wrap.setAttribute('data-show', m);
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', state[b.getAttribute('data-kind')] ? 'true' : 'false');
    });

    // Hide months left empty by the current filter, in the list and the rail.
    var visible = {};
    wrap.querySelectorAll('.wf-month').forEach(function (sec) {
      var n = count(sec, m);
      sec.hidden = n === 0;
      visible[sec.id] = n;
    });
    wrap.querySelectorAll('.wf-months li[data-month]').forEach(function (li) {
      var n = count(li, m);
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
      try { localStorage.setItem(KEY, m); } catch (e) { /* private mode etc. */ }
    }
  }

  function count(el, m) {
    var p = +el.getAttribute('data-posts') || 0;
    var r = +el.getAttribute('data-releases') || 0;
    return m === 'posts' ? p : m === 'releases' ? r : p + r;
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var kind = b.getAttribute('data-kind');
      var other = kind === 'posts' ? 'releases' : 'posts';
      if (state[kind] && !state[other]) {
        // Never leave the list empty: switching off the last kind swaps to the other.
        state[kind] = false;
        state[other] = true;
      } else {
        state[kind] = !state[kind];
      }
      apply(true);
    });
  });

  // Initial state: URL parameter wins, then the remembered choice, then both.
  var preset = null;
  try {
    var q = new URLSearchParams(location.search).get('show');
    if (q === 'writing' || q === 'posts') preset = 'posts';
    else if (q === 'releases') preset = 'releases';
    else if (q === 'all') preset = 'all';
    if (!preset) preset = localStorage.getItem(KEY);
  } catch (e) { /* ignore */ }
  if (preset === 'posts' || preset === 'releases') {
    state.posts = preset === 'posts';
    state.releases = preset === 'releases';
  }
  apply(false);
})();
