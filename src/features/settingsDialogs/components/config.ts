import dynamic from "next/dynamic";
import { path, ROOTS } from "@app/routes";

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
