# Het Vrolijke avontuur - DogStack

## Backend installeren

1. Navigeer naar de `backend`-map.
1. Voer `npm install` uit.

1. Kopieer `.env.example` naar `.env`.
1. Pas de waarden aan voor jouw systeem.

1. Voer `npm run sync` uit om de database te initialiseren.
1. Voer eventueel `npm run seed` uit om test-data in de database te zetten.

In plaats van los `sync`, en `debug` uit te voeren, is er ook `npm run debug` die deze stappen achter elkaar doet.

De testgebruikers hebben `test[0-4]@test.test` als email-address en `password` als wachtwoord.

`test0@test.test` is een beheerder.

## Backend starten

1. Navigeer naar de `backend`-map.
1. Voer `npm start` uit om de backend-server te starten.

## Backend testen

1. Navigeer naar de `backend`-map.
1. Voer `npm test` uit om de backend tests te runnen.

## Front-end installeren

1. Navigeer naar de `frontend`-map.
1. Voer `npm install` uit.

## Frontend starten

1. Navigeer naar de `frontend`-map.
1. Voer `npm start` uit om de frontend-server te starten.
1. Navigeer naar localhost:4200

## Frontend testen

1. Navigeer naar de `frontend`-map.
1. Voer `npm test` uit om de frontend test-runner te starten in `watch`-modus.
1. Voer `npm run test-ci` uit om de frontend tests eenmaling te runnen, zonder browser.

## Database verwijderen

1. Navigeer naar de `backend`-map.
1. Voer `npm run drop` uit.

## Database resetten

1. Navigeer naar de `backend`-map.
1. Voer `npm run drop` uit.
1. Voer `npm run sync` uit.
1. Voer eventueel `npm run seed` uit om test-data in de database te zetten.

In plaats van los `drop`, `sync`, en `debug` uit te voeren, is er ook `npm run debug` die deze stappen achter elkaar doet.
