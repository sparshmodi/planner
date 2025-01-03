#!/bin/sh

# Exit immediately if a command exits with a non-zero status
set -e

# Apply all migrations
echo "Applying migrations..."
python3 manage.py migrate

# Start the Django development server
echo "Starting Django development server..."
python3 manage.py runserver 0.0.0.0:8000
