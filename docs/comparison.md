# Comparison

Ariadne occupies a narrow slot: **pre-code product discovery for AI coding
agents**. It is not a coding agent, a project manager, or a PRD template. This
page positions it against the tools it is most often confused with.

## Capability matrix

| | **Ariadne** | Requirements-clarity skill | Spec-driven kits (spec-kit, BMAD) | Socraticode | Plain coding agent |
|---|---|---|---|---|---|
| Primary job | Elicit product intent | Score requirement completeness | Structure the delivery process | Code intelligence via MCP | Write code |
| Starts before code | ✅ | ⚠️ after a request exists | ✅ | ❌ | ❌ |
| Interviews the owner | ✅ | ✅ | ⚠️ templates | ❌ | ⚠️ |
| Tags observed / stated / inferred / uncertain / conflicting | ✅ | ❌ | ❌ | ❌ | ❌ |
| Preserves contradictions | ✅ | ❌ | ⚠️ open questions | ❌ | ❌ |
| Explicitly resists the current implementation | ✅ | ❌ | ❌ | ❌ | ❌ |
| Produces a living discovery artifact | ✅ | ✅ PRD | ✅ specs/tasks | ❌ | ❌ |
| Feeds a planning stage | ✅ | ⚠️ | ✅ | ⚠️ | ❌ |

Legend: ✅ first-class · ⚠️ partial · ❌ not the job.

## Requirements-clarity skill

The requirements-clarity approach scores a request from 0–100 on completeness
and keeps asking until the score is high enough, then generates a PRD. It is
good at making a request *complete*.

Ariadne asks a different question. Completeness is not fidelity: a document can
be 100% filled in and still describe the wrong product. Ariadne withholds the
"complete" signal until the owner confirms the intent, tags every claim, and
keeps unresolved items unresolved.

They compose well: use Ariadne to establish intent, then a completeness pass if
your process needs one.

## Spec-driven kits (spec-kit, BMAD, and similar)

These are excellent at what happens **after** intent exists: templates,
specifications, task breakdowns, and multi-agent delivery workflows. They assume
someone already knows what should be built.

Ariadne is the stage before that. It produces the canonical workflow and
requirements register that a spec-driven process can consume. If you already
have a clear, confirmed spec, you do not need Ariadne.

## Socraticode and code-intelligence MCP servers

Socraticode and similar tools build semantic and structural indexes of a
codebase so agents can navigate it. They answer "where is this and what depends
on it?"

Ariadne answers "what are we trying to build, and why?" It is complementary: run
discovery first, then let code intelligence help with implementation.

## A plain coding agent

You can absolutely ask a coding agent "what should we build?" It will answer
confidently. That is the problem: it is optimizing for a plausible response, not
for your intent. It will also start proposing implementation as soon as it can,
which collapses the discovery space.

Ariadne's guardrails — no code, no architecture, contradictions preserved,
inferences labeled — exist to keep that from happening.

## What Ariadne is not

- **Not a PRD generator.** The document is a byproduct of the conversation.
- **Not a project manager.** It does not estimate, schedule, or assign work.
- **Not user research.** It works from *your* intent and repository evidence. It
  cannot interview your customers for you.
- **Not a template.** There is a structure, but filling it in is not the goal.
- **Not a coding agent.** It deliberately cannot write code.

## When to use Ariadne

Use it when:

- You have a product idea that is clear in your head but not in writing.
- An existing system "works" but the experience does not match your vision.
- You keep giving an agent feedback like "this feels wrong" and want it turned
  into requirements.
- You are about to hand a feature to an AI agent and want the intent pinned down
  first.
- You need to separate latent requirements from implementation artifacts.

## When not to use it

Skip it when:

- You already have a confirmed, explicit specification.
- The task is a small, well-understood bug fix.
- You need customer research, not requirements elicitation.
- You want code now and are comfortable discovering the product later.
