#!/bin/sh
set -e

if [ "$1" = 'dev' ]; then
  echo "Starting Nginx and React Development Server..."
  nginx -g "daemon off;" &
  npm start
else
  exec "$@"
fi