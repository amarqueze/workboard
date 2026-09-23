# WorkBoard — Agent Guidelines

## 1. Project Overview

WorkBoard is a task management application built with Django following pragmatic Clean Architecture principles.

The backend exposes a REST API that allows users to:

- Create, read, update, and delete tasks.
- Assign tasks to users.
- Mark tasks as completed.
- Filter tasks by status and due date.
- Create accounts and authenticate using JWT.

The repository is organized as a monorepo:

```text
workboard/
├── backend/
└── frontend/
```

The backend is currently the primary focus.

---

## 2. Technology Stack

Backend:

* Python 3.13+
* Django
* Django REST Framework
* Simple JWT
* SQLite
* uv for dependency and environment management
* pytest / pytest-django for testing
* Ruff for linting and formatting
* mypy with django-stubs for static type checking

Prefer mature, well-maintained libraries over custom infrastructure when an established solution already exists.

---

## 3. Architectural Philosophy

WorkBoard follows a pragmatic Clean Architecture approach adapted to Django.

The main goals are:

1. Clear separation of responsibilities.
2. Business logic must not live in views or serializers.
3. HTTP concerns remain in the API layer.
4. Persistence and external integrations are isolated behind interfaces when useful.
5. Application use cases are explicit.
6. Django ORM is used naturally instead of being hidden unnecessarily.
7. Architectural abstractions must provide practical value.

Architecture must improve readability, maintainability, and testability.

Do not introduce abstractions solely for architectural purity.

---

## 4. Project Organization

The backend is organized vertically by business module.

```text
backend/
├── manage.py
├── pyproject.toml
├── uv.lock
└── src/
    ├── config/
    │   ├── settings/
    │   │   ├── base.py
    │   │   ├── local.py
    │   │   └── production.py
    │   ├── urls.py
    │   ├── asgi.py
    │   └── wsgi.py
    │
    └── apps/
        ├── accounts/
        │   ├── __init__.py
        │   ├── apps.py
        │   ├── models.py
        │   ├── exceptions.py
        │   ├── application/
        │   ├── infrastructure/
        │   ├── api/
        │   ├── migrations/
        │   └── tests/
        │
        └── taskmanager/
            ├── __init__.py
            ├── apps.py
            ├── models.py
            ├── exceptions.py
            ├── application/
            ├── infrastructure/
            ├── api/
            ├── migrations/
            └── tests/
```

Modules must be organized around business capabilities.

Do not create global folders such as:

```text
services/
repositories/
serializers/
models/
```

that mix unrelated modules.

Do not create every directory or file upfront.

Create architectural components only when they are required by an actual use case.

---

## 5. Models and Business Rules

Django ORM models are the business entities of WorkBoard.

They must be defined directly in each module's:

```text
models.py
```

Do not create a separate `domain/` directory.

WorkBoard does not maintain duplicated representations such as:

```text
DomainEntity
ORMModel
Mapper
```

unless a concrete requirement justifies the additional complexity.

For this project:

```text
Django Model = Business Entity
```

Business behavior should live on the model when the behavior naturally belongs to that entity.

Example:

```python
class Task(models.Model):
    def complete(self) -> None:
        if self.status == self.Status.COMPLETED:
            raise TaskAlreadyCompletedError()

        self.status = self.Status.COMPLETED
```

Model methods should generally modify business state without deciding when persistence occurs.

For example:

```python
task.complete()
```

should normally modify the entity without internally calling:

```python
task.save()
```

Persistence should remain coordinated by the application layer.

Module-specific business and application exceptions belong directly in:

```text
<module>/exceptions.py
```

Examples:

```text
accounts/exceptions.py
taskmanager/exceptions.py
```

These exceptions must describe business or application failures without containing HTTP or DRF concerns.

---

## 6. Application Layer

The `application/` directory contains use cases and orchestration.

Typical structure:

