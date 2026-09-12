# Blog authoring notes

These notes apply to this repository unless a more-specific `AGENTS.md` overrides them.

## AI collaboration disclosure

- Every post drafted or revised with AI assistance must include an "AI collaboration note" footer.
- The footer should clearly state the approximate contribution pattern for that post, for example:
  - "Jeremy outlined this post and dictated a rough draft. GPT-5.5 then wrote a clean draft, which Jeremy edited before publication."
- Adjust the note for each post so it accurately reflects the real workflow. Do not reuse boilerplate if the workflow changed.
- When useful and not distracting, include the author's prompts or dictation context as footnotes, collapsible details, or hover-style annotations so readers can see how the AI collaboration happened.
- Keep the disclosure in plain language. It should be understandable to a non-technical reader.

## R/Pharma developer diary series

- The first R/Pharma posts should read primarily as a developer diary: informal, exploratory, fun, and honest about what worked or did not work.
- Prefer concrete stories and artifacts over polished thought-leadership framing.
- Keep the recurring question visible: "What can we do with these tools right now?"
- Later posts can go deeper on current best practices for agentic engineering, validation, review, and GxP-ready workflows.

## Homepage release feed

- `_data/releases.yml` drives the release entries in the homepage News timeline (`_layouts/home.html`), interleaved with posts by date and filterable with the Writing / Releases toggles (`js/news-filter.js`).
- When a tracked package publishes a release, add one entry: package, version (with the leading `v`), date, a one-sentence blurb that says what a user can now do, and links to the GitHub release notes and a live demo page. Keep blurbs under about 90 characters so a row stays close to one line.
- Currently tracks safety.viz and gsm.safety only. Adding another package needs no layout change.
