export const checkNotification = () => {
    // Function to actually ask the permissions
    const handlePermission = (permission: any) => {
        // Whatever the user answers, we make sure Chrome stores the information
        if (!Reflect.has(Notification, 'permission')) {
            (Notification.permission as any) = permission;
        }
    }

    // Check if the browser supports notifications
    if (!Reflect.has(window, 'Notification')) {
        console.log('This browser does not support notifications.');
    } else {
        new Promise((resolve, reject) => {
            Notification.requestPermission().then(() => resolve(true));
        }).catch(() => {
            Notification.requestPermission(handlePermission);
        }).then(() => {
            Notification.requestPermission().then(handlePermission);
        });

    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
    return Notification?.permission;
}
