export const siteHeader = {
    topBar: [
        {
            icon: "ic-notif-lite",
            notifications: 0,
            name: "notif-lite",
            action: "notification"
        }
    ],
    sidebarItems: [
        {
            icon: "ic-agenda",
            name: "agenda",
            href: '/dashboard/agenda',
            badge: 0
        },
        {
            icon: "ic-salle-sidenav",
            name: "room",
            href: '/dashboard/waiting-room',
            badge: 0
        },
        {
            icon: "ic-user2",
            name: "patient",
            href: '/dashboard/patient'
        },
        {
            icon: "ic-payment",
            name: "payment",
            href: '/dashboard/payment'
        },
        // {
        //     icon: "ic-messanger-lite",
        //     name: "message",
        //     href: '#',
        // },
        // {
        //     icon: "ic-edit-file",
        //     name: "articles",
        //     href: '#',
        // },
        // {
        //     icon: "ic-questions-lite",
        //     name: "questions",
        //     href: '/dashboard/questions',
        // },
        // {
        //     icon: "shopping-bag",
        //     name: "shop",
        //     href: '#',
        // },
        // {
        //     icon: "ic-portfeuille",
        //     name: "wallet",
        //     href: '',
        // }
    ],
};

export default siteHeader;
