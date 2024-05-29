const settingsData = {
    title: "parameters",
    admin: [
        {
            name: "profile",
            icon: "setting/ic-patient",
            href: '/admin/settings/profile',
            disable: false
        },
        /*         {
                    name: "users",
                    icon: "setting/ic-users",
                    href: '/admin/settings/users',
                    disable: false
                },*/
        {
            name: "billing",
            icon: "setting/ic-banknote",
            href: '/admin/settings/billing',
            disable: false
        }
    ],
    dashboard: [
        {
            name: 'general',
            icon: 'ic-outline-setting',
            href: '/dashboard/settings/general',
            disable: false,
            submenu: [
                {
                    name: 'profile',
                    feature: 'profile',
                    disable: false
                },
                {
                    name: "users",
                    feature: 'users',
                    disable: false
                }
                // {
                //     name: "plan_billing",
                //     disable: false
                // },
                // {
                //     name: "preferences",
                //     disable: false
                // }
            ]
        },
        {
            name: 'schedule-and-location',
            icon: 'ic-outline-location-time',
            href: '/dashboard/settings/schedule-and-location',
            disable: false,
            submenu: [
                {
                    name: 'location',
                    feature: 'places',
                    disable: false
                },
                {
                    name: 'leave_and_absence',
                    feature: 'holidays',
                    disable: false
                }
                // {
                //     name: 'time_off_types',
                //     disable: false
                // }

            ]
        },
        {
            name: 'consultation',
            icon: 'ic-outline-stethoscope',
            href: '/dashboard/settings/consultation',
            disable: false,
            submenu: [
                {
                    name: "actfees",
                    feature: 'holidays',
                    disable: false
                },
                {
                    name: "insurance_agreement",
                    feature: 'insurance-agreement',
                    disable: false
                },
                {
                    name: "motifs",
                    feature: 'motif',
                    disable: false
                },
                {
                    name: "sheets",
                    feature: 'patient-file-templates',
                    disable: false
                },
                {
                    name: "types",
                    feature: 'consultation-type',
                    disable: false
                },
                {
                    name: "drugs",
                    feature: 'drugs',
                    disable: false
                },
                {
                    name: "analysis",
                    feature: 'analysis',
                    disable: false
                },
                {
                    name: "medical_imaging",
                    feature: 'medical-imaging',
                    disable: false
                }
            ]
        },
        // {
        //     name: "profile",
        //     icon: "setting/ic-patient",
        //     href: '/dashboard/settings/profile',
        //     disable: false
        // },
        // {
        //     name: "horaire",
        //     deep: "location",
        //     icon: "setting/ic-times",
        //     href: "/dashboard/settings/places/[uuid]",
        //     disable: false
        // },
        // {
        //     name: "acts",
        //     icon: "ic-generaliste",
        //     href: "/dashboard/settings/acts",
        //     disable: true
        // },
        // {
        //     name: "actfees",
        //     icon: "setting/ic-caisse",
        //     href: "/dashboard/settings/actfees",
        //     disable: false
        // },
        // {
        //     name: "motif",
        //     icon: "setting/ic-motifs",
        //     href: "/dashboard/settings/motif",
        //     disable: false
        // },
        // {
        //     name: "consultation",
        //     icon: "setting/ic-fiche",
        //     href: "/dashboard/settings/patient-file-templates",
        //     disable: false
        // },
        // {
        //     name: "lieu",
        //     icon: "setting/ic-pin",
        //     href: "/dashboard/settings/places",
        //     disable: true
        // },
        {
            name: "configdoc",
            icon: "setting/ic-document",
            href: "/dashboard/settings/templates",
            disable: false,
            submenu: []
        },
        // {
        //     name: "type",
        //     icon: "setting/ic-reasons",
        //     href: "/dashboard/settings/consultation-type",
        //     disable: false
        // },
        // {
        //     name: "drugs",
        //     icon: "docs/ic-prescription",
        //     href: "/dashboard/settings/drugs",
        //     disable: false
        // },
        // {
        //     name: "analysis",
        //     icon: "docs/ic-analyse",
        //     href: "/dashboard/settings/analysis",
        //     disable: false
        // },
        // {
        //     name: "medical_imaging",
        //     icon: "docs/ic-soura",
        //     href: "/dashboard/settings/medical-imaging",
        //     disable: false
        // },
        // {
        //     name: "agenda",
        //     icon: "setting/ic-agenda",
        //     href: "/dashboard/settings/agenda",
        //     disable: true
        // },
        // {
        //      name: "timeSchedule",
        //      icon: "setting/ic-time",
        //      href: "/dashboard/settings/timeSchedule",
        //  },
        // {
        //     name: "conges",
        //     icon: "setting/ic-time",
        //     href: "/dashboard/settings/holidays",
        //     disable: false
        // },
        // {
        //     name: "remplaçants",
        //     icon: "setting/ic-refrech",
        //     href: "/dashboard/settings/substitute",
        //     disable: true
        // },
        // {
        //     name: "users",
        //     icon: "setting/ic-users",
        //     href: "/dashboard/settings/users",
        //     disable: false
        // },

        //  {
        //     name: "reseau",
        //     icon: "setting/ic-message-contour",
        //     href: "/setting/sms",
        // },

        // {
        //     name: "instructions",
        //     icon: "setting/ic-messagerie",
        //     href: "/dashboard/settings/instructions",
        //     disable: true
        // },
        {
            name: "import-data",
            icon: "setting/ic-import",
            fill: "default",
            href: "/dashboard/settings/data",
            disable: false,
            submenu: []
        },
        //  {
        //      name: "app_lock",
        //      icon: "ic-cloc",
        //      href: "/dashboard/settings/app-lock",
        //      disable: false
        //  },

    ],
}
export default settingsData;
