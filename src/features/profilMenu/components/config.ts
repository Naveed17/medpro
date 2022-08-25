const Config = [
    {
        name: 'News',
        icon: 'ic-magazine',
        path: '/',
    },
    {
        name: 'Messages',
        icon: 'ic-message',
        path: '/',
    },
    {
        name: 'Questions',
        icon: 'ic-question',
        path: '/',
    },
    {
        name: 'Articles',
        icon: 'ic-edit-file',
        path: '/',
    },
    {
        name: 'Wallet',
        icon: 'ic-card',
        path: '/',
    },
    {
        name: 'Statistics',
        icon: 'ic-statiqtique',
        path: '/',
    },
    {
        name: 'Settings',
        icon: 'ic-doctor-h-setting',
        path: '/',
    },
    {
        name: 'Switch-agenda',
        icon: 'ic-refrech',
        path: '/',
        items: [
            {
                name: 'Clinique',
                icon: 'ic-statiqtique',
                path: '/',
            },
            {
                name: 'Hopital',
                icon: 'ic-doctor-h-setting',
                path: '/',
            },
            {
                name: 'Ajouter un agenda',
                icon: 'ic-plus',
                path: '/',
            },
        ]
    },
    {
        name: 'Logout',
        icon: 'ic-deconnexion',
        path: '/',
        action: 'logout',
    },

]

export default Config
