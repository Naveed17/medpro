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
        if (checkNotificationPromise()) {
            Notification.requestPermission().then(handlePermission);
        } else {
            Notification.requestPermission(handlePermission);
        }
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
    return Notification?.permission;
}

// Check whether browser supports the promise version of requestPermission()
// Safari only supports the old callback-based version
const checkNotificationPromise = () => {
    try {
        Notification.requestPermission().then();
    } catch (e) {
        return false;
    }

    return true;
}
