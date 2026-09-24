#!/bin/sh
set -e

echo "Applying migrations..."
.venv/bin/python manage.py migrate

echo "Starting Django task worker..."
.venv/bin/python manage.py db_worker &
WORKER_PID=$!

echo "Starting Gunicorn..."
.venv/bin/gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 4 &
GUNICORN_PID=$!

trap 'kill $WORKER_PID $GUNICORN_PID 2>/dev/null || true' TERM INT

wait "$GUNICORN_PID"
EXIT_CODE=$?

kill $WORKER_PID $GUNICORN_PID 2>/dev/null || true
wait || true

exit $EXIT_CODE
