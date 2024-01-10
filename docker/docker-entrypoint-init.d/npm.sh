#!/usr/bin/env bash
echo "INIT -- npm.sh -- start"
cd "$APP_ROOT" || exit 1

# Run npm ci if package-lock.json exists.
if [[ -f "./package-lock.json" ]]; then
  echo "Running npm ci.."
  npm ci --audit=false --fund=false
fi

echo "INIT -- npm.sh -- done"
