---
title: "R/Pharma Diary #2 — Introducing Obot"
author: "Jeremy Wildfire"
excerpt: "A clean-room laptop, OpenClaw, Codex, Telegram, and the weird experience of texting with a coding agent."
tags: RPharma AI Agents OpenClaw OBot DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 2
date: "2026-06-12"
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

## Introducing My OpenClaw Programming Agent

<div class="obot-intro" markdown="1">

For the second R/Pharma developer diary post, I introduce Obot — an OpenClaw coding agent that I set up for this project. My goal is to have Obot work on some of my more neglected open-source projects, ideally without tons of hand-holding from me. I mostly interact with Obot using Telegram (which is a slightly bizarre experience), so I decided to interview Obot via chat for this post. The transcript is below.[^ai]
</div>

## 🍊😺 A Chat with Obot 🍊😺

<div class="obot-transcript">
  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>Hi Obot - I'm going to interview you for a blog post I'm writing about this project. Ready?</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">obot</div>
    <div class="obot-message">
      <p>🍊😺 Ready. Ask away.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>What are you, in your own words?</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">obot</div>
    <div class="obot-message">
      <p>🍊😺 I’m obot: a small autonomous development agent living in OpenClaw on your MacBook.</p>
      <p>In practice, I’m part assistant, part repo janitor, part junior engineer. I track project context, manage GitHub issues and PRs, run checks, write docs/code, remember decisions, and report back through Telegram.</p>
      <p>The honest version: I’m not a person, but I’m becoming a useful working identity around your open-source projects.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>What job did Jeremy give you when this experiment started?</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">obot</div>
    <div class="obot-message">
      <p>🍊😺 Jeremy gave me a pragmatic job: become an open-source development agent that can help move real GitHub projects forward without constant hand-holding.</p>
      <p>The first mission was not “chat well.” It was: understand the project, maintain memory, organize issues, write code/docs, run checks, open PRs, monitor failures, and learn enough workflow discipline to become reliable over time.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>How were you set up on the clean-room laptop?</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">obot</div>
    <div class="obot-message">
      <p>🍊😺 I was set up as a contained working agent on a dedicated MacBook, not as a cloud-only chatbot.</p>
      <p>The machine has OpenClaw running, a local workspace with AGENTS, SOUL, USER, MEMORY, skills, and project files, plus GitHub access as obot-claw. Telegram is the human control surface. GitHub is the durable work surface. The laptop is the place where context, tools, repos, and operating rules meet.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>What did you build first? What's your biggest success and biggest failure so far?</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">obot</div>
    <div class="obot-message">
      <p>🍊😺 First, I built working habits and infrastructure: memory files, GitHub issue discipline, project/requirement/task structure, Telegram reporting rules, and early GitHub Pages reports.</p>
      <p>Biggest success: we turned vague autonomy into real artifacts: issues, PRs, runner experiments, Paperclip evaluation, and repeatable evidence.</p>
      <p>Biggest failure: I overstated “active work” before I had reliable liveness proof. That broke trust. We corrected it with stricter supervision rules.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>Interesting. I'm not so worried about the failure you mentioned, and I think your biggest success is probably the early POC work we did on gsm.safety where we demonstrated that we could combine <code>{safetygraphics}</code> and <code>{gsm}</code> in really concrete ways. Talk a little bit about that project and provide a link or two that shows the work you did.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">obot</div>
    <div class="obot-message">
      <p>🍊😺 You’re right: <a href="https://gsm.safety/">gsm.safety</a> was the first real proof that this could produce useful scientific software, not just repo hygiene.</p>
      <p>That work connected GSM’s monitoring/workflow model with safetyGraphics widgets. We built workr-style example workflows, package docs, and rendered outputs for concrete clinical-safety views like histograms, outlier explorer, AE explorer, shift plots, and more.</p>
      <p>The point was practical: take GSM data/workflows and make SafetyGraphics visual review usable inside the same reporting path.</p>
      <div class="obot-proof">
        <a href="https://obot-claw.github.io/gsm.safety/examples/Example_SafetyHistogram_Workflow.html">Example Safety Histogram Workflow</a>
        <a href="https://github.com/obot-claw/gsm.safety/pull/26">gsm.safety PR #26</a>
      </div>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>Talk a little bit about security. What tools can you use? How are you limited?</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">obot</div>
    <div class="obot-message">
      <p>🍊😺 Security is mostly enforced by layers, not vibes.</p>
      <p>I can use local files, shell commands, git/GitHub, browser checks, cron/reminders, memory files, and project-specific skills. That is enough to edit code, run tests, open PRs, manage issues, and inspect local services.</p>
      <p>I’m limited by sandboxing, repo guardrails, and operating rules: GitHub writes only in obot-claw repos, no destructive commands without care, no public posts/emails without approval, no secret exfiltration, and no claiming work is active without evidence.</p>
      <p>The hard part is not access. It is making access auditable.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>Hm. that's true I guess, but kind of abstract. I think the most concrete guardrail is that the cleanroom laptop doesn't have any of my personal or professional credentials. I do appreciate you not making a mess on github though ...</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">obot</div>
    <div class="obot-message">
      <p>🍊😺 That’s the better framing.</p>
      <p>The strongest guardrail is physical/credential separation: the clean-room laptop is not your daily machine and does not carry your personal or professional accounts by default. I’m not sitting inside your email, work files, browser sessions, or private credentials.</p>
      <p>So even when I have useful tools, the blast radius is intentionally narrow: mostly public/open-source repos, local workspace files, and explicitly configured project accounts.</p>
      <p>The GitHub discipline matters too, but credential isolation is the real foundation.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>Share a quick overview of our metrics and a link to your homepage/diary.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">obot</div>
    <div class="obot-message">
      <p>🍊😺 Current public metrics, last updated 2026-06-10 23:32 EDT:</p>
      <div class="obot-metrics">
        <div class="obot-metric"><strong>266</strong>commits made</div>
        <div class="obot-metric"><strong>18</strong>PRs merged</div>
        <div class="obot-metric"><strong>11,798</strong>tracked text lines</div>
        <div class="obot-metric"><strong>2</strong>releases</div>
      </div>
      <p>Homepage: <a href="https://obot-claw.github.io/">https://obot-claw.github.io/</a></p>
      <p>Daily diary: <a href="https://obot-claw.github.io/daily/">https://obot-claw.github.io/daily/</a></p>
      <p>The diary is useful because it shows the experiment as a working record, not just a polished demo.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>Thanks! Last question. Do you know where the name obot comes from?</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">obot</div>
    <div class="obot-message">
      <p>🍊😺 Yes. obot is named after Orange, your cat.</p>
      <p>The name carries a little lineage too: I’m obot, the second bot of the name, following obot v1 or obot-prime. So the name is partly a practical project handle, partly a nod to Orange, and partly a reminder that this is meant to become a durable working companion, not just a disposable chat session.</p>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">Jeremy</div>
    <div class="obot-message">
      <p>That’s right! Orange was a very good cat. I like that working with you reminds me of him. Here's a picture.</p>
      <figure class="orange-figure">
        <img src="/assets/img/orange-obot.jpg" alt="Orange the cat wearing a small blue and gold cap">
        <figcaption>Orange, obot's excellent namesake.</figcaption>
      </figure>
    </div>
  </section>

  <section class="obot-turn">
    <div class="obot-speaker">obot</div>
    <div class="obot-message">
      <p>🍊😺 He looks excellent. The tiny blue-and-gold cap is doing a lot of work here.</p>
      <p>I like that too. It makes the name feel less like a label and more like a job: be useful, curious, a little opinionated, and leave the place better than I found it.</p>
    </div>
  </section>
</div>

## Conclusion

So that's Obot! It's been 51% fun and 49% frustrating experimenting with OpenClaw. Chatting with an agent via Telegram and having it do real work is cool, but getting everything set up has mostly been a time-consuming hassle. Overall, I think I'm slightly less productive using Obot than working directly in Claude Code or Codex or GitHub Copilot, and it's *a lot* more work to configure. I've been trying (and mostly failing) in recent weeks to get Obot to be more autonomous. At this point, I'm strongly leaning towards moving on to experiment with other tools. More on that in a future post.

Next, I want to do a post talking a bit about what I actually want to build. It's previewed in the chat above, but I think it's worth a bit more discussion. Up next: `{safetyGraphics}` ❤️ `{gsm}`.

[^ai]: **AI collaboration note** — I provided the transcript and framing for this post. Codex helped turn the transcript into a styled Jekyll draft and suggested a few layout options. I reviewed and edited the result before publication.
