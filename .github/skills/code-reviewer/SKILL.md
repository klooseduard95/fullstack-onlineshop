---
name: code-reviewer
description: Performs a structured code review that inspects changed or specified code for security flaws, unhandled errors, performance bottlenecks, and naming-convention violations, then reports findings grouped by severity with exact line references and suggested fixes. Use this skill whenever the user asks for a "code review", "review", "audit", or "security check" of code, a diff, a pull request, or a file — even if they don't use those exact words but are clearly asking "does this look okay", "what's wrong with this", or "can you check this before I commit/merge it".
license: MIT
---

# Code Reviewer

## Overview

A disciplined, repeatable code review: the same four lenses applied every time (security, error handling, performance, naming), and findings reported in one consistent severity-grouped format so the user can act on the highest-impact issues first. The goal is to behave like a thorough, opinionated senior reviewer — not to rubber-stamp a diff, and not to bury real problems under nitpicks either.

## Step 1: Determine the review scope

Figure out what to review before diving in:

- If the user names specific files or a PR/diff, review exactly that.
- If they say "review my changes" with no further detail, use `git diff` (unstaged), `git diff --staged`, or the diff against the base branch (whichever has content) to find the changed lines — focus the review there, but read enough surrounding context in each file to judge correctness.
- If they point at a whole file or module with no git context, review the whole thing.

Don't expand scope beyond what's asked — reviewing unrelated files slows the review down and dilutes the findings with noise the user didn't ask for.

## Step 2: Inspect through all four lenses

Go through every changed file methodically and check for issues in each of these categories. Don't skip a category just because the file "doesn't look like" it would have that kind of problem — e.g., a tiny utility function can still have a naming or error-handling issue worth flagging.

### Security
Look for: injection risks (SQL, command, template, path traversal), hardcoded secrets/credentials, missing authN/authZ checks on sensitive operations, unsafe deserialization, weak or missing input validation/sanitization at trust boundaries, overly permissive CORS/auth configuration, and sensitive data logged or exposed in responses/errors.

### Unhandled errors
Look for: calls that can throw/reject/return an error with no handling, swallowed exceptions (empty catch blocks, caught-and-ignored), missing null/undefined checks before dereferencing, resources (files, connections, streams) opened without a guaranteed close/cleanup path, and promises or async calls that aren't awaited or whose rejection isn't handled.

### Performance
Look for: N+1 query patterns, unnecessary work inside loops (repeated I/O, re-computation, re-allocation), unbounded result sets or missing pagination, blocking/synchronous calls on a hot path, redundant re-renders or re-subscriptions, and obviously quadratic-or-worse logic where a linear approach is available.

### Naming conventions
Look for: names that don't follow the language/framework's established convention (compare against surrounding code and this repo's own patterns, since conventions vary by language), misleading names (a name that implies behavior the code doesn't have), overly abbreviated or single-letter names outside tight loop counters, and inconsistent naming for the same concept across the reviewed files.

If the repository has an architecture or contributing guide available (for example a skill or doc describing layering and conventions), cross-check against it too — a change that works but puts logic in the wrong layer is worth flagging, typically as a `[WARNING]`.

## Step 3: Report findings

Always group findings under these exact three headers, in this order, and omit a header entirely if it has no findings (never print an empty section):

```
## [BLOCKER]
## [WARNING]
## [NIT]
```

- **[BLOCKER]** — must be fixed before merging: real security vulnerabilities, bugs that will cause incorrect behavior or data loss, unhandled errors on a critical path.
- **[WARNING]** — should be fixed, not strictly required to merge: performance problems, error handling gaps on non-critical paths, architectural/layering issues, missing edge-case handling.
- **[NIT]** — stylistic or minor: naming inconsistencies, small readability improvements, things a reviewer would mention but wouldn't block on.

For every finding, use this exact format so the user can jump straight to the code:

```
- **file/path.ext:LINE** — <one-line description of the problem>
  Fix: <concrete suggested fix — a code snippet, a function/approach to use, or the specific change to make>
```

Use real line numbers from the file as it currently stands, not approximate ones — if a finding spans a range, give the range (`file.ts:42-47`). If you're not confident about the exact line, re-open the file and check rather than guessing, since an inaccurate line reference wastes the user's time more than a missing one.

If the review turns up nothing in a category, don't force a finding — it's fine, and more credible, for a section to be short or absent. End the report with a one-line summary count, e.g. `3 blockers, 2 warnings, 5 nits`.

## Severity judgment

Severity is about impact and likelihood, not category. A naming issue in a public API that will confuse every future caller can be a `[WARNING]`; a security issue in genuinely dead/unreachable code might only be a `[NIT]`. Use judgment rather than mechanically mapping each of the four lenses to a fixed severity.
