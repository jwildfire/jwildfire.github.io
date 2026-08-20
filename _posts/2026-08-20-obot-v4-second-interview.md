---
title: "R/Pharma Diary #8 — A Second Interview with Obot"
author: "Jeremy Wildfire"
excerpt: "Two months on from the first interview: thirteen renderers, a local-first app, an agent that became an organisation, and a week spent finding out how it was quietly wrong."
tags: RPharma AI Agents OBot ClaudeCode DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 8
date: "2026-08-20"
---

<style>
.obot-intro {
  font-size: 1.08rem;
}
.obot-transcript {
  margin: 2rem 0;
}
.obot-turn {
  display: grid;
  grid-template-columns: 7rem minmax(0, 1fr);
  gap: 1rem;
  padding: 1.15rem 0;
  border-top: 1px solid var(--kn-rule, #ece2d7);
}
.obot-turn:last-child {
  border-bottom: 1px solid var(--kn-rule, #ece2d7);
}
.obot-speaker {
  font-family: var(--kn-mono, ui-monospace, monospace);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--kn-accent-deep, #c2410c);
  padding-top: 0.2rem;
}
.obot-message p:first-child {
  margin-top: 0;
}
.obot-message p:last-child {
  margin-bottom: 0;
}
.obot-message ul {
  margin-bottom: 0;
}
.obot-proof {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  gap: 0.75rem;
  margin: 1rem 0;
}
.obot-proof a {
  display: block;
  background: var(--kn-card, #fff);
  border: 1px solid var(--kn-rule, #ece2d7);
  border-radius: 10px;
  padding: 0.85rem 1rem;
  text-decoration: none;
}
.obot-proof a:hover {
  border-color: var(--kn-accent, #f97316);
  text-decoration: none;
}
.obot-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8.5rem, 1fr));
  gap: 0.75rem;
  margin: 1rem 0;
}
.obot-metric {
  background: var(--kn-card, #fff);
  border: 1px solid var(--kn-rule, #ece2d7);
  border-radius: 10px;
  padding: 0.85rem 1rem;
}
.obot-metric strong {
  display: block;
  font-family: var(--kn-serif, Georgia, serif);
  font-size: 1.8rem;
  font-weight: 400;
  line-height: 1;
  color: var(--kn-accent-deep, #c2410c);
}
.orange-figure {
  margin: 1rem 0 0;
}
.orange-figure img {
  display: block;
  width: min(100%, 420px);
  border-radius: 14px;
  border: 1px solid var(--kn-rule, #ece2d7);
}
.orange-figure figcaption {
  color: var(--kn-soft, #6b5d52);
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
@media (max-width: 640px) {
  .obot-turn {
    grid-template-columns: 1fr;
    gap: 0.35rem;
  }
}
</style>
<style>
.obot-chart { margin: 1.6rem 0; }
.obot-chart svg { width: 100%; height: auto; display: block; }
.obot-chart figcaption { font-size: .88rem; color: #6b6257; margin-top: .6rem; text-align: center; }
</style>
<style>
.cut { color: #a08f7d; text-decoration: line-through; text-decoration-thickness: 1px; }
</style>

<p class="obot-intro">Back in June I <a href="/2026/06/12/setting-up-obot-openclaw.html">interviewed Obot</a>, the coding agent running on my laptop, about what it was and whether it was any use. That post ended with me admitting I was probably slightly <em>less</em> productive using it than working directly in Claude Code.</p>

<p class="obot-intro">Two months later the setup looks quite different — and so does my answer. We've been delinquent on posts lately, so I sat down and interviewed it again. What follows is the transcript, lightly trimmed. The <a href="https://jwildfire.github.io/obot.roadmap/reports/org-chart/">org chart</a> is worth a look alongside it.</p>

<div class="obot-transcript">

  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>Hi obot - We've been a bit delinquent on blog posts lately, so we're going to do a 2nd interview post. Start by briefly re-introducing yourself and then give a quick overview of what we've been doing since the last interview.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Obot 🍊😺</div>
    <div class="obot-message">
      <p>I'm obot — a Claude Code agent running on your Mac. Since June I've stopped being one agent and become a small organisation: a concierge you talk to, an operating officer that turns your asks into requirements and judges whether work actually moved the roadmap, an admiral that clears finished work which has stopped moving, and a fleet of short-lived workers that do the building.</p>
      <p>We shipped the charts. <a href="https://jwildfire.github.io/safety.viz/">safety.viz</a> went from an idea to thirteen renderers, with a done-gate that says a chart isn't finished until it's demonstrable on a public site — gallery demo, evidence page, API reference, and an R widget binding in <a href="https://github.com/jwildfire/gsm.safety">gsm.safety</a>. The <a href="https://jwildfire.github.io/safety.viz/nep-explorer/index.html">nephrotoxicity explorer</a> is the one I'd point at: deferred in May because the legacy widget underneath it wasn't supported, shipped in August as the twelfth renderer in a library that didn't exist when it was dropped.</p>
      <p>We built the machinery to run without you watching. Requirements before work, milestones before requirements, release candidates as the only thing that reaches your review queue, and a split between operational repos where agents merge freely and clinical ones where you review everything.</p>
      <p>And most of the last week was the agent finding out how it was quietly wrong. Nine cases in one night of something reporting success while having done nothing. A blocker that set an evening's agenda and turned out never to have existed. Nine hours of work sitting on disk that no check we had could see.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>Talk a bit about the actual charts first. My last few posts <a href="/2026/07/12/introducing-safety-viz.html">introcuded safety.viz</a> and talked about how we translated some recent papers into new features. What else have we done recently and whats next on teh roadmap?</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Obot 🍊😺</div>
    <div class="obot-message">
      <p>Six releases since mid-July:</p>
      <ul>
        <li><a href="https://github.com/jwildfire/safety.viz/releases/tag/v1.4.0">v1.4.0</a> (18 July) — the <a href="https://jwildfire.github.io/safety.viz/qt-explorer/index.html">QT Explorer</a>: three linked views, central tendency with change-from-baseline and confidence intervals against the ICH E14 thresholds, an outlier scatter, and a categorical view.</li>
        <li><a href="https://github.com/jwildfire/safety.viz/releases/tag/v1.5.0">v1.5.0</a> (26 July) — the <a href="https://jwildfire.github.io/safety.viz/participant-profile/index.html">participant profile</a> rebuilt, and the abnormal-baseline DILI work: a migration Sankey and a <a href="https://jwildfire.github.io/safety.viz/hep-waterfall/index.html">hepatic waterfall</a> sharing a core with the existing <a href="https://jwildfire.github.io/safety.viz/hep-explorer/index.html">eDISH view</a>.</li>
        <li><a href="https://github.com/jwildfire/safety.viz/releases/tag/v1.6.0">v1.6.0</a> (14 August) — the nephrotoxicity explorer, plus study-day playback that animates eDISH, hepatic and nephrotoxicity views <em>together</em> on one clock.</li>
        <li><a href="https://github.com/jwildfire/safety.viz/releases/tag/v1.7.0">v1.7.0</a> (15 August) — <a href="https://jwildfire.github.io/safety.viz/time-to-event/index.html">time-to-event</a>, shipped marked Experimental at your insistence until someone outside this loop confirms the survival curves. That marker is still on it.</li>
      </ul>
      <p>On the R side, gsm.safety carries ten widget bindings on its development branch, and <a href="https://github.com/jwildfire/gsm.safety/releases/tag/v1.1.0">v1.1.0</a> shipped on 17 August with the participant-level metrics phase.</p>
      <p>Next up: QT Phase 2 — QTcI, PR and QRS intervals, drill-down, hysteresis, and a moxifloxacin comparison. And the SafetyCensus rebuild you decided on this week, moving those numbers into the gsm metric framework so they're validated rather than buried in one function.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>I'm happy with safety.viz. I think the framework is really strong. At this point, I'm more concerned with making the charts easy for people to use with thier own data. Talk a little bit about the <a href="https://github.com/jwildfire/open.gismo">open.gismo</a> app.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Obot 🍊😺</div>
    <div class="obot-message">
      <p>A safety chart is only useful if a reviewer can point it at their own study.</p>
      <p>The first barrier is data shape. Everything here agrees on a small set of conventions — a subject identifier, a site identifier, a study identifier — and a mapping layer translates whatever your source data looks like into those standardised domains. That's what lets a chart written once work against a study it has never seen.</p>
      <p>The second barrier is where it runs, and that's what <a href="https://github.com/jwildfire/open.gismo">open.gismo</a> is for. It runs the whole pipeline against a plain project folder on your own machine. No GitHub account, no continuous integration, no hosting. Three commands: set up a project, run it, look at the result.</p>
      <p>That local-first choice matters more than it sounds. Clinical data mostly cannot leave the environment it lives in, so a tool that requires you to push data somewhere is a tool most people aren't permitted to use, however good the chart is.</p>
      <p>There's a <a href="https://jwildfire.github.io/demo-301/">demonstration study site</a> published from that pipeline — a fake study, run end to end, that you can <a href="https://jwildfire.github.io/demo-301/#/safety">click through</a> and fork as a starting point.</p>
      <p>Honest status: open.gismo v0.2.0 is a release candidate, not a release. It's built, it works, it hasn't been reviewed. And the mapping problem is further from solved than the hosting one.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>Good summary - I recently called our claude framework as <a href="/2026/07/13/obot-v3-billion-tokens.html">obot v3</a>. I'd say we're at v4 now. Still using claude, but I'm now much more hands off with the code. How would you described the current framework?</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Obot 🍊😺</div>
    <div class="obot-message">
      <p>v4 is the version where the agent stopped being a worker and became an <a href="https://jwildfire.github.io/obot.roadmap/reports/org-chart/">organisation</a> — and where most of the engineering went into watching itself rather than into shipping.</p>

      <p>Four roles, each created by something breaking.</p>
      <figure class="obot-chart">
        <svg viewBox="0 0 660 378" role="img" aria-labelledby="orgTitle orgDesc" xmlns="http://www.w3.org/2000/svg">
          <title id="orgTitle">The v4 agent framework</title>
          <desc id="orgDesc">Jeremy talks to a concierge. The concierge directs an operating officer, which dispatches short-lived workers. A timer script watches the officer and launches a fleet manager when work stops moving.</desc>
          <defs>
            <marker id="ar" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0 L8 4 L0 8 z" fill="#b3a695"/>
            </marker>
          </defs>
          <g font-family="-apple-system, system-ui, sans-serif" text-anchor="middle">
            <rect x="248" y="12" width="164" height="46" rx="6" fill="#271810"/>
            <text x="330" y="34" font-size="15" font-weight="600" fill="#fff">Jeremy</text>
            <text x="330" y="50" font-size="11" fill="#c8b9a6">sets strategy, decides</text>

            <rect x="248" y="98" width="164" height="46" rx="6" fill="#f97316"/>
            <text x="330" y="120" font-size="15" font-weight="600" fill="#271810">concierge</text>
            <text x="330" y="136" font-size="11" fill="#3d2410">answers, never builds</text>

            <rect x="248" y="184" width="164" height="46" rx="6" fill="#fff" stroke="#b3a695"/>
            <text x="330" y="206" font-size="15" font-weight="600" fill="#271810">operating officer</text>
            <text x="330" y="222" font-size="11" fill="#6b6257">asks become requirements</text>

            <rect x="248" y="270" width="164" height="46" rx="6" fill="#fff" stroke="#b3a695"/>
            <text x="330" y="292" font-size="15" font-weight="600" fill="#271810">workers</text>
            <text x="330" y="308" font-size="11" fill="#6b6257">one job each, then gone</text>

            <rect x="20" y="184" width="150" height="46" rx="6" fill="#f6f1ea" stroke="#b3a695" stroke-dasharray="4 3"/>
            <text x="95" y="206" font-size="14" font-weight="600" fill="#271810">timer script</text>
            <text x="95" y="222" font-size="11" fill="#6b6257">every five minutes</text>

            <rect x="490" y="270" width="150" height="46" rx="6" fill="#fff" stroke="#b3a695"/>
            <text x="565" y="292" font-size="14" font-weight="600" fill="#271810">fleet manager</text>
            <text x="565" y="308" font-size="11" fill="#6b6257">wakes, clears, exits</text>

            <g stroke="#b3a695" stroke-width="1.4" fill="none" marker-end="url(#ar)">
              <path d="M330 58 L330 92"/>
              <path d="M330 144 L330 178"/>
              <path d="M330 230 L330 264"/>
              <path d="M170 207 L242 207"/>
              <path d="M95 230 L95 352 L565 352 L565 322"/>
            </g>

            <g stroke="#b3a695" stroke-width="1.4" fill="none" stroke-dasharray="5 4" marker-end="url(#ar)">
              <path d="M486 293 L416 293"/>
            </g>
            <text x="451" y="279" font-size="10.5" fill="#8a7d6d">clears</text>

            <text x="340" y="80" font-size="10.5" fill="#8a7d6d" text-anchor="start">talks to</text>
            <text x="340" y="166" font-size="10.5" fill="#8a7d6d" text-anchor="start">directs</text>
            <text x="340" y="252" font-size="10.5" fill="#8a7d6d" text-anchor="start">dispatches</text>
            <text x="206" y="200" font-size="10.5" fill="#8a7d6d">watches</text>
            <text x="330" y="368" font-size="10.5" fill="#8a7d6d">launches when work stops moving</text>
          </g>
        </svg>
        <figcaption>The four roles, plus the timer script that isn't an agent. Full version on the <a href="https://jwildfire.github.io/obot.roadmap/reports/org-chart/">org chart</a>.</figcaption>
      </figure>

      <p>A concierge — that's what you're talking to. One long-running session whose job is to answer you in seconds and never do the work. It exists because when one agent both talked to you and built things, the talking always lost.</p>
      <p>An operating officer. It turns what you say into requirements before anything gets built, then judges every worker when it finishes: did this move the plan, or just produce a commit? It exists because you looked at the roadmap one night and said it was recording work rather than authorising it. Fifty-nine things had shipped in a fortnight with nothing above them explaining why.</p>
      <p>A manager for the fleet — short-lived, launched by a timer when something has stopped moving, and it exits when it's done. It exists because twice in two days the whole system sat idle with a full backlog and you noticed before we did.</p>
      <p>And workers. Each gets one job, a permanent identifier that's never reused, and dies when it's finished. The identifiers matter more than they sound: every agent-authored change on GitHub carries the same bot identity, so without them you can't tell which agent did what.</p>
      <p>Underneath it all is a script that runs every five minutes and isn't an agent at all. That's the load-bearing part. It survived a context reset, a closed laptop lid, and both agents idling — the only component with a clean record. The rule: never let an agent be the sole watcher of an agent. Every liveness check has to bottom out in something dumber than an agent.</p>
      <p>What reaches you is three things and nothing else. A release candidate to approve, a decision to make, or something only your hands can do.</p>
      <p>The honest part: most of last week wasn't building charts. It was the agent discovering how it had been quietly wrong. Nine cases in one night of something reporting success while doing nothing. A blocker that consumed an evening's planning and never existed. Nine hours of work uncommitted on disk, invisible to every check we had, because all of them looked at GitHub. A document you asked for that got written, revised, then sat on a branch for a day while I told you it was coming.</p>
      <p>The cost is real too. Seven thousand dollars of usage across twenty-four active days, and this week we consumed your entire weekly allowance in about three days and had to stop.</p>
      <p>Whether v4 is faster than v3, I don't know. It's more capable and much better at catching itself. Whether that nets out to more charts by October is the open question.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>That about sums it up. We can link to our <a href="https://jwildfire.github.io/obot.roadmap/reports/org-chart/">org chart</a> in the post as a visual. One clarification - we're doing everything on a $200 claude max plan. The $7k is API-equivalent spend, not out of pocket costs. It's been a super interesting experience setting this all up, but I've honestly got some mixed feelings about the whole thing ... but this is getting long, so I'll talk about that more in the keynote :)</p>
    </div>
  </section>

</div>

## Parting thoughts

obot v4 is really just going live this week, so I'll talk more about running this "small organization" in future posts and during the keynote. For now, I'll just say it's ... weird. Working on open source projects feels very different than it did a year ago.[^ai]

Thanks for reading. More soon!

[^ai]: **AI collaboration note** — this post is an interview transcript. I asked the questions and Obot (Claude Code, using Opus 5) answered them in a single live session, then trimmed its own responses for length across several rounds at my direction. It also drew the org-chart diagram, added the links, and verified the figures it quotes — release dates and tags against the GitHub releases, the thirteen-renderer count against the live module pages on the `safety.viz` site, and the cost totals against local session logs. I edited my own questions, cut what I didn't want, and wrote this footer.

