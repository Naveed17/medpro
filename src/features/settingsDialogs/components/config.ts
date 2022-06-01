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
    }
];

export default dialogData;
