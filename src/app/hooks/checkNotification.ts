export const checkNotification = () => {
    console.log("checkNotification", Notification.permission);
    if (!("Notification" in window)) {
        // Check if the browser supports notifications
        console.log("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        // Check whether notification permissions have already been granted;
        // if so, create a notification
        console.log("permission granted");
    } else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                console.log("requestPermission granted");
            }
        });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
    return Notification?.permission;
};
