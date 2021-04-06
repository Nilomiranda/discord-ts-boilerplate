# Discord TS Boilerplate

This a simple boilerplate to help you get started with discord bot development and typescript.

## Batteries included

### Main libs
- DiscordJS
- Typescript

### Code quality
- Prettier
- Eslint
- Lint staged

### Database
- Knex Query builder
- PostgreSQL driver

> A note about the database. The code to set up and connect is commented out in `config/database.ts`
> Edit that file if you need to enable and make sure to check `.env.example` for the necessary environment
> variables

## Overall structure

`index.ts` is the entry point for the project.

`parseCommand.ts` can be used to place function that will read messages sent to the bot and check
which function should be called to handle given command.

`/guards/rolesGuard.ts` is a file that has a HOF that will return the functin the be executed
only if the user role matches the allowed ones.

`/entities` usefull if you need to work with the database

`/config` place any other configuration file you might find useful

`/common` stuff that will be used across the application but doesn't match any other category

`/commands` put your commands here. You can separate by files or out everything in a single one. It's up to you.

## Deployment on Heroku

There's a procfile configure to help with Heroku hosting, to make the bot properly work.
If you plan on using it, make sure the value associated to `service` matches your server start command
or any other command you need in order to get everything running.

If you plan on hosting somewhere else, just get rid of this file.