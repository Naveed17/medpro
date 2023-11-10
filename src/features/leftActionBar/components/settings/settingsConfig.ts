const settingsData = {
    title: "parameters",
    data: [
        {
            name: "profile",
            icon: "setting/ic-patient",
            href: '/dashboard/settings/profil',
            disable: false
        },
        {
            name: "horaire",
            deep: "location",
            icon: "setting/ic-times",
            href: "/dashboard/settings/places/[uuid]",
            disable: false
        },
        {
            name: "acts",
            icon: "ic-generaliste",
            href: "/dashboard/settings/acts",
            disable: true
        },
        {
            name: "actfees",
            icon: "setting/ic-caisse",
            href: "/dashboard/settings/actfees",
            disable: false
        },
        {
            name: "motif",
            icon: "setting/ic-motifs",
            href: "/dashboard/settings/motif",
            disable: false
        },
        {
            name: "consultation",
            icon: "setting/ic-fiche",
            href: "/dashboard/settings/patient-file-templates",
            disable: false
        },
        {
            name: "lieu",
            icon: "setting/ic-pin",
            href: "/dashboard/settings/places",
            disable: true
        },
        {
            name: "configdoc",
            icon: "setting/ic-document",
            href: "/dashboard/settings/templates",
            disable: false
        },
        {
            name: "type",
            icon: "setting/ic-reasons",
            href: "/dashboard/settings/consultation-type",
            disable: false
        },

        {
            name: "agenda",
            icon: "setting/ic-agenda",
            href: "/dashboard/settings/agenda",
            disable: true
        },
        /* {
             name: "timeSchedule",
             icon: "setting/ic-time",
             href: "/dashboard/settings/timeSchedule",
         },*/
        {
            name: "conges",
            icon: "setting/ic-time",
            href: "/dashboard/settings/holidays",
            disable: true
        },
        {
            name: "remplaçants",
            icon: "setting/ic-refrech",
            href: "/dashboard/settings/substitute",
            disable: true
        },
        {
            name: "users",
            icon: "setting/ic-users",
            href: "/dashboard/settings/users",
            disable: false
        },
        /*
         {
            name: "reseau",
            icon: "setting/ic-message-contour",
            href: "/setting/sms",
        },
        */
        {
            name: "instructions",
            icon: "setting/ic-messagerie",
            href: "/dashboard/settings/instructions",
            disable: true
        },
        {
            name: "import-data",
            icon: "setting/ic-import",
            fill: "default",
            href: "/dashboard/settings/data",
            disable: false
        },
        /* {
             name: "app_lock",
             icon: "ic-cloc",
             href: "/dashboard/settings/app-lock",
             disable: false
         },*/

    ],
}
export default settingsData;
