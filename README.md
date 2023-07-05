<p align="center">
  <img src="https://cdn.med.tn/img/logo_med.svg" width="100" alt="Med.tn">
</p>

# Med Link
NextJS app for SmartMedSA/med-pro

### Environment URLs

| Country    |          URL                   |
|----------- |--------------------------------|
| Tunisia    | https://medpro.med.tn          |
| Morocco    | https://medpro.med.ma          |
|Ivory coast | https://ci.medlink.doctor      |
| Senegal    | https://sn.medlink.doctor      |
| Algeria    | https://dz.medlink.doctor      |

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
  - [`lib`](./src/lib) — project config files.
  - [`features`](./src/features) — features components with redux toolkit example.
  - [`interfaces`](./src/interfaces) — interfaces for objects .
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
| NEXTAUTH_LOGOUT_URL        |               |
| NEXTAUTH_SECRET            |               |
| KEYCLOAK_ID                |               |
| KEYCLOAK_SECRET            |               |
| KEYCLOAK_ISSUER            |               |
| KEYCLOAK_AUTH_TOKEN_URL            |               |
| NEXT_PUBLIC_API_URL        |               |
| NEXT_PUBLIC_FCM_API_KEY        |               |
| NEXT_PUBLIC_FCM_AUTH_DOMAIN        |               |
| NEXT_PUBLIC_FCM_DATABASE_URL        |               |
| NEXT_PUBLIC_FCM_PROJECT_ID        |               |
| NEXT_PUBLIC_FCM_STORAGE_BUCKET        |               |
| NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID        |               |
| NEXT_PUBLIC_FCM_APP_ID        |               |
| NEXT_PUBLIC_FCM_MEASUREMENT_ID        |               |
| FCM_KEY_PAIR        |               |
| FCM_WEB_API_KEY        |               |
| S3_URL        |               |
| NEXT_PUBLIC_DEVISE        |               |
| NEXT_PUBLIC_COUNTRY        |               |
| SENTRY_DSN        |               |
| NEXT_PUBLIC_SENTRY_DSN        |               |
| SENTRY_IGNORE_API_RESOLUTION_ERROR        |               |
## API
- [useRequest](#userequestrequest-config)
- [useRequestMutation](#userequestmutationrequest-config)

### useRequest(request, config)

The main React hook to execute HTTP requests with [SWR](https://swr.vercel.app/) and [Axios](https://github.com/axios/axios).

- `request` - The axios request [config](https://github.com/axios/axios#request-config) object, the same argument accepted by `axios`.
- `config` - An options object for [SWR](https://swr.vercel.app/) configuration.
  - `suspense` (`false`): enable React Suspense mode (details)
  - `fetcher` (`args`): the fetcher function
  - `revalidateIfStale` (`true`): automatically revalidate even if there is stale data (details)
  - `revalidateOnMount`: enable or disable automatic revalidation when component is mounted
  - `revalidateOnFocus` (`true`): automatically revalidate when window gets focused (details)
  - `revalidateOnReconnect` (`true`): automatically revalidate when the browser regains a network connection (via navigator.onLine) (details)
  - `refreshInterval` (`details`):
    - Disabled by default: refreshInterval = 0
    - If set to a number, polling interval in milliseconds
    - If set to a function, the function will receive the latest data and should return the interval in milliseconds
  - `refreshWhenHidden` (`false`): polling when the window is invisible (if refreshInterval is enabled)
  - `refreshWhenOffline` (`false`): polling when the browser is offline (determined by navigator.onLine)
  - `shouldRetryOnError` (`true`): retry when fetcher has an error
  - `dedupingInterval` (`2000`): dedupe requests with the same key in this time span in milliseconds
  - `focusThrottleInterval` (`5000`): only revalidate once during a time span in milliseconds
  - `loadingTimeout` (`3000`): timeout to trigger the onLoadingSlow event in milliseconds
  - `errorRetryInterval`(`5000`): error retry interval in milliseconds
  - `errorRetryCount`: max error retry count
  - `fallback`: a key-value object of multiple fallback data (example)
  - `fallbackData`: initial data to be returned (note: This is per-hook)
  - `onLoadingSlow(key, config)`: callback function when a request takes too long to load (see loadingTimeout)
  - `onSuccess(data, key, config)`: callback function when a request finishes successfully
  - `onError(err, key, config`): callback function when a request returns an error
  - `onErrorRetry(err, key, config, revalidate, revalidateOps)`: handler for error retry
  - `compare(a, b)`: comparison function used to detect when returned data has changed, to avoid spurious rerenders. By default, stable-hash is used.
  - `isPaused()`: function to detect whether pause revalidations, will ignore fetched data and errors when it returns true. Returns false by default.
  - `use`: array of middleware functions (details)
   
**Returns**

`[{ data, response, error, isValidating, mutate }]`

- `data` - The [success response](https://github.com/axios/axios#response-schema) data property (for convenient access).
- `response` - The whole [success response](https://github.com/axios/axios#response-schema) object.
- `error` - The [error](https://github.com/axios/axios#handling-errors) value
- `isValidating` - if there's a request or revalidation loading.
- `mutate(data?, shouldRevalidate?)` - function to mutate the cached data [(details)]('https://swr.vercel.app/docs/mutation').

### Quick Start
```ts
    import {useRequest} from "@lib/axios";

    const {data: httpResponse, error: errorHttp} = useRequest({
        method: "GET",
        url: `${url}`,
        headers: {...}
      },{
        revalidateOnFocus: true,
        ...
      });
```
### useRequestMutation(request, config)

The React hook to execute HTTP requests for remote mutations (useSWRMutation).

- `request` - The axios request [config](https://github.com/axios/axios#request-config) object, the same argument accepted by `axios`.
- `config` - An options object for [SWR](https://swr.vercel.app/docs/mutation) configuration.
  - `suspense` (`false`): enable React Suspense mode (details)
  - `fetcher` (`args`): the fetcher function
  - `revalidateIfStale` (`true`): automatically revalidate even if there is stale data (details)
  - `revalidateOnMount`: enable or disable automatic revalidation when component is mounted
  - `revalidateOnFocus` (`true`): automatically revalidate when window gets focused (details)
  - `revalidateOnReconnect` (`true`): automatically revalidate when the browser regains a network connection (via navigator.onLine) (details)
  - `refreshInterval` (`details`):
    - Disabled by default: refreshInterval = 0
    - If set to a number, polling interval in milliseconds
    - If set to a function, the function will receive the latest data and should return the interval in milliseconds
  - `refreshWhenHidden` (`false`): polling when the window is invisible (if refreshInterval is enabled)
  - `refreshWhenOffline` (`false`): polling when the browser is offline (determined by navigator.onLine)
  - `shouldRetryOnError` (`true`): retry when fetcher has an error
  - `dedupingInterval` (`2000`): dedupe requests with the same key in this time span in milliseconds
  - `focusThrottleInterval` (`5000`): only revalidate once during a time span in milliseconds
  - `loadingTimeout` (`3000`): timeout to trigger the onLoadingSlow event in milliseconds
  - `errorRetryInterval`(`5000`): error retry interval in milliseconds
  - `errorRetryCount`: max error retry count
  - `fallback`: a key-value object of multiple fallback data (example)
  - `fallbackData`: initial data to be returned (note: This is per-hook)
  - `onLoadingSlow(key, config)`: callback function when a request takes too long to load (see loadingTimeout)
  - `onSuccess(data, key, config)`: callback function when a request finishes successfully
  - `onError(err, key, config`): callback function when a request returns an error
  - `onErrorRetry(err, key, config, revalidate, revalidateOps)`: handler for error retry
  - `compare(a, b)`: comparison function used to detect when returned data has changed, to avoid spurious rerenders. By default, stable-hash is used.
  - `isPaused()`: function to detect whether pause revalidations, will ignore fetched data and errors when it returns true. Returns false by default.
  - `use`: array of middleware functions (details)

**Returns**

`[{ data, response, error, trigger, isMutating, reset }]`

- `data` - The [success response](https://github.com/axios/axios#response-schema) data property (for convenient access).
- `response` - The whole [success response](https://github.com/axios/axios#response-schema) object.
- `error` - The [error](https://github.com/axios/axios#handling-errors) value.
- `trigger(key?, extraArgument?)` - Trigger the request manually, the extra argument will be passed to the mutator as `{ arg }`.
- `isMutating` -if there's a request or revalidation mutated.
- `reset` - reset the state (data, error, isMutating).
- 
### Quick Start
```ts
    import {useRequestMutation} from "@lib/axios";

    const {data: httpResponse, error: errorHttp, trigger, isMutating} = useRequestMutation({
        method: "GET",
        url: `${url}`,
        headers: {...}
      },{
        revalidateOnFocus: true,
        ...
      });

    trigger();
    
    //Or invoke trigger with params
    trigger({
      method: "GET",
      url: `${url}`,
      headers: {...}
    },{
      revalidate: true, 
      populateCache: true,
      ...
    });
```
