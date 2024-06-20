
# Bitespeed Backend Task: Identity Reconciliation

I have used AdonisJs and sqlite for this assignment.
https://adonisjs.com/

To install dependencies
```
npm i
```
To run unit tests
```
node ace test unit
```
To run functional tests
```
node ace test functional
```
To run the assignment
```
npm run dev
```
After running `/identify` endpoint will be exposed on port `3333` which can be consumed using `POST` method.
It will accept `email` and `phoneNumber` as `string|null` value in json body.

All logic is in app folder.
All tests are in tests folder.
Migrations and seeders are in database folder.
Route is declared in start/routes.ts file.

`app/controllers/identifies_controller.ts` File contains the entrypoint for api logic

`app/validators/identify.ts` File contains simple validation logic using vine.

`app/models/contact.ts` File contains Contact model

`database/migrations` contains contact table migrations.

`app/dao/contact.ts` File contains dao for contact model.

`tests` folder contains both unit and functional tests used.

Code is well commented and self descriptive.

I know .env shouldn't be added to git, but for simplicity of running the code I have added it.