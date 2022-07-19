export const siteHeader = {
    topBar: [
        {
            icon: "ic-video-contour",
            notifications: 2,
            name: "video-contour",
        },
        {
            icon: "ic-notif-lite",
            notifications: 5,
            name: "notif-lite",
        }
    ],
    sidebarItems: [
        {
            icon: "ic-agenda",
            name: "agenda",
            href: '/dashboard/agenda',
        },
        {
            icon: "ic-salle-sidenav",
            name: "room",
            href: '/dashboard/waiting-room',
        },
        {
            icon: "ic-user2",
            name: "patient",
            href: '/dashboard/patient',
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
        {
            icon: "ic-questions-lite",
            name: "questions",
            href: '/dashboard/questions',
        },
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
