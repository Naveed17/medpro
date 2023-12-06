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
            badge: 0,
            enabled: true
        },
        {
            icon: "ic-salle-sidenav",
            name: "room",
            href: '/dashboard/waiting-room',
            badge: 0,
            enabled: true
        },
        {
            icon: "ic-user2",
            name: "patient",
            href: '/dashboard/patient',
            enabled: true
        },
        {
            icon: "ic-payment",
            name: "payment",
            href: '/dashboard/payment',
            enabled: true
        },
        {
            icon: "ic-docs",
            name: "docs",
            href: '/dashboard/documents',
            enabled: true
        },
        {
            icon: "shopping-bag",
            name: "inventory",
            href: '/dashboard/inventory',
            enabled: process.env.NODE_ENV === 'development'
        }
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
        //     icon: "ic-portfeuille",
        //     name: "wallet",
        //     href: '',
        // }
    ],
};

export default siteHeader;
