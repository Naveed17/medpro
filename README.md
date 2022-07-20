# Med Pro
NextJS app. Frontend for SmartMedSA/med-core

### Development

Before starting, create .env.local file from the dist and update it with values provided by the development team.

```
$ cp .env.local.dist .env.local
$ # Update with your editor of choice.
```

To start the project locally with dev console, run:

```bash
npm run dev:up
```

Open `http://localhost:3000` with your browser to see the result.
## Documentation
### Directory Structure

- [`public`](./public) — Static assets such as robots.txt, images, and favicon.<br>
- [`src`](./src) — Application source code, including pages, features, styles.
  - [`app`](./src/app) — project config files.
  - [`features`](./src/features) — features components with redux toolkit example.
  - [`pages`](./src/pages) — pages with custom _app.js and layout.
    - [`api`](./src/pages/api) — override next auth global configs.
    - [`auth`](./src/pages/auth) — override next auth global pages.
  - [`styles`](./src/styles) — styles files with sass.
  - [`themes`](./src/themes) — project themes.
  - [`types`](./src/types) — custom types for typescript.

### Scripts
- `npm run dev` — Starts the application in development mode at `http://localhost:3000`.
- `npm run build` — Creates an optimized production build of your application.
- `npm run dev:up` — Starts the docker image in development mode .
- `npm run prod:up` — Starts the docker image in production mode.

### Environment Variables
| Variable                   | Default Value |
|----------------------------|---------------|
| NEXTAUTH_URL               |               |
| NEXTAUTH_SECRET            |               |
| KEYCLOAK_ID                |               |
| KEYCLOAK_SECRET            |               |
| KEYCLOAK_ISSUER            |               |
| NEXT_PUBLIC_BACK_END_POINT |               |