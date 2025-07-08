#!/bin/sh

DATABASE_DIR="../../packages/database"

cd "$DATABASE_DIR" || {
  exit 1
}

npx npm run db:deploy || {
  exit 1
}

npx npm run db:generate || {
  exit 1
}

cd - || exit

npm run start:dev
