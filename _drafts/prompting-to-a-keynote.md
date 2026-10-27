---
title: "Prompting to a Keynote"
author: "Jeremy Wildfire"
excerpt: "The prompts behind my R/Pharma 2026 keynote deck, word for word: from the first brief to a dance party of orange cats."
tags: RPharma AI ClaudeCode Keynote
---

<!-- DRAFT (Claude, 2026-10-21). Every block quote is Jeremy's prompt, copied word for word from the Claude Code session logs, typos included. The sentences around them are Claude's placeholders: rewrite them in your own voice. Add a `date:` and move to _posts/ when it's time to publish. -->

*A friend asked how I built the slides for my [R/Pharma 2026 keynote](https://jwildfire.github.io/2026/10/21/rpharma-2026-keynote-annotated.html). The short answer is one prompt at a time. Here are the ones that mattered.*

The [deck](https://jwildfire.github.io/keynote/keynote.html) is a single HTML file in this blog's repository. Each slide is a `<section>`, and my speaker notes sit in the same file. I built it with Claude Code over the three weeks before the talk. I wrote the outline and the words I say. Claude built the slides, rendered each one to check it, and committed every change in small steps so I could undo it.

## The first brief

A cloud session set up an empty deck in the blog's "rainbow hex" theme. On 1 October I handed it to a session on my Mac with a long brief. Here's the part that did the work:

> Next step: I'll give you an outline. Turn it into slides in keynote/slides.html: one section per act, the outline's beats as slides, draft speaker notes, and s-todo slides where content is missing. Pull facts and numbers from research-digest.md and cite the post in each slide's notes. Open slides.html locally in Chrome to check it, commit to the same branch, and don't open a PR unless I ask.

The rest of the brief described the files: where I drop outlines and dictation, and a digest of the nine [developer diary](https://jwildfire.github.io/keynote/) posts to pull facts from.

<figure class="kn-anim">
  <a href="https://jwildfire.github.io/keynote/keynote.html#1"><img src="/assets/img/rpharma-2026-keynote/slide-01.jpg" alt="The title slide: What can we actually do with AI agents right now? Jeremy Wildfire, 21 October 2026, with the rainbow hex logo." loading="lazy"></a>
  <figcaption>Where the brief led: the title slide, in the blog's rainbow hex theme.</figcaption>
</figure>

## Orange becomes the hook

Fifteen minutes later, the talk got its hook:

> Close the gaps. Also I just downloaded some photos of orange that i want to work into the presentation. grab the zip file from downloads and add them to our assets. We'll introduce orange on the first slide and then use the photos of him "working" on transition slides throughout. This will be our hook. Go ahead and set up the "Introducing Orange" slide with the picture of him with the blue hat on right after the title slide

Then, a few minutes apart:

> "He was a very good cat" for orange slide quote

> Add one more slide showing him "working" maybe the pic of him sleeping on my laptop. "But a somewhat inconsistent co-worker"

<figure class="kn-anim">
  <a href="https://jwildfire.github.io/keynote/keynote.html#2"><img src="/assets/img/rpharma-2026-keynote/slide-02.jpg" alt="Introducing Orange, 2008–2022. He was a very good cat. Orange in a blue hat, with a disclaimer callout from Orange's hex." loading="lazy"></a>
  <figcaption>The "Introducing Orange" slide: the blue hat, and "He was a very good cat."</figcaption>
</figure>

## Orange's callouts

The question running through the talk was "What can we actually do with AI agents right now?" Orange got to answer it:

> I want to start adding little call outs for "What are agents good at now?" throughout the deck. Direction: I want a hex with Oranges face and a thumbs up on the right. header with the question (small text). Body with answer e.g. "writing code!". Ideally we'll call out several of the items that we discuss in the close out.  give me a few design options.

> i want the "orange what is it good at comments" to pop up as a 2nd click on the slides. I talk through the main content and then tie it back to the overall theme at the end.

<figure class="kn-anim">
  <a href="https://jwildfire.github.io/keynote/keynote.html#33"><img src="/assets/img/prompting-to-a-keynote/slide-33.jpg" alt="The first renderer took a few weeks; the next six took a weekend. Orange's thumbs-up callout says what worked: porting old code." loading="lazy"></a>
  <figcaption>The second click on slide 33: Orange's thumbs-up callout says what worked.</figcaption>
</figure>

## Fixing the middle

By 5 October the middle of the talk had the right content in the wrong shape:

> I think the content mostly there, but the narrative (and the slide structure) is a total mess. Let's add more structure. Frame it as a journey. 5 versions of obot created during a summer or experiments. Name the Obot Versions explicitly (v1 = OpenClaw, v5=Opus 5.5, etc) Maybe a funny robot cat hex for each one? … From now on start saving any discarded slides in a reserves section in the deck. Just add a note about when it was demoted from the main deck.

<figure class="kn-anim">
  <a href="https://jwildfire.github.io/keynote/keynote.html#28"><img src="/assets/img/rpharma-2026-keynote/slide-28.jpg" alt="A summer down the AI rabbit hole, with obot: Orange, then a robot-cat hex for each version, v1 to v5." loading="lazy"></a>
  <figcaption>The journey: a robot-cat hex for each version of obot.</figcaption>
</figure>

That last sentence became a standing rule. Nothing got deleted from the deck; cut slides went to a Reserves section at the back with the date they left.

## The dancing oranges

Simon Willison had just posted his [kākāpō party](https://simonwillison.net/2026/Sep/26/kakapo-party/), and I wanted one for the last slide:

> I want to make an orange cat dance party inspired by this https://simonwillison.net/2026/Sep/26/kakapo-party/ as my last slide for the presentation. Doable?!?!

It was. Twenty minutes later:

> love it. push to jwildfire.github.io/keynote/party.html. If the user hits "s" Let's have a kokobo pop out from the bottom corner and say "Thanks, Simon!"

<figure class="kn-anim">
  <a href="https://jwildfire.github.io/keynote/party.html"><img src="/assets/img/prompting-to-a-keynote/party-thanks-simon.jpg" alt="The Orange Party: rows of pixel-art Oranges in party hats dancing on a rooftop, and a kākāpō in the corner saying Thanks, Simon!" loading="lazy"></a>
  <figcaption>Press S at the party and the kākāpō says thanks.</figcaption>
</figure>

## More Oranges

Orange picked up a couple of costumes along the way. Inspector Orange covers the quality questions:

> I want to work in a few "Quality Check-in"  slides. I'll make a new "inspector orange hex" to support. Basically want to add a little structure around the various quality discussions. Propose where those beats land and which slides get converted to the new format.

<figure class="kn-anim">
  <a href="https://jwildfire.github.io/keynote/keynote.html#18"><img src="/assets/img/rpharma-2026-keynote/slide-18.jpg" alt="Quality scales across the full package ecosystem: 76 qualified releases across 9 packages, and Inspector Orange with a magnifying glass saying Now that's evidence." loading="lazy"></a>
  <figcaption>A quality check-in on slide 18: Inspector Orange approves of the evidence.</figcaption>
</figure>

Hacker Orange showed up the same day.

<figure style="margin:0 0 1.5em;text-align:center">
<p style="display:flex;gap:1.5rem;justify-content:center;flex-wrap:wrap;margin:0">
  <img src="/keynote/assets/hex/orange-inspector.png" alt="The Inspector Orange hex: Orange with a magnifying glass and a clipboard." width="150" loading="lazy">
  <img src="/keynote/assets/hex/orange-hacker.png" alt="The Hacker Orange hex: Orange in a hoodie at a laptop, in front of green code rain." width="150" loading="lazy">
</p>
<figcaption style="margin-top:0.4em;font-size:0.85em;color:var(--kn-soft)">Inspector Orange and Hacker Orange, each with his own hex.</figcaption>
</figure>

That night they both got invited to [the party](https://jwildfire.github.io/keynote/party.html):

> update https://jwildfire.github.io/keynote/party.html to include the new oranges added to the deck. hacker orange, inspector orange. any other fun callouts from the deck are great. let me know your plan and i'll approve.

<figure class="kn-anim">
  <a href="https://jwildfire.github.io/keynote/party.html"><img src="/assets/img/prompting-to-a-keynote/party-inspector.jpg" alt="The Orange Party again, with Inspector Orange in the corner asking What evidence do you have?" loading="lazy"></a>
  <figcaption>Press I and Inspector Orange asks his usual question.</figcaption>
</figure>

## Most prompts were small

<!-- DRAFT: Claude's suggested angle for the close. Keep, cut or rewrite. -->

Those are the big ones. Most prompts were a sentence reacting to the last build:

> use a tiny hex from the "forcats" package as the bullet on this slide (we'll try to work in some package hexes for fun throughout)

> Move the page number from the footer to the header and fill in the line of hexes based on % of the talk that is complete

> We're really overdoing it with the italicized orange works. Probably want to remove almost all of them.

<!-- TODO (Jeremy): your takeaway for someone building their own deck this way. -->

---

*AI collaboration note: I built the deck with Claude Code. For this post, Claude collected my prompts from the session logs and drafted the text around them. I rewrote it before publishing. The prompts are copied as I typed them, typos and all.*
