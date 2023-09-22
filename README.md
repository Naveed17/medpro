<p align="center">
  <img src="public/android-chrome-192x192.png" width="100" alt="Med.tn">
</p>

# Med Link

NextJS app for SmartMedSA/med-pro

### Environment URLs

| Country     | URL                       |
|-------------|---------------------------|
| Tunisia     | https://medpro.med.tn     |
| Morocco     | https://medpro.med.ma     |
| Ivory coast | https://ci.medlink.doctor |
| Senegal     | https://sn.medlink.doctor |
| Algeria     | https://dz.medlink.doctor |

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

| Variable                            | Default Value |
|-------------------------------------|---------------|
| NEXTAUTH_URL                        |               |
| NEXTAUTH_LOGOUT_URL                 |               |
| NEXTAUTH_SECRET                     |               |
| KEYCLOAK_ID                         |               |
| KEYCLOAK_SECRET                     |               |
| KEYCLOAK_ISSUER                     |               |
| KEYCLOAK_AUTH_TOKEN_URL             |               |
| NEXT_PUBLIC_API_URL                 |               |
| NEXT_PUBLIC_FCM_API_KEY             |               |
| NEXT_PUBLIC_FCM_AUTH_DOMAIN         |               |
| NEXT_PUBLIC_FCM_DATABASE_URL        |               |
| NEXT_PUBLIC_FCM_PROJECT_ID          |               |
| NEXT_PUBLIC_FCM_STORAGE_BUCKET      |               |
| NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID |               |
| NEXT_PUBLIC_FCM_APP_ID              |               |
| NEXT_PUBLIC_FCM_MEASUREMENT_ID      |               |
| FCM_KEY_PAIR                        |               |
| FCM_WEB_API_KEY                     |               |
| S3_URL                              |               |
| NEXT_PUBLIC_DEVISE                  |               |
| NEXT_PUBLIC_COUNTRY                 |               |
| SENTRY_DSN                          |               |
| NEXT_PUBLIC_SENTRY_DSN              |               |
| SENTRY_IGNORE_API_RESOLUTION_ERROR  |               |
| NEXT_PUBLIC_EDITOR_KEY              |               |
| MAINTENANCE_MODE                    |               |

## API

