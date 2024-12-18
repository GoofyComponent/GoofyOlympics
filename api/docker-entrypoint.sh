#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo "🔄 Generating Prisma Client..."
npx prisma generate

INIT_FLAG="/app/data/.init_done"
if [ ! -f "$INIT_FLAG" ]; then
    echo "🔄 Première initialisation - Importing CSV data..."
    npm run convert-csv
    
    mkdir -p /app/data
    touch "$INIT_FLAG"
    echo "✅ Initialisation terminée"
else
    echo "ℹ️ Les données ont déjà été importées, skip de l'import CSV"
fi

echo "🚀 Starting the application..."
npm run start
