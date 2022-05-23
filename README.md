<p align="center">
  <img src="https://cdn.med.tn/img/logo_med.svg" width="100" alt="Med TypeScript Starter">
</p>

<br />

<div align="center"><strong>Med TypeScript starter for Next.js</strong></div>
<div align="center">Med project.</div>

<br />

### Development

To start the project locally with dev console, run:

```bash
npm run dev:up
```

Open `http://localhost:3000` with your browser to see the result.

<br />
To start the project in prod mode, run:

```bash
npm run prod:up
```
## Documentation

### Directory Structure

- [`public`](./public) — Static assets such as robots.txt, images, and favicon.<br>
- [`src`](./src) — Application source code, including pages, features, styles.
  - [`app`](./src/app) — project config files.
  - [`features`](./src/features) — features components with redux toolkit example.
  - [`pages`](./src/pages) — pages with custom _app.js and layout.
  - [`styles`](./src/styles) — styles files with sass.
  - [`themes`](./src/themes) — project themes.
  - [`types`](./src/types) — custom types for typescript.

### Scripts

- `npm run dev` — Starts the application in development mode at `http://localhost:3000`.
- `npm run build` — Creates an optimized production build of your application.
- `npm run dev:up` — Starts the docker image in development mode .
- `npm run prod:up` — Starts the docker image in production mode.