- [useRequestQuery](#userequestrequest-config)
- [useRequestQueryMutation](#userequestmutationrequest-config)

### useRequestQuery(request, config)

The main React hook to execute HTTP requests with [REACT QUERY](https://tanstack.com/query/latest/docs/react/overview)
and [Axios](https://github.com/axios/axios).

- `request` - The axios request [config](https://github.com/axios/axios#request-config) object, the same argument
  accepted by `axios`.
- `config` - An options object for [REACT QUERY](https://tanstack.com/query/latest/docs/react/reference/useQuery)
  configuration.
   <ul>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">queryKey: unknown[]</code>
        <ul>
            <li><strong>Required</strong></li>
            <li>The query key to use for this query.</li>
            <li>The query key will be hashed into a stable hash. See <a href="/query/latest/docs/react/guides/query-keys">Query Keys</a> for more information.</li>
            <li>
                The query will automatically update when this key changes (as long as <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">enabled</code> is not set to
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">false</code>).
            </li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">queryFn: (context: QueryFunctionContext) =&gt; Promise&lt;TData&gt;</code>
        <ul>
            <li><strong>Required, but only if no default query function has been defined</strong> See <a href="/query/latest/docs/react/guides/default-query-function">Default Query Function</a> for more information.</li>
            <li>The function that the query will use to request data.</li>
            <li>Receives a <a href="/query/latest/docs/react/guides/query-functions#queryfunctioncontext">QueryFunctionContext</a></li>
            <li>Must return a promise that will either resolve data or throw an error. The data cannot be <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">undefined</code>.</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">enabled: boolean</code>
        <ul>
            <li>Set this to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">false</code> to disable this query from automatically running.</li>
            <li>Can be used for <a href="/query/latest/docs/react/guides/dependent-queries">Dependent Queries</a>.</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">networkMode: 'online' | 'always' | 'offlineFirst</code>
        <ul>
            <li>optional</li>
            <li>defaults to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">'online'</code></li>
            <li>see <a href="/query/latest/docs/react/guides/network-mode">Network Mode</a> for more information.</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">retry: boolean | number | (failureCount: number, error: TError) =&gt; boolean</code>
        <ul>
            <li>If <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">false</code>, failed queries will not retry by default.</li>
            <li>If <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code>, failed queries will retry infinitely.</li>
            <li>
                If set to a <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">number</code>, e.g.
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">3</code>, failed queries will retry until the failed query count meets that number.
            </li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">retryOnMount: boolean</code>
        <ul>
            <li>
                If set to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">false</code>, the query will not be retried on mount if it contains an error. Defaults to
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code>.
            </li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">retryDelay: number | (retryAttempt: number, error: TError) =&gt; number</code>
        <ul>
            <li>
                This function receives a <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">retryAttempt</code> integer and the actual Error and returns the delay to apply before the next attempt in
                milliseconds.
            </li>
            <li>
                A function like <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">attempt =&gt; Math.min(attempt &gt; 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)</code> applies exponential backoff.
            </li>
            <li>A function like <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">attempt =&gt; attempt * 1000</code> applies linear backoff.</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">staleTime: number | Infinity</code>
        <ul>
            <li>Optional</li>
            <li>Defaults to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">0</code></li>
            <li>The time in milliseconds after data is considered stale. This value only applies to the hook it is defined on.</li>
            <li>If set to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">Infinity</code>, the data will never be considered stale</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">cacheTime: number | Infinity</code>
        <ul>
            <li>
                Defaults to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">5 * 60 * 1000</code> (5 minutes) or
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">Infinity</code> during SSR
            </li>
            <li>
                The time in milliseconds that unused/inactive cache data remains in memory. When a query's cache becomes unused or inactive, that cache data will be garbage collected after this duration. When different cache times are
                specified, the longest one will be used.
            </li>
            <li>If set to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">Infinity</code>, will disable garbage collection</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">queryKeyHashFn: (queryKey: QueryKey) =&gt; string</code>
        <ul>
            <li>Optional</li>
            <li>If specified, this function is used to hash the <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">queryKey</code> to a string.</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">refetchInterval: number | false | ((data: TData | undefined, query: Query) =&gt; number | false)</code>
        <ul>
            <li>Optional</li>
            <li>If set to a number, all queries will continuously refetch at this frequency in milliseconds</li>
            <li>If set to a function, the function will be executed with the latest data and query to compute a frequency</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">refetchIntervalInBackground: boolean</code>
        <ul>
            <li>Optional</li>
            <li>
                If set to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code>, queries that are set to continuously refetch with a
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">refetchInterval</code> will continue to refetch while their tab/window is in the background
            </li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">refetchOnMount: boolean | "always" | ((query: Query) =&gt; boolean | "always")</code>
        <ul>
            <li>Optional</li>
            <li>Defaults to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code></li>
            <li>If set to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code>, the query will refetch on mount if the data is stale.</li>
            <li>If set to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">false</code>, the query will not refetch on mount.</li>
            <li>If set to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">"always"</code>, the query will always refetch on mount.</li>
            <li>If set to a function, the function will be executed with the query to compute the value</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">refetchOnWindowFocus: boolean | "always" | ((query: Query) =&gt; boolean | "always")</code>
        <ul>
            <li>Optional</li>
            <li>Defaults to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code></li>
            <li>If set to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code>, the query will refetch on window focus if the data is stale.</li>
            <li>If set to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">false</code>, the query will not refetch on window focus.</li>
            <li>If set to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">"always"</code>, the query will always refetch on window focus.</li>
            <li>If set to a function, the function will be executed with the query to compute the value</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">refetchOnReconnect: boolean | "always" | ((query: Query) =&gt; boolean | "always")</code>
        <ul>
            <li>Optional</li>
            <li>Defaults to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code></li>
            <li>If set to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code>, the query will refetch on reconnect if the data is stale.</li>
            <li>If set to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">false</code>, the query will not refetch on reconnect.</li>
            <li>If set to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">"always"</code>, the query will always refetch on reconnect.</li>
            <li>If set to a function, the function will be executed with the query to compute the value</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">notifyOnChangeProps: string[] | "all" | (() =&gt; string[] | "all")</code>
        <ul>
            <li>Optional</li>
            <li>If set, the component will only re-render if any of the listed properties change.</li>
            <li>
                If set to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">['data', 'error']</code> for example, the component will only re-render when the
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">data</code> or <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">error</code> properties
                change.
            </li>
            <li>If set to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">"all"</code>, the component will opt-out of smart tracking and re-render whenever a query is updated.</li>
            <li>If set to a function, the function will be executed to compute the list of properties.</li>
            <li>By default, access to properties will be tracked, and the component will only re-render when one of the tracked properties change.</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">onSuccess: (data: TData) =&gt; void</code>
        <ul>
            <li><strong>Deprecated</strong> - this callback will be removed in the next major version</li>
            <li>Optional</li>
            <li>This function will fire any time the query successfully fetches new data.</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">onError: (error: TError) =&gt; void</code>
        <ul>
            <li><strong>Deprecated</strong> - this callback will be removed in the next major version</li>
            <li>Optional</li>
            <li>This function will fire if the query encounters an error and will be passed the error.</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">onSettled: (data?: TData, error?: TError) =&gt; void</code>
        <ul>
            <li><strong>Deprecated</strong> - this callback will be removed in the next major version</li>
            <li>Optional</li>
            <li>This function will fire any time the query is either successfully fetched or errors and be passed either the data or error.</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">select: (data: TData) =&gt; unknown</code>
        <ul>
            <li>Optional</li>
            <li>
                This option can be used to transform or select a part of the data returned by the query function. It affects the returned
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">data</code> value, but does not affect what gets stored in the query cache.
            </li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">suspense: boolean</code>
        <ul>
            <li>Optional</li>
            <li>Set this to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code> to enable suspense mode.</li>
            <li>
                When <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code>, <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">useQuery</code> will
                suspend when <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">status === 'loading'</code>
            </li>
            <li>
                When <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code>, <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">useQuery</code> will
                throw runtime errors when <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">status === 'error'</code>
            </li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">initialData: TData | () =&gt; TData</code>
        <ul>
            <li>Optional</li>
            <li>If set, this value will be used as the initial data for the query cache (as long as the query hasn't been created or cached yet)</li>
            <li>If set to a function, the function will be called <strong>once</strong> during the shared/root query initialization, and be expected to synchronously return the initialData</li>
            <li>Initial data is considered stale by default unless a <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">staleTime</code> has been set.</li>
            <li><code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">initialData</code> <strong>is persisted</strong> to the cache</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">initialDataUpdatedAt: number | (() =&gt; number | undefined)</code>
        <ul>
            <li>Optional</li>
            <li>If set, this value will be used as the time (in milliseconds) of when the <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">initialData</code> itself was last updated.</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">placeholderData: TData | () =&gt; TData</code>
        <ul>
            <li>Optional</li>
            <li>
                If set, this value will be used as the placeholder data for this particular query observer while the query is still in the
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">loading</code> data and no initialData has been provided.
            </li>
            <li><code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">placeholderData</code> is <strong>not persisted</strong> to the cache</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">keepPreviousData: boolean</code>
        <ul>
            <li>Optional</li>
            <li>Defaults to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">false</code></li>
            <li>If set, any previous <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">data</code> will be kept when fetching new data because the query key changed.</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isDataEqual: (oldData: TData | undefined, newData: TData) =&gt; boolean</code>
        <ul>
            <li>
                <strong>Deprecated</strong>. You can achieve the same functionality by passing a function to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">structuralSharing</code> instead:
                <ul>
                    <li>structuralSharing: (oldData, newData) =&gt; isDataEqual(oldData, newData) ? oldData : replaceEqualDeep(oldData, newData)</li>
                </ul>
            </li>
            <li>Optional</li>
            <li>
                This function should return boolean indicating whether to use previous <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">data</code> (
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code>) or new data (
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">false</code>) as a resolved data for the query.
            </li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">structuralSharing: boolean | ((oldData: TData | undefined, newData: TData) =&gt; TData)</code>
        <ul>
            <li>Optional</li>
            <li>Defaults to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code></li>
            <li>If set to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">false</code>, structural sharing between query results will be disabled.</li>
            <li>
                If set to a function, the old and new data values will be passed through this function, which should combine them into resolved data for the query. This way, you can retain references from the old data to improve performance
                even when that data contains non-serializable values.
            </li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">useErrorBoundary: undefined | boolean | (error: TError, query: Query) =&gt; boolean</code>
        <ul>
            <li>
                Defaults to the global query config's <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">useErrorBoundary</code> value, which is
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">undefined</code>
            </li>
            <li>Set this to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code> if you want errors to be thrown in the render phase and propagate to the nearest error boundary</li>
            <li>
                Set this to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">false</code> to disable
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">suspense</code>'s default behavior of throwing errors to the error boundary.
            </li>
            <li>
                If set to a function, it will be passed the error and the query, and it should return a boolean indicating whether to show the error in an error boundary (
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code>) or return the error as state (
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">false</code>)
            </li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">meta: Record&lt;string, unknown&gt;</code>
        <ul>
            <li>Optional</li>
            <li>
                If set, stores additional information on the query cache entry that can be used as needed. It will be accessible wherever the
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">query</code> is available, and is also part of the
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">QueryFunctionContext</code> provided to the
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">queryFn</code>.
            </li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">context?: React.Context&lt;QueryClient | undefined&gt;</code>
        <ul>
            <li>Use this to use a custom React Query context. Otherwise, <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">defaultContext</code> will be used.</li>
        </ul>
    </li>

</ul>


**Returns**
   <ul>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">status: String</code>
          <ul>
              <li>
                  Will be:
                  <ul>
                      <li><code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">loading</code> if there's no cached data and no query attempt was finished yet.</li>
                      <li>
                          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">error</code> if the query attempt resulted in an error. The corresponding
                          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">error</code> property has the error received from the attempted fetch
                      </li>
                      <li>
                          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">success</code> if the query has received a response with no errors and is ready to display its data. The corresponding
                          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">data</code> property on the query is the data received from the successful fetch or if the query's
                          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">enabled</code> property is set to
                          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">false</code> and has not been fetched yet
                          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">data</code> is the first
                          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">initialData</code> supplied to the query on initialization.
                      </li>
                  </ul>
              </li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isLoading: boolean</code>
          <ul>
              <li>A derived boolean from the <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">status</code> variable above, provided for convenience.</li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isSuccess: boolean</code>
          <ul>
              <li>A derived boolean from the <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">status</code> variable above, provided for convenience.</li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isError: boolean</code>
          <ul>
              <li>A derived boolean from the <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">status</code> variable above, provided for convenience.</li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isLoadingError: boolean</code>
          <ul>
              <li>Will be <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code> if the query failed while fetching for the first time.</li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isRefetchError: boolean</code>
          <ul>
              <li>Will be <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code> if the query failed while refetching.</li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">data: TData</code>
          <ul>
              <li>Defaults to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">undefined</code>.</li>
              <li>The last successfully resolved data for the query.</li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">dataUpdatedAt: number</code>
          <ul>
              <li>
                  The timestamp for when the query most recently returned the <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">status</code> as
                  <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">"success"</code>.
              </li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">error: null | TError</code>
          <ul>
              <li>Defaults to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">null</code></li>
              <li>The error object for the query, if an error was thrown.</li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">errorUpdatedAt: number</code>
          <ul>
              <li>
                  The timestamp for when the query most recently returned the <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">status</code> as
                  <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">"error"</code>.
              </li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isStale: boolean</code>
          <ul>
              <li>
                  Will be <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code> if the data in the cache is invalidated or if the data is older than the given
                  <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">staleTime</code>.
              </li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isPlaceholderData: boolean</code>
          <ul>
              <li>Will be <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code> if the data shown is the placeholder data.</li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isPreviousData: boolean</code>
          <ul>
              <li>
                  Will be <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code> when
                  <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">keepPreviousData</code> is set and data from the previous query is returned.
              </li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isFetched: boolean</code>
          <ul>
              <li>Will be <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code> if the query has been fetched.</li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isFetchedAfterMount: boolean</code>
          <ul>
              <li>Will be <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code> if the query has been fetched after the component mounted.</li>
              <li>This property can be used to not show any previously cached data.</li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">fetchStatus: FetchStatus</code>
          <ul>
              <li>
                  <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">fetching</code>: Is
                  <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code> whenever the queryFn is executing, which includes initial
                  <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">loading</code> as well as background refetches.
              </li>
              <li>
                  <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">paused</code>: The query wanted to fetch, but has been
                  <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">paused</code>.
              </li>
              <li><code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">idle</code>: The query is not fetching.</li>
              <li>see <a href="/query/latest/docs/react/guides/network-mode">Network Mode</a> for more information.</li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isFetching: boolean</code>
          <ul>
              <li>A derived boolean from the <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">fetchStatus</code> variable above, provided for convenience.</li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isPaused: boolean</code>
          <ul>
              <li>A derived boolean from the <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">fetchStatus</code> variable above, provided for convenience.</li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isRefetching: boolean</code>
          <ul>
              <li>
                  Is <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code> whenever a background refetch is in-flight, which <em>does not</em> include initial
                  <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">loading</code>
              </li>
              <li>Is the same as <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isFetching &amp;&amp; !isLoading</code></li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isInitialLoading: boolean</code>
          <ul>
              <li>Is <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code> whenever the first fetch for a query is in-flight</li>
              <li>Is the same as <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isFetching &amp;&amp; isLoading</code></li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">failureCount: number</code>
          <ul>
              <li>The failure count for the query.</li>
              <li>Incremented every time the query fails.</li>
              <li>Reset to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">0</code> when the query succeeds.</li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">failureReason: null | TError</code>
          <ul>
              <li>The failure reason for the query retry.</li>
              <li>Reset to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">null</code> when the query succeeds.</li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">errorUpdateCount: number</code>
          <ul>
              <li>The sum of all errors.</li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">refetch: (options: { throwOnError: boolean, cancelRefetch: boolean }) =&gt; Promise&lt;UseQueryResult&gt;</code>
          <ul>
              <li>A function to manually refetch the query.</li>
              <li>
                  If the query errors, the error will only be logged. If you want an error to be thrown, pass the <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">throwOnError: true</code> option
              </li>
              <li>
                  <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">cancelRefetch?: boolean</code>
                  <ul>
                      <li>
                          Defaults to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code>
                          <ul>
                              <li>Per default, a currently running request will be cancelled before a new request is made</li>
                          </ul>
                      </li>
                      <li>When set to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">false</code>, no refetch will be made if there is already a request running.</li>
                  </ul>
              </li>
          </ul>
      </li>
      <li>
          <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">remove: () =&gt; void</code>
          <ul>
              <li>A function to remove the query from the cache.</li>
          </ul>
      </li>
  </ul>

### Quick Start

```ts
    import {useRequestQuery} from "@lib/axios";
    
    const {data: httpRequestResponse, isLoading, mutate: mutateRequest} = useRequestQuery({
        method: "GET",
        url: `${url}`,
        ...
      },{
        ...ReactQueryNoValidateConfig,
        variables: {query : "...params"}
      });
```

### useRequestQueryMutation(request, config)

The React hook to execute HTTP requests for
remote [mutations](https://tanstack.com/query/latest/docs/react/reference/useMutation).

- `request` - The axios request [config](https://github.com/axios/axios#request-config) object, the same argument
  accepted by `axios`.
- `config` - An options object for [REACT QUERY](https://tanstack.com/query/latest/docs/react/reference/useMutation)
  configuration.
    <ul>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">mutationFn: (variables: TVariables) =&gt; Promise&lt;TData&gt;</code>
        <ul>
            <li><strong>Required, but only if no default mutation function has been defined</strong></li>
            <li>A function that performs an asynchronous task and returns a promise.</li>
            <li>
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">variables</code> is an object that
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">mutate</code> will pass to your
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">mutationFn</code>
            </li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">cacheTime: number | Infinity</code>
        <ul>
            <li>
                The time in milliseconds that unused/inactive cache data remains in memory. When a mutation's cache becomes unused or inactive, that cache data will be garbage collected after this duration. When different cache times are
                specified, the longest one will be used.
            </li>
            <li>If set to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">Infinity</code>, will disable garbage collection</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">mutationKey: unknown[]</code>
        <ul>
            <li>Optional</li>
            <li>A mutation key can be set to inherit defaults set with <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">queryClient.setMutationDefaults</code>.</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">networkMode: 'online' | 'always' | 'offlineFirst</code>
        <ul>
            <li>optional</li>
            <li>defaults to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">'online'</code></li>
            <li>see <a href="/query/latest/docs/react/guides/network-mode">Network Mode</a> for more information.</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">onMutate: (variables: TVariables) =&gt; Promise&lt;TContext | void&gt; | TContext | void</code>
        <ul>
            <li>Optional</li>
            <li>This function will fire before the mutation function is fired and is passed the same variables the mutation function would receive</li>
            <li>Useful to perform optimistic updates to a resource in hopes that the mutation succeeds</li>
            <li>
                The value returned from this function will be passed to both the <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">onError</code> and
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">onSettled</code> functions in the event of a mutation failure and can be useful for rolling back optimistic updates.
            </li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">onSuccess: (data: TData, variables: TVariables, context?: TContext) =&gt; Promise&lt;unknown&gt; | unknown</code>
        <ul>
            <li>Optional</li>
            <li>This function will fire when the mutation is successful and will be passed the mutation's result.</li>
            <li>If a promise is returned, it will be awaited and resolved before proceeding</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">onError: (err: TError, variables: TVariables, context?: TContext) =&gt; Promise&lt;unknown&gt; | unknown</code>
        <ul>
            <li>Optional</li>
            <li>This function will fire if the mutation encounters an error and will be passed the error.</li>
            <li>If a promise is returned, it will be awaited and resolved before proceeding</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">onSettled: (data: TData, error: TError, variables: TVariables, context?: TContext) =&gt; Promise&lt;unknown&gt; | unknown</code>
        <ul>
            <li>Optional</li>
            <li>This function will fire when the mutation is either successfully fetched or encounters an error and be passed either the data or error</li>
            <li>If a promise is returned, it will be awaited and resolved before proceeding</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">retry: boolean | number | (failureCount: number, error: TError) =&gt; boolean</code>
        <ul>
            <li>Defaults to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">0</code>.</li>
            <li>If <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">false</code>, failed mutations will not retry.</li>
            <li>If <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code>, failed mutations will retry infinitely.</li>
            <li>
                If set to an <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">number</code>, e.g.
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">3</code>, failed mutations will retry until the failed mutations count meets that number.
            </li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">retryDelay: number | (retryAttempt: number, error: TError) =&gt; number</code>
        <ul>
            <li>
                This function receives a <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">retryAttempt</code> integer and the actual Error and returns the delay to apply before the next attempt in
                milliseconds.
            </li>
            <li>
                A function like <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">attempt =&gt; Math.min(attempt &gt; 1 ? 2 ** attempt * 1000 : 1000, 30 * 1000)</code> applies exponential backoff.
            </li>
            <li>A function like <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">attempt =&gt; attempt * 1000</code> applies linear backoff.</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">useErrorBoundary: undefined | boolean | (error: TError) =&gt; boolean</code>
        <ul>
            <li>
                Defaults to the global query config's <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">useErrorBoundary</code> value, which is
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">undefined</code>
            </li>
            <li>
                Set this to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code> if you want mutation errors to be thrown in the render phase and propagate to the nearest error boundary
            </li>
            <li>Set this to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">false</code> to disable the behavior of throwing errors to the error boundary.</li>
            <li>
                If set to a function, it will be passed the error and should return a boolean indicating whether to show the error in an error boundary (
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code>) or return the error as state (
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">false</code>)
            </li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">meta: Record&lt;string, unknown&gt;</code>
        <ul>
            <li>Optional</li>
            <li>
                If set, stores additional information on the mutation cache entry that can be used as needed. It will be accessible wherever the
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">mutation</code> is available (eg.
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">onError</code>,
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">onSuccess</code> functions of the
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">MutationCache</code>).
            </li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">context?: React.Context&lt;QueryClient | undefined&gt;</code>
        <ul>
            <li>Use this to use a custom React Query context. Otherwise, <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">defaultContext</code> will be used.</li>
        </ul>
    </li>

</ul>


**Returns**
<ul>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">mutate: (variables: TVariables, { onSuccess, onSettled, onError }) =&gt; void</code>
        <ul>
            <li>The mutation function you can call with variables to trigger the mutation and optionally hooks on additional callback options.</li>
            <li>
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">variables: TVariables</code>
                <ul>
                    <li>Optional</li>
                    <li>The variables object to pass to the <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">mutationFn</code>.</li>
                </ul>
            </li>
            <li>
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">onSuccess: (data: TData, variables: TVariables, context: TContext) =&gt; void</code>
                <ul>
                    <li>Optional</li>
                    <li>This function will fire when the mutation is successful and will be passed the mutation's result.</li>
                    <li>Void function, the returned value will be ignored</li>
                </ul>
            </li>
            <li>
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">onError: (err: TError, variables: TVariables, context: TContext | undefined) =&gt; void</code>
                <ul>
                    <li>Optional</li>
                    <li>This function will fire if the mutation encounters an error and will be passed the error.</li>
                    <li>Void function, the returned value will be ignored</li>
                </ul>
            </li>
            <li>
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">onSettled: (data: TData | undefined, error: TError | null, variables: TVariables, context: TContext | undefined) =&gt; void</code>
                <ul>
                    <li>Optional</li>
                    <li>This function will fire when the mutation is either successfully fetched or encounters an error and be passed either the data or error</li>
                    <li>Void function, the returned value will be ignored</li>
                </ul>
            </li>
            <li>If you make multiple requests, <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">onSuccess</code> will fire only after the latest call you've made.</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">mutateAsync: (variables: TVariables, { onSuccess, onSettled, onError }) =&gt; Promise&lt;TData&gt;</code>
        <ul>
            <li>Similar to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">mutate</code> but returns a promise which can be awaited.</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">status: string</code>
        <ul>
            <li>
                Will be:
                <ul>
                    <li><code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">idle</code> initial status prior to the mutation function executing.</li>
                    <li><code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">loading</code> if the mutation is currently executing.</li>
                    <li><code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">error</code> if the last mutation attempt resulted in an error.</li>
                    <li><code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">success</code> if the last mutation attempt was successful.</li>
                </ul>
            </li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isIdle</code>, <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isLoading</code>,
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isSuccess</code>, <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isError</code>: boolean
        variables derived from <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">status</code>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">isPaused: boolean</code>
        <ul>
            <li>
                will be <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">true</code> if the mutation has been
                <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">paused</code>
            </li>
            <li>see <a href="/query/latest/docs/react/guides/network-mode">Network Mode</a> for more information.</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">data: undefined | unknown</code>
        <ul>
            <li>Defaults to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">undefined</code></li>
            <li>The last successfully resolved data for the query.</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">error: null | TError</code>
        <ul>
            <li>The error object for the query, if an error was encountered.</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">reset: () =&gt; void</code>
        <ul>
            <li>A function to clean the mutation internal state (i.e., it resets the mutation to its initial state).</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">failureCount: number</code>
        <ul>
            <li>The failure count for the mutation.</li>
            <li>Incremented every time the mutation fails.</li>
            <li>Reset to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">0</code> when the mutation succeeds.</li>
        </ul>
    </li>
    <li>
        <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">failureReason: null | TError</code>
        <ul>
            <li>The failure reason for the mutation retry.</li>
            <li>Reset to <code class="border border-gray-500 border-opacity-20 bg-gray-500 bg-opacity-10 rounded p-1">null</code> when the mutation succeeds.</li>
        </ul>
    </li>
</ul>

### Quick Start

```ts
    import {useRequestQueryMutation} from "@lib/axios";

    const {trigger: triggerRequet} = useRequestQueryMutation(mutationKey);

    triggerRequet({
      method: "GET",
      url: `${url}`,
      ....
    },{
      onSuccess: () => ...,
      onError: () => ...,
      onSettled: () => ...
    });
```
