# angular-boat-rental

**NOTE**: This project is published for reference only. There is no license and all rights are reserved.

This project was originally created for the "Project UML"-course of the Associate Degree in Web Development at the Amsterdam University of Applied Sciences. It was created together with Hans den Otter en Kees van Ruler, with some code adapted from examples provided by our teacher Paul Jansen.

I have stripped most of their code out of the project and reimplemented it myself, but it is possible (and, indeed, likely) that some small remnants of their code or code style remain. For this reason, this project is published for reference only. There is no license and all rights are reserved.

## Requirements

- Node (LTS)
- MySQL

## Backend installeren

1. Navigeer naar de `backend`-map.
1. Voer `npm install` uit.

1. Kopieer `.env.example` naar `.env`.
1. Pas de waarden aan voor jouw systeem.

1. Voer `npm run sync` uit om de database te initialiseren.
1. Voer eventueel `npm run seed` uit om test-data in de database te zetten.

In plaats van los `sync` en `seed` uit te voeren, is er ook `npm run debug` die deze stappen achter elkaar doet.

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

In plaats van los `drop`, `sync`, en `seed` uit te voeren, is er ook `npm run debug` die deze stappen achter elkaar doet.