```text
application/
├── services.py
├── selectors.py
├── dto.py
└── interfaces.py
```

These files should be created only when required.

### services.py

Services represent state-changing use cases.

Examples:

```text
create_task()
update_task()
delete_task()
complete_task()
assign_task()
register_account()
login()
```

Services should normally be functions unless maintaining state provides a concrete benefit.

Services may use Django transaction management directly.

Example:

```python
from django.db import transaction


@transaction.atomic
def create_task(...):
    ...
```

This is an intentional architectural decision.

### selectors.py

Selectors contain read-oriented operations.

Examples:

```text
get_task()
list_tasks()
search_tasks()
get_tasks_by_user()
```

Selectors should not contain business mutations.

Use services for commands and selectors for queries.

### dto.py

DTOs define application-layer input and output contracts.

Prefer immutable DTOs where appropriate:

```python
from dataclasses import dataclass


@dataclass(frozen=True, slots=True, kw_only=True)
class CreateTaskDTO:
    title: str
    description: str
```

DTOs must not depend on HTTP concepts.

They must not contain:

* DRF Request objects.
* DRF Response objects.
* HTTP status codes.
* Serializer behavior.

---

## 7. Interfaces

Interfaces exist only where the application layer needs to interact with infrastructure or an external dependency.

Typical uses include:

* Repositories.
* External HTTP APIs.
* Email providers.
* File storage.
* Message brokers.
* Payment providers.
* Third-party SDKs.
* Any external service required by an application service.

Interfaces belong to:

```text
application/interfaces.py
```

Example:

```python
from typing import Protocol


class TaskRepository(Protocol):
    def get_by_id(self, task_id: int):
        ...

    def save(self, task):
        ...
```

Another example:

```python
class EmailSender(Protocol):
    def send(self, *, to: str, subject: str, body: str) -> None:
        ...
```

Do not create interfaces for internal code without a concrete reason.

Do not create interfaces for:

```text
services
selectors
DTOs
models
serializers
views
```

simply to add abstraction.

---

## 8. Infrastructure Layer

Concrete implementations of application interfaces belong to:

```text
infrastructure/
```

Typical structure:

```text
infrastructure/
├── repositories.py
├── email.py
├── storage.py
└── external_api.py
```

Example:

```python
class DjangoTaskRepository:
    ...
```

or:

```python
class SendGridEmailSender:
    ...
```

The infrastructure layer is the correct place to:

* Use persistence-specific details when persistence is accessed through an application interface.
* Instantiate external SDK clients.
* Call third-party APIs.
* Interact with queues.
* Interact with storage systems.
* Translate external-library responses into application-friendly representations.

Application services should depend on interfaces when crossing infrastructure or external boundaries.

Do not introduce repository abstractions solely to hide Django ORM if they provide no practical value.

---

## 9. Dependency Injection

Dependencies should be passed explicitly to application services when the service depends on an application interface.

Example:

```python
def create_task(
    *,
    data: CreateTaskDTO,
    repository: TaskRepository,
) -> TaskResponseDTO:
    ...
```

Infrastructure implementations may be created at the API/composition boundary:

```python
repository = DjangoTaskRepository()

result = create_task(
    data=dto,
    repository=repository,
)
```

Factories may be introduced when dependency construction becomes repetitive.

Do not introduce a dependency injection framework unless a concrete requirement justifies it.

---

## 10. Transactions

Transaction boundaries belong to application use cases.

Example:

```python
@transaction.atomic
def create_task(...):
    ...
```

Transactions should normally cover the complete business operation.

Repositories should not independently define transaction boundaries unless there is a specific persistence requirement.

---

## 11. API Layer

HTTP-specific code belongs to:

```text
api/
```

Typical structure:

```text
api/
├── serializers.py
├── views.py
├── urls.py
└── exception_handler.py
```

The API layer is responsible for:

