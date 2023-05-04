export const isAppleDevise = () => {
    if (typeof window === `undefined` || typeof navigator === `undefined`) return false;

    return /iPhone/i.test(navigator.userAgent || navigator.vendor || ((window as any).opera && (window as any).opera.toString() === `[object Opera]`));
};
