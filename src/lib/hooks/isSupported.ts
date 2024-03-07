export const isSupported = () => 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
