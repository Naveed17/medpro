import {PrecacheController, PrecacheEntry} from "@serwist/precaching";
import {Serwist} from "@serwist/sw";
import {defaultCache, PAGES_CACHE_NAME} from "@serwist/next/worker";

declare const self: ServiceWorkerGlobalScope & {
    // Change this attribute's name to your `injectionPoint`.
    // `injectionPoint` is an InjectManifest option.
    // See https://serwist.pages.dev/docs/build/inject-manifest/configuring
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

const serwist = new Serwist({
    precacheController: new PrecacheController({
        concurrentPrecaching: 10,
    }),
});

serwist.install({
    precacheEntries: self.__SW_MANIFEST,
    cleanupOutdatedCaches: true,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: false,
    disableDevLogs: true,
    runtimeCaching: defaultCache
});
