---
title: "R/Pharma Diary #3 — Re-Introducing safetyGraphics"
author: "Jeremy Wildfire"
excerpt: "Why do the acknowledgements always come at the end? Before I try to modernize safetyGraphics with AI, a look back: the projects and people that led to it."
tags: RPharma AI ClinicalTrials SafetyGraphics DeveloperDiary
series: "R/Pharma 2026 developer diary"
series_part: 3
date: "2026-06-16"
---

As part of the keynote, I want to see if AI can update and modernize [`{safetyGraphics}`](https://github.com/SafetyGraphics/safetyGraphics). `{safetyGraphics}` was the first big open-source project I worked on, so I also want to talk a bit more generally about open source in clinical trials. I'll mention a bunch of projects, but mostly I want to give credit to a bunch of awesome people that I've been lucky enough to work with[^sappy]. Usually acknowledgements go at the end of a talk, but let's just get started on that now.[^alexa]

## A Brief Prehistory

I played with computers a ton as a kid, learned to program a bit in high school and then for real in college. I remember that at one point in undergrad I took a Computer Engineering class where we wrote a compiler from scratch — like from 0s and 1s. I also programmed a message board in Perl and did a bunch of other computer science-y stuff, but didn't love the theory or algorithms. I liked building things, but also wanted to do something that helped people in some way. So, after teaching middle school for a year[^teaching], I went back to school for biostatistics.[^parents]

I wrote a bunch of SAS code in grad school and at my internship, including an 80-page-long master's paper that was probably 60 pages of SAS Graph output.[^sas] It was ... not fun. Then at my first job, [@acalatroni](https://github.com/acalatroni)[^agustin] introduced me to R, and it was soooooooo much better. This was in the early 2000s, so pre-[`{tidyverse}`](https://www.tidyverse.org/) and [`{ggplot}`](https://ggplot2.tidyverse.org/). I remember *a lot* of super-complicated [`{lattice}`](https://cran.r-project.org/package=lattice) code.

<figure>
  <img src="/assets/img/fig1_NYT.png" alt="Interactive data visualization in the New York Times">
  <figcaption>Figure 1. Interactive graphics in the <em>New York Times</em>.</figcaption>
</figure>

A few years into that job, I started seeing [amazing interactive graphics](https://archive.nytimes.com/www.nytimes.com/interactive/2012/11/02/us/politics/paths-to-the-white-house.html) like the one above in the *New York Times* and thought, "Why can't I do this for work?" And my boss[^herman] said, go for it,[^chile] and let me take 2 weeks to learn JavaScript! I used [D3](https://d3js.org/) (called [Protovis](https://mbostock.github.io/protovis/) back then) to make the clunkiest interactive graphic ever.[^firstgraphic] And THAT was fun, I was hooked.

I did that for a bunch of years. Made [cool stuff](https://rhoinc.github.io/graphics/) for clinical trials in R and JavaScript. I started out working on NIH-funded Asthma and Allergy work, where I helped to write a [bunch of papers](https://scholar.google.com/citations?user=Hn0AnpIAAAAJ&hl=en). Finally, I moved from my study statistician role into a pure data science title[^russ], where I was just focused on creating useful tools for clinical trials. I got to hire and work with a [bunch](https://github.com/bzkrouse) [of](https://github.com/pburnsdata) [amazing](https://github.com/nandriychuk) [people](https://github.com/samussiah) — many of whom have since spoken at this conference! The industry started doing more work in R, so we did too. We wrote lots of fancy `{ggplot}` code, wrapped our D3 renderers in [`{htmlwidgets}`](https://www.htmlwidgets.org/), hosted them in [`{shiny}`](https://shiny.posit.co/), and piped it all around with `{tidyverse}`.[^R] We still wrote JavaScript code, but mostly we shared things using R, since that was what people were using.

## ASA-DIA Working Group

My team was called the Graphics Group, and we shipped a lot of tools — much of which is [still publicly available](https://rhoinc.github.io/graphics/) and useful! We released open-source tools on GitHub, wrote papers with study teams, and presented a few early JavaScript prototypes, including an Interactive [Adverse Event Explorer](https://github.com/RhoInc/aeexplorer).[^harrell]

<figure>
  <img src="/assets/img/fig2_aeexplorer.gif" alt="The Adverse Event Explorer interface">
  <figcaption>Figure 2. The Adverse Event Explorer.</figcaption>
</figure>

Then I got invited to join a new-ish working group[^wg] for safety monitoring[^melvin] and eventually ended up co-leading that working group.[^coleads] What made the working group special was how closely the clinicians and data scientists actually worked together. The doctors knew how to monitor trials, and we knew how to build the tools to help them do it.

One thing we all agreed on was that the status quo was painful. I'd worked on several clinical study reports and the wall of numbers was 100% impenetrable (I always use [this Harry Potter GIF](https://giphy.com/gifs/UJS4fUKBaTc8o) to describe the experience). Interactive graphics make it so much easier to get to the data that really matter. Some analysis platforms existed, but were generally expensive and/or difficult to use. The clinicians didn't need or want a full business intelligence suite allowing them open-ended access to every aspect of clinical data. They needed a guided clinical monitoring workflow supported by simple tools in their web browser. So that's what we tried to build.

## `{safetyGraphics}`

So what is `{safetyGraphics}`, exactly? All those scattered prototypes — the Adverse Event Explorer, the eDISH hepatic explorer, and a bunch of others — eventually came together into a single open-source R package: a Shiny app that lets a clinical team explore a trial's safety data interactively in the browser, instead of paging through hundreds of static tables.

And I'm genuinely proud of what we built. People across dozens of companies met regularly for 5 years. We wrote papers, presented at a bunch of conferences and at the FDA. We met with the world's leading experts on clinical trial safety (and really, just on human health) and did our best to create easy-to-use free tools that allowed anyone to leverage that knowledge to make new medicines. It was great.

Honestly, the best way to understand `{safetyGraphics}` is to play with the tool. The full demo app is [here](https://jwildfire.shinyapps.io/safetyGraphics/), but I think the best work we did is this eDISH [hepatic explorer](https://safetygraphics.github.io/hep-explorer/) — eDISH is the standard plot for flagging potential drug-induced liver injury — and the associated [clinical workflow](https://github.com/SafetyGraphics/SafetyGraphics.github.io/raw/master/guide/HepExplorerWorkflow_v1_2_1.pdf). There's tons more information about the project [at the website](https://safetygraphics.github.io/safetyGraphics/).

<figure>
  <img src="/assets/img/fig3_hepexplorer.gif" alt="The eDISH hepatic safety explorer">
  <figcaption>Figure 3. The eDISH Hepatic Safety Explorer.</figcaption>
</figure>

## A Few Quiet Years

I stopped active work on `{safetyGraphics}` when I moved to Gilead in 2021 and started working on RBQM. My main goal with `{safetyGraphics}` was to demonstrate the value of both open-source tools and interactive graphics in clinical trials. We wanted to show that a handful of webpages is more useful and usable than a 200-page PDF. I think we did that. Now there's a whole crop of impressive projects leveraging open-source tools in clinical trials (ref [`{teal}`](https://github.com/insightsengineering/teal) and [submissions pilots](https://r-consortium.org/posts/submissions-wg-2026/)).

What we didn't do was change the industry standard for how people monitor safety, and that is just a bit of a bummer. Maybe we moved the needle a bit, but those 200-page walls of text still exist in Clinical Study Reports, and `{safetyGraphics}` isn't fully GxP-compliant. [pharmaverse](https://pharmaverse.org/) is making progress towards modernizing submissions, but clinical trial monitoring both for RBQM and safety is still a grind.

Which brings me back to where I started. Doing `{safetyGraphics}` justice always felt like it needed a team and a budget I no longer have — but with AI agents, I'm honestly not sure that's true anymore. Figuring out whether it is, is what this whole keynote experiment is about. The [OpenRBQM](https://openrbqm.github.io/) team is already dragging clinical monitoring toward something more modern, and I think that work could give `{safetyGraphics}` a second life too.[^ai] Up next: `{safetyGraphics}` ❤️ `{gsm}`.

[^sappy]: I'm going to put all the overly sappy stuff in footnotes, so just skip them if you want.

[^alexa]: I'd better do the most important one first: Without Alexa, I'd probably still be in a basement playing Warcraft 2 somewhere. Thank you for teaching me it's ok to work hard sometimes. I love you! 🥇👩

[^teaching]: If you're ever annoyed about your desk job, go teach 6th grade for a year. Good perspective. For me, teaching was maybe too much helping people and not enough programming ... But I do thank all the kids for being funny and coming up with a million different jokes about my last name.

[^parents]: This is all my parents. They were both teachers in the Peace Corps. My mom was an epidemiologist working on child welfare. My dad was a programmer working for the state of NC. Helping people and programming all the way around. They're also the best parents.

[^sas]: SAS isn't my jam, but the SAS class I took at UNC was amazing and taught me tons about statistical programming. [Kathy Roggenkamp](https://www.linkedin.com/in/kathy-roggenkamp-a4498aa/) was one of the best teachers I ever had.

[^agustin]: Agustin is one of the best statisticians I know, and also an amazing friend and mentor.

[^herman]: The amazing Herman Mitchell. I wish everyone got to have a boss/mentor that smart and funny.

[^chile]: Herman also let me work from Chile for 5 years before Zoom got good. Thanks for everything, Herman!

[^harrell]: Inspired by Frank Harrell's [`{Hmisc}`](https://cran.r-project.org/package=Hmisc) package.

[^wg]: The safetyGraphics team was a workstream of the Safety Working Group — a joint effort of the American Statistical Association Biopharm Working Group and Drug Information Association.

[^melvin]: Thanks [Melvin](https://www.linkedin.com/in/melvin-munsaka-phd-72461bb/). I still don't know how you manage to find and remember every presentation related to clinical trial safety ever given.

[^firstgraphic]: I think it was to analyze allergen exposure thresholds for asthma exacerbations!

[^russ]: Thanks to Russ Helms and everyone at [Rho](https://www.rhoworld.com/) for encouraging innovation and supporting us for so long!

[^R]: Many thanks to the whole Posit team and R community for making open source in Pharma a real thing! [Ramnath](https://github.com/ramnathv), [Joe](https://github.com/jcheng5), and [Phil](https://github.com/philbowsher) in particular have been great collaborators at various points over the years.

[^coleads]: I learned *a lot* from the other members of the leadership team: [James Buchanan](https://www.linkedin.com/in/jim-buchanan-b13140a/), [Susan Mayo](https://www.linkedin.com/in/susan-mayo-3125073/), and [Xiao Ni](https://github.com/xni7).

[^ai]: **AI collaboration note** — I outlined the idea for this post and provided the source material. An AI model helped draft and organize it from my notes; I reviewed and edited the result before publication.