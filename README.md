# Het Vrolijke avontuur - DogStack

## Backend installeren

1. Navigeer naar de `backend`-map.
1. Voer `npm install` uit.

1. Kopieer `.env.example` naar `.env`.
1. Pas de waarden aan voor jouw systeem.

1. Voer `npm run sync` uit om de database te initialiseren.
1. Voer eventueel `npm run seed` uit om test-data in de database te zetten.

## Backend starten

1. Navigeer naar de `backend`-map.
1. Voer `npm start` uit om de backend-server te starten.

## Front-end installeren

1. Navigeer naar de `frontend`-map.
1. Voer `npm install` uit.

## Frontend starten

1. Navigeer naar de `frontend`-map.
1. Voer `npm start` uit om de frontend-server te starten.
1. Navigeer naar localhost:4200

## Database verwijderen

1. Navigeer naar de `backend`-map.
1. Voer `npm run drop` uit.

## Database resetten

1. Navigeer naar de `backend`-map.
1. Voer `npm run drop` uit.
1. Voer `npm run sync` uit.
1. Voer eventueel `npm run seed` uit om test-data in de database te zetten.

In plaats van los `drop`, `sync`, en `debug` uit te voeren, is er ook `npm run debug` die deze stappen achter elkaar doet.
