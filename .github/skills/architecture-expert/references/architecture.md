# Architecture

Online Shop is a fullstack e-commerce application split into an independently deployable API and SPA, backed by a single PostgreSQL database.

```
onlineshopapi/   Spring Boot 4 REST API (Java 21)
onlineshopui/    Angular 21 SPA (TypeScript)
docker/          Local PostgreSQL via Docker Compose
```

The two sub-projects communicate over HTTP: the UI calls the API's `/api` context path and attaches a JWT issued at login. Each is documented below.

## Backend — onlineshopapi

Spring Boot 4 application exposing a REST API under the `/api` context path, built with Java 21 and Maven.

### Layered structure

```
msg.onlineshopapi/
├── controller/   REST endpoints — accept/return DTOs, no business logic
├── service/      Business logic, transactional boundaries
│   └── strategy/ Pluggable order-fulfillment strategies
├── repository/   Spring Data JPA repositories
├── model/        JPA entities
├── dto/          Request/response DTOs
│   └── mapper/   Entity <-> DTO mappers
├── security/     JWT issuing/validation, Spring Security config
├── config/       Cross-cutting beans (OpenAPI, etc.)
└── exception/    Domain exceptions + @ControllerAdvice handler
```

This is a standard Spring Boot layered architecture: controllers depend on services, services depend on repositories and mappers, and entities never leak past the service layer. `GlobalExceptionHandler` centralizes error responses (`DuplicateResourceException`, `ResourceNotFoundException`, `OrderNotProcessableException`, `ProductInOrderException`) into consistent HTTP error payloads, keeping controllers free of try/catch blocks.

### Authentication and authorization

- `AuthController` issues JWTs on `/auth/register` and `/auth/login`, the only endpoints permitted without a token.
- `JwtAuthFilter` runs once per request ahead of Spring Security's standard authentication filter, validating the bearer token and populating the security context.
- Sessions are stateless (`SessionCreationPolicy.STATELESS`) — every request is authenticated independently via its JWT, with no server-side session state.
- `@EnableMethodSecurity` lets controllers enforce role checks (`ADMIN`, `CUSTOMER`) declaratively at the method level rather than in `SecurityConfig`'s URL matchers.
- CORS origins are externalized to `app.cors.allowed-origins`, keeping environment-specific origins out of code.

### Order fulfillment strategy

Order processing uses the **Strategy pattern** (`OrderStrategy` interface, `SingleLocationStrategy` and `MostAbundantStrategy` implementations) to decide which warehouse location fulfills an order. `OrderStrategyConfig` reads `app.order.strategy` at startup and wires the matching bean — switching fulfillment behavior is a configuration change, not a code change.

### Persistence

- Flyway owns the schema: migrations live in `db/migration` and run automatically on startup, so the database schema is always derived from version-controlled SQL rather than `ddl-auto`.
- Spring Data JPA repositories map one-to-one with aggregate roots (`Product`, `Order`, `User`, `Stock`, `Location`, `Address`).
- Composite keys (`OrderDetailId`, `StockId`) model many-to-many join entities (order line items, per-location stock) as first-class JPA `@Embeddable` keys instead of surrogate IDs.

### API documentation

springdoc-openapi generates the OpenAPI spec from controller annotations, served at `/api/swagger-ui.html`. Documentation stays in sync with the code because it's generated, not hand-maintained.

### Testing

Test dependencies include Testcontainers (`testcontainers-postgresql`) for integration tests against a real PostgreSQL instance and `spring-security-test` for authenticated controller tests — both favor realistic test fidelity over mocking the database or security layer.

## Frontend — onlineshopui

Angular 21 single-page application using standalone components (no `NgModule`s), signals for reactive state, and Tailwind CSS 4 for styling.

### Directory structure

```
src/app/
├── core/        App-wide singletons: config, DI providers, mocks, shared types
├── clib/        Reusable UI component library (presentational, feature-agnostic)
└── features/    Lazy-loaded feature modules: auth, products, cart, orders
```

Each feature (`auth`, `products`, `cart`, `orders`) is self-contained with its own `components/`, `services/`, `types/`, and `*.routes.ts`, and is lazy-loaded via `loadChildren` in `app.routes.ts`. This keeps the initial bundle small and lets features evolve independently.

`clib` holds presentational components (`card`, `modal`, `navbar`, `spinner`, `notification-popup`, `error-message`, `icon`) and the `root-layout` shell that wraps authenticated routes — shared UI with no feature-specific business logic.

### Routing and route protection

`app.routes.ts` defines three guard-protected boundaries:

- `AuthRoutes` is public and lazy-loaded outside the authenticated shell.
- `authGuard` protects the `RootLayoutComponent` subtree (products, cart, orders), redirecting unauthenticated users to login.
- `guestGuard` and `rolesGuard` further restrict auth-only and role-only routes (e.g., admin product management) respectively.

### HTTP and state

- `AuthTokenInterceptor` attaches the stored JWT to every outgoing request as an `Authorization: Bearer` header — call sites never handle auth headers manually.
- `provideAppInitializer` resolves the current user's profile before the app renders, so components can assume an authenticated state is already known rather than racing a profile fetch.
- Signals, not RxJS state stores, hold component and service state — Angular 21's recommended approach for reactive UI state without a third-party library.

### Environment-based configuration

Three Angular build configurations swap `environment.ts` via file replacement:

| Configuration | Backend | Use case |
|---|---|---|
| `development` | Real API at `${API_URL}` | Local development against a running backend |
| `mock` | Mock Service Worker (MSW) | Frontend development without a backend |
| `production` | Real API, optimized build | Deployment |

`provideEnvironmentConfiguration` injects the active config as a typed `EnvironmentConfig` token, so services read environment values through DI instead of importing `environment.ts` directly. `getMockInterceptors` conditionally registers MSW HTTP interceptors only in the `mock` configuration, keeping mock wiring out of the production bundle.

### Testing and quality tooling

- Vitest (via `@angular/build:unit-test`) runs unit tests; guards and interceptors ship with co-located `.spec.ts` files.
- ESLint (`angular-eslint`) and Prettier enforce lint and formatting rules; run `npm run lint` and `npm run format` before committing.

## Database

PostgreSQL 18, run locally via `docker/development/docker-compose.yml`. The `onlineshop` schema is created and seeded entirely by the backend's Flyway migrations — there's no separate database setup step beyond starting the container.
