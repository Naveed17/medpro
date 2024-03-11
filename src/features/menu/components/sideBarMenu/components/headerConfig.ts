export const siteHeader = {
    topBar: [
        {
            icon: "ic-notification-lite",
            notifications: 0,
            name: "notif-lite",
            action: "notification"
        }
    ],
    adminSidebarItems: [
        {
            icon: "ic-doctors",
            name: "doctors",
            href: '/admin/doctors',
            badge: 0,
            enabled: true
        },
        {
            icon: "ic-staff",
            name: "staff",
            href: '/admin/staff',
            badge: 0,
            enabled: true
        },
        {
            icon: "ic-departments",
            name: "departments",
            href: '/admin/departments',
            badge: 0,
            enabled: true
        }
    ],
    sidebarItems: [
        {
            icon: "ic-dashboard",
            name: "dashboard",
            href: '/dashboard',
            badge: 0,
            enabled: true
        },
         {
            icon: "ic-agenda",
            name: "agenda",
            href: '/dashboard/agenda',
            badge: 0,
            enabled: true
        },
        {
            icon: "ic-salle-sidenav",
            name: "waiting-room",
            href: '/dashboard/waiting-room',
            badge: 0,
            enabled: true
        },
        {
            icon: "ic-user2",
            name: "patient",
            href: '/dashboard/patients',
            enabled: true
        },
        {
            icon: "ic-payment",
            name: "cashbox",
            href: '/dashboard/payment',
            enabled: true
        },
        {
            icon: "ic-docs",
            name: "documents",
            href: '/dashboard/documents',
            enabled: process.env.NODE_ENV === 'development'
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
