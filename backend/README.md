# WorkBoard Backend

WorkBoard is a task management REST API built with Django and Django REST Framework.

It allows users to manage tasks, assign them to other users, track their status and due dates, and authenticate securely using JWT.

The project is designed as a modular backend application with a clear separation between business logic, infrastructure, and API concerns.

## Requirements

- Python 3.13+
- uv

## Setup

From the `backend` directory:

```bash
uv sync
```

Apply database migrations:

```bash
uv run python manage.py migrate
```

## Run Locally

Start the development server:

```bash
uv run python manage.py runserver
```

The API will be available at:

```text
http://127.0.0.1:8000/api/
```

## Tests

Run the test suite:

```bash
uv run pytest
```

Run only account tests:

```bash
uv run pytest src/apps/accounts/tests
```

## Quality Checks

Run Django system checks:

```bash
uv run python manage.py check
```

Run Ruff linting:

```bash
uv run ruff check .
```

Format code with Ruff:

```bash
uv run ruff format .
```

Run all common checks:

```bash
uv run python manage.py check
uv run pytest
uv run ruff check .
```

## Architecture

WorkBoard uses a **vertical modular architecture**, where the application is organized by business features instead of technical layers.

Each module, such as `accounts` or `taskmanager`, contains its own models, application logic, infrastructure, API, and exceptions.

This keeps each business feature independent and makes the project easier to understand, maintain, and extend.

```text
apps/
├── accounts/
│   ├── models.py
│   ├── exceptions.py
│   ├── application/
│   │   ├── services.py
│   │   ├── selectors.py
│   │   ├── dto.py
│   │   └── interfaces.py
│   ├── infrastructure/
│   │   └── repositories.py
│   └── api/
│       ├── serializers.py
│       ├── views.py
│       └── urls.py
│
└── taskmanager/
    └── ...

### Main Responsibilities

- **Models** — Business entities and persistence models.
- **Application** — Use cases, services, selectors, DTOs, and infrastructure contracts.
- **Infrastructure** — Implementations for repositories and external dependencies.
- **API** — HTTP endpoints, serializers, and routing.
- **Exceptions** — Business and application errors for each module.    