import dynamic from "next/dynamic";

const dialogData = [
    {
        action: 'qualification',
        component: dynamic(
            ():any =>
                import("@features/settingsDialogs/components/qualificationDialog/qualificationDialog").then((mod) => mod)
        ),
    }
];

export default dialogData;
