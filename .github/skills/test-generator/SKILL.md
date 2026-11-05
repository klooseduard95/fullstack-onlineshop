---
name: test-generator
description: Generates thorough, well-structured unit tests for a given function, method, or class — following Arrange-Act-Assert, descriptive methodName_expectedBehavior_whenCondition test names, and a fixed Happy Path / Boundary / Error coverage pattern, mocking only external I/O. Use this skill whenever the user asks to "write unit tests", "write tests", "add test coverage", "test this function", or to cover "edge cases" for some code — even if they just say "can you test this" or ask you to make sure a function is "covered" or "robust", since that implies the same structured test-writing task.
license: MIT
---

# Test Generator

## Overview

Writing good unit tests is less about syntax and more about discipline: covering the right cases, keeping each test readable on its own, and not accidentally testing the mocking framework instead of the code. This skill gives a repeatable structure so every generated test suite — regardless of language or framework — looks deliberate rather than ad hoc.

## Step 1: Identify the target and its test framework

Find the function/method/class to test and the framework already in use in the surrounding codebase (don't introduce a new one). In this repository:

- **Backend** (`onlineshopapi/`): JUnit 5 + Mockito + AssertJ. Unit tests for services/strategies live under `src/test/java/msg/onlineshopapi/unit/`, controller tests under `src/test/java/msg/onlineshopapi/controller/`. Use `@ExtendWith(MockitoExtension.class)`, `@Mock`/`@InjectMocks`, and `assertThat`/`assertThatThrownBy` from AssertJ.
- **Frontend** (`onlineshopui/`): Vitest (`describe`/`it`/`vi`), co-located as `*.spec.ts` next to the file under test. Angular services/components are instantiated via `TestBed`.

If the target is in some other language/framework entirely, mirror whatever test tool and file convention that codebase already uses — the structure below applies regardless of the specific test runner.

## Step 2: Enumerate the cases before writing any test

For **every** target function, deliberately generate tests in all three of these categories. Skipping a category is the single most common way test suites end up with blind spots — a function that only gets a happy-path test looks "tested" but isn't:

1. **Happy Path** — the normal, expected inputs producing the normal, expected output. Usually 1-2 tests; cover meaningfully different normal inputs if the function branches on them (e.g. a discount calculator with and without a discount applied), not just one trivial case.
2. **Boundary / Edge Case** — the values at the edges of what the function accepts: empty collections/strings, zero, negative numbers, the maximum/minimum of a range, exactly-at-threshold values, `null`/`undefined`/missing-optional-field inputs, single-element vs. many-element collections. Think about what's *different* about the edges of this specific function's input space rather than applying a generic checklist.
3. **Error / Exception** — inputs that should cause the function to fail predictably: invalid input that should raise a validation error, a dependency that throws/rejects, a not-found case. Assert on the specific exception type/message or error response, not just "it throws something."

If a function genuinely has no meaningful boundary or error case (e.g. a pure getter), it's fine to have fewer tests in that category — but make that a conscious judgment, not an oversight, and briefly note why in your summary to the user.

## Step 3: Write each test as Arrange-Act-Assert

Structure every test body in three clearly separated parts, in this order, so a reader can tell at a glance what's being set up, what's being exercised, and what's being checked:

- **Arrange** — build inputs, configure mocks, set up any required state.
- **Act** — call the function/method under test, exactly once, capturing the result (or capturing the thrown exception).
- **Assert** — verify the outcome: return value, thrown exception, or mock interactions.

Mark the three parts with comments (`// Arrange`, `// Act`, `// Assert`) unless the surrounding codebase already uses different AAA markers (e.g. the frontend spec files above use `// Prepare`) — in that case, match the existing convention instead of introducing a new one. Keep "Act" to a single line/call wherever possible; if arranging requires several lines, that's normal, but acting on the subject twice in one test is a sign the test is covering two behaviors and should be split.

## Step 4: Name every test methodName_expectedBehavior_whenCondition

Name each test (method name in JUnit, `it(...)` description in Vitest/Jest) in the form **`<methodUnderTest>_<expectedBehavior>_when<Condition>`**, adapted to the target language's casing conventions. Leading with the method name groups tests for the same method together alphabetically/in test-runner output and makes a failing test immediately traceable to what it exercises:

- Java/JUnit: `calculateTotal_throwsException_whenQuantityIsNegative`
- TypeScript/Vitest: `it('addItem_throwsError_whenQuantityIsNegative', ...)` — or, where the framework favors a readable sentence over an identifier, keep the same three components in natural language: `it('addItem should throw an error when quantity is negative', ...)`.

Avoid vague names like `test1`, `testError`, or `worksCorrectly` — a failing test's name should tell you what broke without opening the file.

**Examples:**
```java
@Test
void findStocks_returnsEmptyList_whenNoStockExistsForProduct() { ... }

@Test
void reserveStock_throwsOrderNotProcessableException_whenRequestedQuantityExceedsStock() { ... }
```
```typescript
it('calculateCartSubtotal_returnsZero_whenCartIsEmpty', () => { ... });
it('updateQuantity_removesItem_whenQuantityIsZeroOrLess', () => { ... });
```

## Step 5: Mock only external I/O

Mock boundaries the function doesn't control and that are slow, flaky, or have side effects outside the test: database/repository calls, HTTP clients, the filesystem, `localStorage`/browser APIs, the system clock, and other services reached over a network. Don't mock:

- Plain data objects, DTOs, or value types — construct real instances.
- Pure helper functions or utilities owned by the same module — call the real implementation so the test still catches integration bugs between them.
- The class/function under test itself (obviously) or simple in-memory collaborators that have no real I/O.

The reasoning: a test that mocks everything in sight ends up asserting that your mocks return what you told them to return, which proves nothing about the real code. Mocking strictly at the I/O boundary keeps the test meaningful while still isolating it from genuinely slow or non-deterministic dependencies.

## Step 6: Summarize coverage for the user

After generating the tests, give a short rundown of what was covered per function — which happy-path, boundary, and error cases were included, and call out explicitly if any category was intentionally skipped and why. This lets the user spot a real gap (vs. an oversight) before merging.
