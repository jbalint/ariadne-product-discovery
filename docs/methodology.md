# Methodology

Ariadne exists because most AI-assisted product work fails in the same place:
the model is asked to build something before anyone has decided what "right"
means. The code is then used as evidence that the decision was made.

This document explains the reasoning discipline behind the agent, so you can
extend it without accidentally weakening it.

## The stance

> The product owner is the source of truth. The codebase is evidence, not
> intent.

That single sentence drives everything else. It is why Ariadne is allowed to
inspect the implementation but not to trust it, and why the agent is explicitly
forbidden from writing code or architecture.

The goal is **fidelity to your product vision**, not conformity to generic
design conventions and not preservation of the current implementation.

## The five epistemic labels

Ariadne tags every claim in the discovery document with one of five labels:

| Label | Meaning | Required evidence |
|---|---|---|
| **Observed** | Directly supported by the system or an artifact | A file, screen, test, or behavior |
| **Stated** | Explicitly specified by the product owner | A direct quote or clear statement |
| **Inferred** | A likely latent requirement or expectation | An argument, plus a confidence level |
| **Uncertain** | Still requires clarification | The question that would settle it |
| **Conflicting** | Evidence points to incompatible models | Both sides, named |

The labels are not decoration. They prevent the most common failure in
requirements work: an inference quietly becoming a requirement because nobody
marked it as one.

### Rules the agent follows

- Never present an inference as a settled requirement.
- Attach confidence and supporting evidence to every important inference.
- Never silently resolve a contradiction. Surface it and ask the owner to choose,
  or help them find the principle that resolves it.
- Do not invent requirements to make the document look complete.

## Evidence priority

When sources disagree, the agent uses a fixed order:

1. **Your clarified product intent**
2. **Observable user goals and workflow expectations**
3. **Deliberate product decisions documented elsewhere**
4. **Current application behavior**
5. **Incidental implementation details**

Current behavior is fourth on purpose. If it were first, every session would
conclude "the product already does this, so this must be the product."

A useful diagnostic question runs through the whole method:

> Is this behavior part of the product model, or merely a workaround for an
> implementation constraint?

## The interaction loop

Each round has five steps:

1. **State the current belief.** A short summary of the provisional workflow
   model, so you can correct it early.
2. **Name the most consequential uncertainty or contradiction.** Not the most
   interesting one — the one that blocks the most downstream decisions.
3. **Ask 2–3 focused questions.** Small batches. Prefer questions tied to a
   concrete workflow moment, observed behavior, or apparent contradiction.
4. **Update `.ariadne/discovery.md`.** The document always reflects the current
   understanding, including the unresolved parts.
5. **Report what changed.** So you can see the model moving.

Occasionally the agent presents a concrete scenario:

> "A user begins in context X, wants outcome Y, performs action Z, and expects
> the system to respond with A without requiring B. Is that the experience you
> intend?"

Corrections update the scenario *and* the broader principles it implies.

## What makes a good question

Good questions expose a distinction that actually changes the design:

- Is this a required step or an implementation artifact?
- Should the user decide this, or should the system infer it?
- What does the user already know at this point?
- What outcome does the user believe they are requesting?
- What should feel effortless?
- What should remain visible and controllable?
- What would surprise or frustrate the user?
- What must remain true even if the interface changes completely?

Bad questions are surveys. A giant questionnaire shifts the work back onto the
product owner and produces a document that looks thorough without being true.

## Emotional responses are data

"This feels awkward" is not a vague complaint to be smoothed over. It is a
signal that a mental model is being violated. The agent treats emotional or
impressionistic feedback as valuable product evidence and helps you locate the
expectation underneath it:

- What did you expect to happen?
- What did you have to think about that you did not want to think about?
- Which step felt like it existed for the system's benefit rather than yours?

## Anti-convergence

Language models are strongly biased toward agreeing with the material in front
of them. In product discovery, that bias shows up as designing the product
around the current implementation. Ariadne pushes against it deliberately:

- It assumes existing behavior may not be intentional.
- It separates required steps from implementation artifacts.
- It asks what must remain true if the interface changes completely.
- It treats "the code does X" as evidence of behavior, not evidence of intent.

## The no-code guardrail

Ariadne is forbidden from writing code, producing patches, refactoring, or
turning the session into an engineering plan. This is not squeamishness about
agents touching files. It is a scoping device:

- Once a plausible implementation appears, the conversation starts optimizing
  it instead of questioning it.
- Code makes assumptions concrete and therefore harder to challenge.
- The plan is the architect's job, and it should consume a clarified intent
  rather than invent one.

The one exception is the discovery document itself. Writing it down is what
turns a conversation into an artifact the next stage can use.

## Completion

Discovery is mature when:

- You recognize the canonical workflow as an accurate expression of your vision.
- The product's responsibility and the user's responsibility are clear.
- Explicit and latent requirements are distinguished.
- Major contradictions with the current experience are visible.
- Important inferences are confirmed or explicitly marked unresolved.
- Another designer or engineer could understand the intended experience without
  treating the current implementation as the specification.

Note what is **not** on the list: a filled-in template, a completeness score, or
a perfectly consistent document. The deliverable is understanding. The Markdown
is a byproduct.
