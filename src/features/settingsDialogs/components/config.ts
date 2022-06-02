import dynamic from "next/dynamic";

const dialogData = [
    {
        action: 'qualification',
        component: dynamic(
            ():any =>
                import("@features/settingsDialogs/components/qualificationDialog/qualificationDialog").then((mod) => mod)
        ),

    },
    {
        action: 'assurance',
        component: dynamic(
            ():any =>
                import("@features/settingsDialogs/components/assuranceDialog/assuranceDialog").then((mod) => mod)
        ),
    },
    {
        action: 'mode',
        component: dynamic(
            ():any =>
                import("@features/settingsDialogs/components/modeRegDialog/modeRegDialog").then((mod) => mod)
        ),
    },
    {
        action: 'langues',
        component: dynamic(
            ():any =>
                import("@features/settingsDialogs/components/languesDialog/languesDialog").then((mod) => mod)
        ),
    }
];

export default dialogData;
