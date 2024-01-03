const Config = [
    /*    {
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
        },*/
    {
        name: 'Settings',
        icon: 'ic-setting',
        path: '/dashboard/settings/profil',
        action: 'profile'
    },
    {
        name: 'switch-account',
        icon: 'ic-refresh',
        path: '/dashboard',
        action: 'switch-medical-entity'
    },
    {
        name: 'Logout',
        icon: 'ic-deconnexion',
        path: '/',
        action: 'logout'
    },

]

export default Config