* Parsing HTTP requests.
* Validating request input.
* Authentication and permissions.
* Converting validated input into DTOs.
* Invoking services or selectors.
* Serializing results.
* Translating known exceptions into HTTP responses.

Business logic must not live inside views or serializers.

The expected flow is:

```text
HTTP Request
    ↓
Request Serializer
    ↓
Application DTO
    ↓
Service / Selector
    ↓
Response DTO / Model
    ↓
Response Serializer
    ↓
HTTP Response
```

---

## 12. DRF Serializers

DRF serializers represent HTTP contracts.

They are not application DTOs.

Request serializers:

* Validate incoming data.
* Normalize input.
* Provide validated values.

Response serializers:

* Convert DTOs or application results into API representations.

Request and response serializers may be different when their contracts differ.

Example:

```text
CreateTaskRequestSerializer
TaskResponseSerializer
```

HTTP response envelopes such as:

```json
{
  "data": {}
}
```

belong to the API layer and should not become application DTO concerns.

---

## 13. ViewSets

Use DRF ViewSets when representing REST resources.

Example standard operations:

```text
GET    /tasks/
POST   /tasks/
GET    /tasks/{id}/
PUT    /tasks/{id}/
PATCH  /tasks/{id}/
DELETE /tasks/{id}/
```

Use `@action` for resource-specific operations.

Examples:

```text
POST /tasks/{id}/complete/
POST /tasks/search/
```

Views and ViewSets must remain thin.

They should coordinate HTTP concerns, not implement business rules.

---

## 14. Error Handling and Exceptions

WorkBoard uses centralized API error handling.

Exceptions are separated into two categories:

1. Expected business/application errors.
2. Unexpected infrastructure or system errors.

The code that detects an error should not be responsible for deciding its HTTP representation unless it belongs to the API layer.

### Business and Application Exceptions

Expected business errors belong to the module that owns the behavior.

Examples:

```text
taskmanager/exceptions.py
accounts/exceptions.py
```

Example:

```python
class TaskError(Exception):
    pass


class TaskNotFoundError(TaskError):
    pass


class TaskAlreadyCompletedError(TaskError):
    pass
```

These exceptions describe what happened from the business perspective.

They must not contain HTTP concepts such as:

- HTTP status codes.
- DRF Response objects.
- HTTP-specific payloads.

### Module Exception Handlers

Each module may define how its known exceptions are translated into API responses.

Example:

```text
taskmanager/api/exception_handler.py
accounts/api/exception_handler.py
```

Conceptually:

```text
TaskNotFoundError
    ↓
taskmanager exception handler
    ↓
HTTP 404

TaskAlreadyCompletedError
    ↓
taskmanager exception handler
    ↓
HTTP 409
```

This keeps knowledge about task-related errors inside the `taskmanager` module and account-related errors inside the `accounts` module.

### Global Exception Handler

All module exception handlers are composed by a global DRF exception handler.

The global handler is the final error boundary of the REST API.

Conceptually:

```text
Exception
    ↓
DRF built-in exception handling
    ↓
Module exception handlers
    ↓
Infrastructure/system error handling
    ↓
Generic HTTP 500 fallback
```

The global handler should:

1. Preserve DRF's native handling for known DRF exceptions.
2. Delegate known business exceptions to the appropriate module handler.
3. Translate explicitly recognized infrastructure failures when appropriate.
4. Log unexpected exceptions with their full traceback.
5. Return a safe generic response for unexpected failures.
6. Never expose internal exception messages, stack traces, SQL, credentials, or infrastructure details to API clients.

The global handler belongs to shared API/configuration code, not to a business module.

For example:

```text
config/exception_handler.py
```

It is registered through Django REST Framework settings.

### Database Errors

Low-level database exceptions must not normally leak directly to clients.

Examples include:

```text
IntegrityError
DatabaseError
OperationalError
```

When a database error represents an expected business situation, prefer preventing or translating it close to the relevant application/infrastructure boundary.

