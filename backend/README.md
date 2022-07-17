# angular-boat-rental backend

**NOTE**: This project is published for reference only. There is no license and all rights are reserved.

This project was originally created for the "Project UML"-course of the Associate Degree in Web Development at the Amsterdam University of Applied Sciences. It was created together with Hans den Otter en Kees van Ruler, with some code adapted from examples provided by our teacher Paul Jansen.

I have stripped most of their code out of the project and reimplemented it myself, but it is possible (and, indeed, likely) that some small remnants of their code or code style remain. For this reason, this project is published for reference only. There is no license and all rights are reserved.

## Requirements

- Node (LTS)
- MySQL

## Installation

1. Clone the repository and navigate to the `backend`-folder.
1. Run `npm install`

1. Copy `.env.example` to `.env`, and configure it for your system.

1. Optionally run `npm run drop` to delete the database.
1. Run `npm run sync` to initialize the database.
1. Optionally run `npm run seed` to populate the database with test data.

You can also run `npm run reset-database`, which sequentially runs `drop`, `sync` and `seed`.

## Use

- Run `npm start` to start the server.
- Run `npm test` to run the test suite.

## Testdata

### Email Addresses

- `stefkorporaal@test.com` (admininistrator)
- `keesvanruler@test.com`
- `hansdenotter@test.com`
- `pauljansen@test.com`

These users all have `abcdef1A` as password.
