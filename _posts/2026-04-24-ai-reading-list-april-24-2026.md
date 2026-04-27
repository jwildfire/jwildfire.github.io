---
title: "AI Reading List: April 24, 2026"
author: "Jeremy Wildfire"
date: "2026-04-24"
excerpt: "A quick set of links on agent skills, AI adoption, security, local models, and the changing shape of software."
---

Time for a link roundup! 

## New Models

First, some articles on newly released (or not) models:

- **[Sign of the future: GPT-5.5](https://www.oneusefulthing.org/p/sign-of-the-future-gpt-55)** - Looks like GPT-5.5 caught up with (or maybe passed) the Opus models for coding. The [examples gallery](https://69e8dfc625a99f19144c86bf--hg-20f7d1a3ce.netlify.app/#openai-o3) is fun and shows how different models handle the following prompt: "build me a procedurally generated 3D simulation showing the evolution of a harbor town from 3000 BCE to 3000 AD, it should look beautiful and allow me to have some control over it"

- **[Anthropic’s Project Glasswing — restricting Claude Mythos to security researchers](https://simonwillison.net/2026/Apr/7/project-glasswing/)** - Lots of news about Mythos, Project Glasswing and just AI-related security stuff in general. This video from Hank Green is a nice semi-technical overview: **[You Actually Do Need to Understand Mythos](https://www.youtube.com/watch?v=V6pgZKVcKpw)** 

- **[You’re Paying $200/Month for AI. The Same Models Are Now Free.](https://futuredigestnews.substack.com/p/youre-paying-200month-for-ai-the)** - Semi-related to the new models, I read a few interesting articles comparing frontier models to open source alternatives. Title here is a little bit click-baity, but article is interesting. This [note from Dwarkesh](https://www.dwarkesh.com/p/what-i-learned-april-15) discusses similar topics. His [interview of NVIDIA CEO Jensen Huang](https://www.dwarkesh.com/p/jensen-huang) is also worth a listen.

## Best Practices 

- **[Your CEO is suffering from AI psychosis](https://handyai.substack.com/p/your-ceo-is-suffering-from-ai-psychosis)** - Probably my favorite article of the week. I think the "AI Psychosis" label is clickbait, and this applies to everyone, not just CEOs. Headline aside, the article is great, especially "Your sprints still matter more than your agents": 

  > I spend a lot of time thinking about how to make agents productive. Maybe it's the product manager in me, but the thing I keep coming back to is boring and unsexy: requirements documents, sprint planning, acceptance criteria, and measurement.

  > If I'm going to use Claude Code to build a feature, I won't fire off a vague prompt and see what comes back. I'll write a specification. I'll define the acceptance criteria. I'll set up the test cases. Only then will I let the agent execute against those constraints. When it's done, I review the output against the spec, not my token counts.

  My takeaway is that AI is an amplifier for both good and bad habits, so focus on reinforcing the good ones!

More quick hits around best practices: 

- **[Agent Skills](https://github.com/addyosmani/agent-skills)** - Skill Library #1
- **[Agent Skills Specification](https://github.com/agentskills/agentskills)** - Skills framework/best practices
- **[Headless everything for personal AI](https://interconnected.org/home/2026/04/18/headless)** - Importance of strong APIs for agents
- **[Agent Interview Best Practice](https://news.ycombinator.com/item?id=47826959)** - This [whole Hacker News thread](https://news.ycombinator.com/item?id=47823270) (and the [original post from Willison](https://simonwillison.net/2026/Apr/18/opus-system-prompt/)) was all interesting, but the linked comment around having your agent interview you stood out for me. 

## One last thing ... 

- **[Sam Altman May Control Our Future - Can He Be Trusted?](https://www.newyorker.com/magazine/2026/04/13/sam-altman-may-control-our-future-can-he-be-trusted)** - A long New Yorker profile on Altman. Not technical, but an interesting read. 