#!/bin/sh

DATABASE_DIR="../../packages/database"

cd "$DATABASE_DIR" || exit 1

if [ "$NODE_ENV" = "production" ]; then
    ENV_PATH="../../apps/fb-collector/prod.env"
    export $(grep -v '^#' "$ENV_PATH" | xargs)
fi

npx npm run db:deploy || exit 1
npx npm run db:generate || exit 1

cd - || exit 1

if [ "$NODE_ENV" = "production" ]; then
    node dist/main.js
else
    npm run start:dev
fi
