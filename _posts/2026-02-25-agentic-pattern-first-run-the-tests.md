---
title: "Agentic Pattern: First Run the Tests"
author: "Jeremy Wildfire"
date: "2026-02-25"
excerpt: "A simple but high-leverage habit for coding agents: start every session by asking them to run the test suite."
---

I really like Simon Willison's new series on [agentic engineering patterns](https://simonwillison.net/guides/agentic-engineering-patterns/). If you're using coding agents day-to-day, this feels like required reading:


One post in particular stood out to me: [First Run the Tests](https://simonwillison.net/guides/agentic-engineering-patterns/first-run-the-tests/).

> Automated tests are no longer optional when working with coding agents.

This feels exactly right, and it's fortunately *very* easy to implement.

> Any time I start a new session with an agent against an existing project, I now begin with:

> First run the tests.

He describes several benefits of this approach: it tells the agent a test suite exists and forces it to learn how to run it, reveals project scale and complexity, and puts the agent into a testing mindset, which makes it more likely to add or update tests during implementation.

Small prompt, big leverage.