For example, a unique constraint violation that represents an already existing account may be translated into a known application exception:

```text
IntegrityError
    ↓
AccountAlreadyExistsError
    ↓
module/global exception handling
    ↓
HTTP 409
```

Do not expose the original database exception to the client.

Unexpected database failures should normally reach the global exception boundary, be logged with their traceback, and produce a generic server error response.

A recognized infrastructure availability problem may be translated to HTTP 503 when the application can reliably identify that condition.

Do not blindly convert every database exception into HTTP 503.

### External Service Errors

Third-party libraries and external services belong behind infrastructure implementations.

Example:

```text
Application Service
    ↓
EmailSender interface
    ↓
Infrastructure implementation
    ↓
External email SDK
```

Infrastructure-specific exceptions should not leak unnecessarily into the application layer.

When the application needs to react to a specific external failure, the infrastructure implementation should translate the library-specific exception into an application-understood exception.

Example:

```text
ThirdPartyEmailTimeout
    ↓
EmailServiceUnavailableError
```

The service can then decide whether that failure affects the use case.

This prevents application services from depending on exceptions from specific SDKs or providers.

### Unexpected Errors

Programming errors and unknown failures must not be converted into fake business errors.

Examples:

```text
AttributeError
TypeError
unexpected RuntimeError
unknown database failures
unknown third-party library failures
```

These errors should propagate to the global exception handler.

The global handler must:

- Log the exception with traceback.
- Return HTTP 500.
- Return a generic public message.

Example response:

```json
{
    "error": {
        "code": "INTERNAL_SERVER_ERROR",
        "message": "An unexpected error occurred."
    }
}
```

The original exception message must not be exposed to the client.

### Logging

Expected business errors generally do not require error-level traceback logging.

Unexpected infrastructure and programming failures should be logged with enough context and the complete traceback for diagnosis.

Use Python's standard logging system:

```python
import logging


logger = logging.getLogger(__name__)
```

Use logging levels according to their intent:

```text
DEBUG     diagnostic information
INFO      relevant normal operations
WARNING   abnormal but recoverable situations
ERROR     technical operation failures
CRITICAL  severe system-level failures
```

When handling an unexpected exception, prefer:

```python
logger.exception("Unexpected error while processing request")
```

when the traceback is required.

Sensitive information must never be written to logs.

Do not log:

- Passwords.
- JWT access tokens.
- JWT refresh tokens.
- Authorization headers.
- SECRET_KEY.
- Credentials.
- Sensitive request payloads.

### Error Handling Rules

Do not:

- Catch `Exception` inside every service.
- Wrap every exception in a custom exception.
- Expose raw database errors.
- Expose third-party SDK errors.
- Return DRF `Response` objects from models or application code.
- Duplicate the same exception-to-HTTP mapping across views.
- Hide programming bugs by converting them into business errors.

Prefer:

```text
Known business failure
    → business/application exception
    → module exception handler
    → HTTP response

Known external failure relevant to the use case
    → infrastructure translation
    → application exception
    → module/global handler
    → HTTP response

Unexpected failure
    → global exception handler
    → log traceback
    → generic HTTP 500
```

---

## 15. Accounts and Authentication

The `accounts` module owns authentication-related functionality.

It is responsible for:

* Account creation.
* Login.
* Password handling.
* JWT generation.
* Authentication identity.

WorkBoard distinguishes between:

```text
Account
```

and:

```text
User
```

`Account` represents authentication identity and credentials.

`User` represents the business user participating in WorkBoard.

Conceptually:

```text
Account 1 ─── 1 User
User    1 ─── N Task
```

Tasks reference the business `User`, not the authentication `Account`.

Account registration may create both `Account` and `User` within one transaction.

The account email is the authentication identity and should remain owned by `Account`.

Do not duplicate the authentication email in `User` unless a concrete future requirement requires an independent business email.

---

