export function clearBrowserCache() {
    // Clearing the session storage
    sessionStorage.clear();
    // Clearing the browser storage
    localStorage.clear();
    // Clearing the browser cache
    caches.keys().then((keyList) => Promise.all(keyList.map((key) => caches.delete(key))));
}
