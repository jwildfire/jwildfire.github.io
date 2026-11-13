---
title: "AI Reading List: New Ways of Working"
author: "Jeremy Wildfire"
excerpt: "A roundup of recent posts on how people work with AI agents: code review at volume, skills and MCP, and what it's like to do the job now."
tags: AI ClaudeCode ReadingList
date: "2026-11-13"
---

I briefly talked about how work is changing in the [R/Pharma keynote](https://jwildfire.github.io/2026/10/21/rpharma-2026-keynote-annotated.html).

[![New ways of working, written up in public: the FDA's Elsa 4.0 with custom agents (6 May); David Heinemeier Hansson on being done coding by hand (23 September); how the Claude Code team does code review (15 October); and Anthropic on how employment is changing (16 October).](/assets/img/rpharma-2026-keynote/slide-50.jpg)](https://jwildfire.github.io/keynote/keynote.html#50)

I think that trend is accelerating, and as a result my reading list keeps growing. I've put together a quick roundup of what I've saved over the last few months, broken into three sections:

1. **Code review is evolving rapidly.** The amount of code is growing exponentially and the number of people who can read it isn't, so almost every team writing in public has stopped pretending that a person will read every line. [New best practices are emerging](https://newsletter.pragmaticengineer.com/p/what-is-happening-with-code-reviews): machines do the first read, and often the second. People review the plan, the tests and the risky changes. Low-risk changes merge on green checks. What separates the careful versions from the reckless ones is whether anyone is measuring the result (reverts, incidents, what the reviewer misses) and whether a named person is still accountable for what ships. The findings and recommendations around code review are maturing fast and are ready for pilots on most teams writing code with agents, including in clinical trials. My OpenRBQM and safetyGraphics teams are actively discussing this topic, and we'll share more as our process evolves.

2. **Agentic Engineering Best Practices.** There is also active discussion about other aspects of making software with agents, but best practices are less mature. Topics include: triage workflows, release chores, setting up machines, and remembering how a project works. Six months ago the conversation was mostly about prompts. Now it's about skills, command-line tools, MCP where it earns its place, memory that lasts between sessions, and loops that keep an agent going until the work is done. There's a lot less magic in these posts and a lot more plumbing.

3. **Agents as Co-workers.** Finally, people are wrestling with how to work with agents more generally. A major theme is how to set up and manage long-running agents. The limit on all of this is human attention, and people are tired. The best posts here aren't about going faster. They're about deciding what deserves a person's attention, and protecting it.

The posts are below. I'm sure this list will be out of date in a month. That's kind of the point. Happy reading!

## Code review is evolving rapidly

- **[What is happening with code reviews?](https://newsletter.pragmaticengineer.com/p/what-is-happening-with-code-reviews)** - Start here. Gergely Orosz surveys how teams are coping now that agents write more code than anyone can read. The three most common approaches: people review the AI's review, teams triage changes by "blast radius" so low-risk ones skip human review, and people review the plan, tests and schema instead of the implementation. It matches my experience pretty closely. (Part of it is for paid subscribers.)

- **[How the Claude Code team does code review](https://claude.dev/blog/solving-code-review-at-anthropic/)** - The one from my keynote slide. The agent that wrote the change checks its own work, an AI review runs on every pull request, and a person approves based on risk. They report that merged pull requests more than doubled from June to September while the share needing a revert fell by more than 40%. The line I keep coming back to:

  > We didn't remove review. But we did move most of the reading to machines…

More quick hits on code review:

- **[Orchestrating AI Code Review at scale](https://blog.cloudflare.com/ai-code-review/)** - Cloudflare's version: up to seven specialist reviewers, merged into one comment.
- **[The Shape of Things to Come, Part 1](https://yegge.ai/essays/the-shape-of-things-to-come/)** - Steve Yegge at the far end: human code review "has very nearly run its course."
- **[Hide your slop PR descriptions behind details/summary](https://simonwillison.net/2026/Nov/9/details-summary/)** - Write a short opening yourself and collapse the agent's text. I'm going to steal this.
- **[Kun Chen on maintaining open source with agents](https://substack.com/@kunchenguid/note/c-378864738)** - A quality gate and agent triage for AI-written pull requests from strangers.
- **[Scaling Git at OpenAI](https://openai.com/index/scaling-git-at-openai/)** - More on scaling version control for agents.
- **[Directly Responsible Individuals](https://simonwillison.net/2026/Jul/12/directly-responsible-individuals/)** - Simon Willison: an agent should never be the one accountable for a project.
- **[Don't be a meat proxy](https://simonwillison.net/2026/Aug/3/dont-be-a-meat-proxy/)** - Read and understand AI output before you pass it along.

## Agentic Engineering Best Practices

- **[Agent memory needs its OpenTelemetry moment](https://www.lorekit.io/blog/open-agent-memory-format)** - A technical look at standardizing agent memory. Every coding agent keeps what it "remembers" in its own format (AGENTS.md, CLAUDE.md, Cursor rules, memory tools, MCP memory servers) and none can read the others. Mads Thines argues the fix is a shared agreement, the way OpenTelemetry was for monitoring: a data model, conventions, a protocol and tests. He builds one of the proposals, and says so. The details are slightly over my head, but this seems like important infrastructure.

More quick hits on agentic engineering:

- **[Agent Skills](https://addyosmani.com/blog/agent-skills/)** - Addy Osmani on skills: written workflows with exit criteria. "Process over prose."
- **[MCP is dead](https://www.quandri.io/engineering-blog/mcp-is-dead)** - Clickbait title, useful post: go CLI-first, with skills that wrap the commands.
- **[The Coming Loop](https://lucumr.pocoo.org/2026/6/23/the-coming-loop/)** - Armin Ronacher on loops that re-prompt agents until the work is done, and what that does to responsibility.
- **[agents need control flow, not more prompts](https://bsuh.bearblog.dev/agents-need-control-flow/)** - Put the logic in software, not in longer prompts.
- **[GitHub Agentic Workflows](https://github.github.com/gh-aw/)** - Agents in GitHub Actions, with every write checked before it lands.
- **[Goodbye Claude, Hello Pi](https://caleb.software/posts/claude-to-pi.html)** - I'm not switching, but I want to check out Pi.
- **[Fable's judgement](https://simonwillison.net/2026/Jul/3/judgement/)** - Let the model decide when a cheaper model will do.
- **[/headless](https://substack.com/@kunchenguid/note/c-381704803)** - A skill that sets up an always-on machine for your agent.
- **[How to set up your spare Mac for Claude Code to fully control](https://ykdojo.github.io/claude-controls-mac/)** - On my list for a dedicated obot laptop.

## Agents as Co-workers

- **[How employment is changing at Anthropic](https://www.anthropic.com/research/employment-at-anthropic)** - Also from the keynote slide. Agent hours outnumber human hours six to one, and commits per engineer are up about five times in six months. Their own conclusion is that human attention is now the bottleneck for agent output.

- **[How I Built the Most AI-Pilled Company in the World](https://x.com/jsnnsa/status/2115623382721126826)** - Jacob (@jsnnsa) runs Spawn, a ten-person company building a multiplayer game creation engine. By his account, a "fleet" of permanent agents, each owning a part of the company from the engine to finance, shipped 77,000 changes in 30 days on $3.1 million of tokens. They got rid of pull requests: agents change the live code, the full test suite runs every 15 minutes, another agent fixes whatever breaks, and about 0.9% of changes get reverted. The humans' job is taste, saying no, and asking for bigger things than the agents would suggest. It's all self-reported, and a long way from anything I'd do with clinical trial software, but this is all just ... wow.

More quick hits on agents as co-workers:

- **[How I'm fighting the AI Brain Fry](https://sergeykuhne.com/blog/fighting-ai-brain-fry)** - A ticket queue in git plus an inbox for judgement calls. Pretty similar to my obot workflow.
- **[2x, not 10x: coding with LLMs in 2026](https://obryant.dev/p/2x-not-10x/)** - A sober counterweight: real gains, but closer to 2x.
- **[We are all Product Engineers now](https://seldo.com/posts/we-are-all-product-engineers-now/)** - Laurie Voss: what's left is deciding what to build and what "good" means.
- **[My obituary for programming](https://dumbmatter.com/2026/10/programming-obituary/)** - A sad and honest post from someone who loves programming.
- **[2026 in LLMs (so far)](https://simonwillison.net/2026/Sep/27/2026-in-llms-so-far/)** - Simon Willison's annotated keynote: the whole year in one place.