## 16. Django Authentication

Use Django's authentication system for credentials.

`Account` is the project's custom authentication model and must be configured through:

```python
AUTH_USER_MODEL = "accounts.Account"
```

Passwords must never be stored or compared manually.

Use:

```python
create_user(...)
```

or:

```python
set_password(...)
```

for password creation.

Use:

```python
authenticate(...)
```

for credential verification.

Do not implement password hashing manually.

Do not introduce a custom authentication backend unless Django's standard authentication behavior cannot satisfy a concrete requirement.

---

## 17. JWT

WorkBoard uses Simple JWT.

Login flow:

```text
email + password
        ↓
Django authenticate()
        ↓
Account
        ↓
Simple JWT
        ↓
access token + refresh token
```

Protected requests use:

```http
Authorization: Bearer <access-token>
```

JWT validation belongs to DRF authentication infrastructure.

Application services must not parse or validate JWT tokens.

Passwords and generated tokens must never be logged.

---

## 18. Testing Strategy

Tests should verify behavior, not implementation details.

Use:

- Unit tests for model business behavior.
- Service tests for application workflows.
- Repository integration tests when persistence behavior matters.
- Selector tests when query behavior matters.
- API tests for HTTP contracts.

Test implementations of application interfaces should use the `Mock` prefix.

Examples:

```text
MockTaskRepository
MockEmailSender
MockStorageClient
```

These implementations may be used when testing application services in isolation.

Django's test database may be used freely for ORM and integration tests.

Not every test needs to avoid the database.

---

## 19. Rules for Making Changes

Before modifying code:

1. Identify the business module that owns the feature.
2. Identify the layer responsible for the behavior.
3. Inspect existing patterns before introducing new ones.
4. Extend existing conventions whenever possible.
5. Avoid unrelated refactors.
6. Keep changes focused and cohesive.
7. Add or update tests.
8. Run quality checks.

Use this reasoning flow:

```text
Requirement
    ↓
Owning module
    ↓
Business rules / Models
    ↓
Application use case
    ↓
Required interfaces
    ↓
Infrastructure implementation
    ↓
API contract
    ↓
Tests
```

Do not start by putting business logic directly into a view and refactoring later.

---

## 20. Dependency Direction

Conceptually:

```text
API
 ↓
Application
 ↓
Models / Business Entities

Infrastructure
 ↑
implements application interfaces
```

Django ORM models are the business entities of the application.

Django transaction management is intentionally allowed inside application services.

Infrastructure-specific libraries must remain inside infrastructure whenever they are accessed through an application interface.

Interfaces should only be introduced at meaningful infrastructure or external boundaries.

These are deliberate project decisions.

Do not replace them without a concrete requirement.

---

## 21. Code Quality

Prioritize:

* Readability.
* Explicitness.
* Cohesion.
* Good naming.
* Type hints.
* Small focused functions.
* Django conventions.
* Testability.
* Minimal accidental complexity.

Avoid:

* Fat views.
* Business logic in serializers.
* Unnecessary interfaces.
* Generic utility dumping grounds.
* Circular imports.
* Hidden dependencies.
* Over-engineering.
* Duplicate ORM/business entities without justification.
* Unnecessary architectural layers.
* A separate `domain/` directory.

---

## 22. Validation Before Completing a Change

Run the relevant checks:

```bash
uv run python manage.py check
uv run pytest
uv run ruff check .
```

When formatting is needed:

```bash
uv run ruff format .
```

Run type checking once configured:

```bash
uv run mypy .
```

Do not claim that a change works unless the relevant checks have passed.

---

## 23. Architectural Decision Rule

When multiple implementations are possible, prefer:

1. Correctness.
2. Simplicity.
3. Existing project conventions.
4. Django and Python idioms.
5. Testability.
6. Architectural purity.

Architecture exists to make the system easier to understand and evolve.

Every abstraction must justify its existence.