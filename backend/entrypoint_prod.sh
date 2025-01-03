#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

# Apply all migrations
echo "Applying migrations..."
python3 manage.py migrate

# Start Gunicorn (production WSGI server)
echo "Starting Gunicorn..."
gunicorn planner.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --threads 2 \
    --timeout 120
