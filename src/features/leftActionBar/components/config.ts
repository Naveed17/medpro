import dynamic from "next/dynamic";
import { path, ROOTS } from "@settings/routes";

const LeftActionsData = [
    {
        pathname: path(ROOTS.app, '/settings'),
        component: dynamic(
            ():any =>
                import("@features/leftActionBar/components/settingsActionBar").then((mod) => mod)
        ),
    },
];

export default LeftActionsData;