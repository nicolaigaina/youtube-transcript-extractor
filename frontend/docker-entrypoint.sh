#!/bin/sh
set -e
if [ ! -f /app/data/transcripts.db ]; then
  echo "Initializing database from template..."
  cp /app/prisma/template.db /app/data/transcripts.db
fi
exec node server.js
