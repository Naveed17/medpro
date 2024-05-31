export const isAppleDevise = (OS?: string) => {
    if (typeof window === `undefined` || typeof navigator === `undefined`) return false;

    const appleMacOSDevicesArray = ['MacIntel', 'MacPPC', 'Mac68K', 'Macintosh'];
    const appleIOSDevicesArray = ['iPhone', 'iPod', 'iPad', 'iPhone Simulator', 'iPod Simulator', 'iPad Simulator', 'Pikev7.6 release 92', 'Pike v7.8 release 517'];

    return [...(!!OS ? appleMacOSDevicesArray : appleIOSDevicesArray)].some(rx => new RegExp(rx, 'i').test(navigator.platform || navigator.userAgent || navigator.vendor || ((window as any).opera && (window as any).opera.toString() === `[object Opera]`)));
};
