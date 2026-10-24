# Examples

These are abbreviated sessions. The point is not the answers — it is the shape
of the questions and what ends up in the artifact.

---

## Example 1 — "This feels awkward"

**You**

> The upload flow feels awkward. I expected it to just work.

**Ariadne**

> What is the user trying to accomplish at that moment? "Awkward" could mean
> too many steps, the wrong vocabulary, or no feedback while the upload runs.
> Which of those is closest?

**You**

> They already picked the file. Asking them to confirm again is silly.

**Ariadne**

> That is a useful distinction. I have three candidate interpretations of the
> confirmation step, and they imply different products:
>
> 1. It is a safety check for destructive or expensive uploads.
> 2. It is there because the API needs a separate commit call.
> 3. It is a leftover from an earlier flow.
>
> Only the first is a product requirement. Which is it?

**You**

> Two. The API needs a commit, but the user shouldn't see that.

**Ariadne**

> Then I will record the confirmation step as an implementation artifact, not a
> product step. Two questions before I update the workflow:
>
> - While the upload runs, what must the user be able to see and do?
> - If it fails, should the file still be selected, or should they start over?

Resulting excerpt from `.ariadne/discovery.md`:

```markdown
## Requirements register

| ID | Requirement | Type | Evidence | Confidence | Status |
|----|-------------|------|----------|------------|--------|
| R7 | Selecting a file begins the upload immediately; no second confirmation. | latent | "Asking them to confirm again is silly" | high | confirmed |
| R8 | The upload can be cancelled while it is running. | latent | implied by R7 | medium | provisional |

## Usability gaps

### G2 — Confirmation step exists for the API, not the user

- **Current behavior:** user selects a file, then presses "Review & upload".
- **Intended behavior:** upload begins on selection.
- **Why it matters:** the step makes the user feel the system is uncertain about
  their own action.
- **Principle violated:** the system's mechanics should not become the user's
  ceremony.
- **Evidence:** owner explanation; `UploadDialog.tsx` calls `commitUpload()`
  only from the review screen.
- **Severity:** medium — adds a decision with no product meaning.
- **Status:** confirmed (the behavior is a workaround, not intent).

## Open questions

### Q3 — What must remain visible during upload? (highest leverage)

- **Why it matters:** determines whether the flow needs a progress surface at all.
- **Blocks:** the canonical workflow's success signal and failure path.
- **Hypotheses:** per-file progress; a single indeterminate spinner; optimistic
  thumbnail with a subtle overlay.
- **Evidence that would resolve it:** how long a typical upload takes, and
  whether users leave the screen while it runs.
```

---

## Example 2 — Screenshot folder → design spec CLI

**You**

> I want a CLI that takes a folder of UI screenshots and produces a design spec
> my coding agent can use. I have a script, but it feels like I am fighting it.

**Ariadne**

> My provisional model: you are rebuilding an existing app, you have screenshots
> of the target UI, and you want a spec an agent can implement from. I am least
> sure whether the spec is for a human, an agent, or both — and whether this is a
> one-time rebuild or an ongoing workflow.
>
> Three questions:
>
> 1. Who reads the spec first: you, an agent, or both?
> 2. Is this a one-time migration, or will you keep feeding it new screens?
> 3. What does "fighting it" mean concretely?

**You**

> Mostly the agent. I point it at screenshots of the app I want to rebuild and I
> want a spec that captures layout, states, and copy. The fighting is that the
> script outputs a giant JSON blob and the agent ignores half of it.

**Ariadne**

> That reframes the problem. I had been modeling "missing information" as the
> gap. The real gap sounds like **consumability**, not completeness.
>
> - **R1 (stated):** the spec is consumed by an agent, not a human.
> - **C1 (conflicting):** the current script optimizes for a complete JSON
>   representation; your goal is that the agent acts on the spec without
>   re-reading the screenshots. Completeness is an implementation value here,
>   not the product value.
>
> Two questions:
>
> - When the agent reads the spec, what does it do first?
> - What has it gotten wrong most often — layout, states, or copy?

**You**

> It builds one screen at a time. It needs layout, then states, then copy. It
> usually misses states — hover, empty, error, loading.

**Ariadne**

> Then the canonical workflow is not "screenshots in, spec out". It is:
>
> > point at one screen → get a spec whose **first** section is enough to start
> > building, and whose **states** section cannot be skipped.
>
> I want to test that with a scenario before writing it down:
>
> "You give the CLI a single screenshot of a settings page. The agent receives a
> spec that begins with a layout model, then an exhaustive state inventory
> (including empty, loading, error, and permission-denied), then copy. It does
> not need to open the screenshot. Is that the experience you intend?"

**You**

> Yes. And it should tell me when it can't infer a state from the screenshot,
> instead of making one up.

**Ariadne**

> That is a product principle, not just a feature: **the spec must distinguish
> what was seen from what was guessed, and guesses must be visibly marked.** I am
> recording it as a cross-cutting requirement because it affects every section.

Resulting excerpt:

```markdown
## Product intent

For a developer rebuilding an existing interface, the CLI turns screenshots into
an agent-consumable spec: layout first, then an exhaustive state inventory, then
copy. The experience should feel like handing the agent a brief, not a dataset.
Core principle: never let a guess look like an observation.

## Canonical workflow

1. **Point at a screen** — user passes a folder or a single image.
2. **Layout extraction** — system produces a structural model (regions,
   hierarchy, spacing, breakpoints).
3. **State inventory** — system enumerates observed states and lists unobserved
   states it could not infer, marked `guessed: true`.
4. **Copy extraction** — text is captured verbatim with its location.
5. **Handoff** — one Markdown file per screen, ordered so the agent can start
   after section 2.
```

Audit excerpt (`.ariadne/audit.md`):

```markdown
## Executive assessment

Screenshot-to-code is crowded; agent-consumable *specification* is less so. The
defensible claim is not the conversion, it is the contract: ordered sections,
explicit state coverage, and observation/guess provenance.

## Prior-art landscape

- Screenshot-to-code tools optimize for generating markup, not a spec.
- Design-tool exporters optimize for fidelity to the tool's model.
- Multimodal "describe this UI" prompts produce prose, not a contract.

## Main risks

- Stale or partial screenshots produce confidently wrong state inventories.
- "Guessed" states may be ignored by downstream agents unless the format makes
  them impossible to skip.
```

Plan excerpt (`.ariadne/plan.md`):

```markdown
## Slice 1 — one screenshot in, ordered spec out

**Outcome:** `spec <image>` writes a single Markdown file with Layout, States,
Copy in that order. Unobserved states are listed under a `Guessed` heading.

**Acceptance**
- Section order is enforced in the output, not just documented.
- Every state carries `observed: true|false`.
- A downstream agent can build the layout without opening the image.

## Blocking questions

- Where do breakpoints come from if the screenshot is a single viewport?
- Does "copy" include accessibility labels and placeholder text?
```

---

## Example 3 — When the honest answer is "not yet"

**You**

> It should feel fast.

**Ariadne**

> "Fast" is a feeling with at least three different mechanics: time to first
> result, time between actions, and perceived responsiveness while waiting. They
> lead to different designs, so I do not want to record a single requirement yet.
>
> Which moment feels slow to you now?

**You**

> I don't know. It just doesn't feel snappy.

**Ariadne**

> Then I will record this as **Uncertain**, not as a requirement, and we can
> defer it. A provisional hypothesis: the delay is between selecting a file and
> seeing any acknowledgment. Is that a fair guess to test next time you use it?

This is the intended behavior: a marked unknown is more valuable than a
confident guess.
