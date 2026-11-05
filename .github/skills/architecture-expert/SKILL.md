---
name: architecture-expert
description: Authoritative knowledge of this repository's architecture — the Spring Boot backend (onlineshopapi) and Angular frontend (onlineshopui), their layering, module boundaries, and design patterns. Use this skill whenever the user asks about project structure, architecture, architectural constraints, module boundaries, layers, or design patterns — including questions like "where should this code live", "is this the right layer for X", "does this follow our conventions", or when reviewing/writing code that touches controllers, services, repositories, entities, DTOs, Angular features, guards, or routing. Also trigger when onboarding someone to the codebase, planning a new feature's placement, or checking whether a change respects existing boundaries, even if the user doesn't say the word "architecture" explicitly.
license: MIT
---

# Architecture Expert

## Overview

This skill encodes the architecture of the Online Shop fullstack application: a Spring Boot 4 REST API (`onlineshopapi/`) and an Angular 21 SPA (`onlineshopui/`), backed by PostgreSQL. Use it to answer structural questions, decide where new code belongs, and check whether a change respects the layering and module boundaries already established in the codebase.

The full architectural reference — directory structures, rationale, and every convention below — lives in `references/architecture.md`. Read it whenever you need the complete picture (e.g., writing documentation, doing a thorough review, or onboarding someone); the summary below is enough for quick placement/conformance questions.

## When to consult the full reference

Read `references/architecture.md` before:
- Reviewing a pull request or diff for architectural conformance
- Writing new documentation that describes the system
- Answering a question you can't confidently resolve from the quick-reference constraints below
- Onboarding someone to a sub-project in depth

For quick questions ("which layer does X belong in?", "is this an NgModule-based or standalone component app?"), the constraints below are usually sufficient on their own.

## Backend constraints (onlineshopapi)

Package layout under `msg.onlineshopapi`: `controller/ → service/ (+ strategy/) → repository/`, with `model/` (entities), `dto/` (+ `mapper/`), `security/`, `config/`, and `exception/` as supporting packages.

- **Controllers hold no business logic.** They accept/return DTOs and delegate to services. If you find yourself adding `if`/business rules in a controller, move it to a service.
- **Entities never leak past the service layer.** Controllers and DTOs must not reference JPA entities directly — always go through a mapper in `dto/mapper/`.
- **Errors flow through `GlobalExceptionHandler`.** Throw one of the existing domain exceptions (`DuplicateResourceException`, `ResourceNotFoundException`, `OrderNotProcessableException`, `ProductInOrderException`) rather than handling errors ad hoc in a controller.
- **Order fulfillment logic is pluggable via the Strategy pattern** (`service/strategy/`: `OrderStrategy`, `SingleLocationStrategy`, `MostAbundantStrategy`), selected at startup by `OrderStrategyConfig` from the `app.order.strategy` property. New fulfillment behavior should be a new strategy implementation, not a conditional inside an existing one.
- **Schema changes go through Flyway migrations** (`db/migration/`), never through `ddl-auto` or manual schema edits. Add a new versioned migration file for any schema change.
- **Many-to-many join entities use composite `@Embeddable` keys** (see `OrderDetailId`, `StockId`) rather than surrogate IDs — follow this pattern for similar join tables.
- **Authentication is stateless JWT.** `JwtAuthFilter` runs ahead of Spring Security's standard filter; sessions use `SessionCreationPolicy.STATELESS`. Only `/auth/register`, `/auth/login`, and the Swagger/OpenAPI paths are unauthenticated. Role checks (`ADMIN`, `CUSTOMER`) belong on methods via `@EnableMethodSecurity`, not as new URL matchers in `SecurityConfig`.
- **API docs are generated, not hand-written** — springdoc-openapi derives the spec from controller annotations.

## Frontend constraints (onlineshopui)

Top-level split: `core/` (app-wide singletons — config, DI providers, mocks, shared types), `clib/` (reusable, feature-agnostic presentational UI), `features/` (lazy-loaded domain modules: `auth`, `products`, `cart`, `orders`).

- **Features are self-contained and lazy-loaded.** Each feature owns its `components/`, `services/`, `types/`, and `*.routes.ts`, wired into `app.routes.ts` via `loadChildren`. Don't reach into another feature's internals — share through `clib` or `core` instead.
- **`clib` components stay presentational.** No feature-specific business logic belongs in `clib`; if a component needs domain knowledge of a specific feature, it belongs in that feature's `components/`, not `clib`.
- **Standalone components only — no `NgModule`s.** This app predates and intentionally avoids the NgModule pattern.
- **State lives in signals, not an RxJS store.** Follow the existing signal-based pattern for component/service state rather than introducing a state-management library.
- **Route protection is guard-based**: `authGuard` protects the authenticated shell (`RootLayoutComponent`), `guestGuard` restricts guest-only routes, `rolesGuard` restricts by role. Add new protected routes under the appropriate existing guard rather than reimplementing access checks in a component.
- **Auth headers are never set manually.** `AuthTokenInterceptor` attaches the JWT to every outgoing request; call sites must not add `Authorization` headers themselves.
- **Environment values come through DI, not direct `environment.ts` imports.** Read config via the `EnvironmentConfig` token (provided by `provideEnvironmentConfiguration`) so code stays agnostic of which of the three build configurations (`development`, `mock`, `production`) is active.
- **Mock wiring (`getMockInterceptors`/MSW) must stay conditional on the `mock` configuration** — it must not end up in the production bundle.

## Database

PostgreSQL 18, local via `docker/development/docker-compose.yml`. The schema is owned entirely by the backend's Flyway migrations — there's no separate manual setup step.

## How to use this when reviewing or writing code

1. Identify which sub-project (or both) the change touches.
2. Check the relevant constraints above — most conformance questions can be answered directly from this list.
3. If the change seems to cross a boundary (e.g., a controller doing business logic, a `clib` component with domain logic, state outside signals, manual auth headers), flag it and point to the specific constraint it violates.
4. For anything requiring deeper context (why a pattern exists, full directory trees, testing tool rationale), consult `references/architecture.md`.
