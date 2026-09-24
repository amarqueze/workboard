FROM python:3.13-slim

WORKDIR /app

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

COPY pyproject.toml uv.lock ./

RUN uv sync --frozen --no-dev

COPY manage.py ./
COPY src ./src
COPY start.sh ./

RUN chmod +x /app/start.sh

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV DJANGO_SETTINGS_MODULE=config.settings.production
ENV PYTHONPATH=/app/src

EXPOSE 8000

CMD ["/app/start.sh"]