#!/bin/bash
# Start the server
exec gunicorn app:app --bind 0.0.0.0:$PORT --workers 3