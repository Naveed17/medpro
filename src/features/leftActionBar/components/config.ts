import dynamic from "next/dynamic";
import { path, ROOTS } from "@app/routes";

const LeftActionsData = [
    {
        pathname: path(ROOTS.app, '/settings'),
        component: dynamic(
            ():any =>
                import("@features/leftActionBar/components/settingsActionBar/settingsActionBar").then((mod) => mod)
        ),
    },{
        pathname: path(ROOTS.app, ''),
        component: dynamic(
            ():any =>
                import("@features/leftActionBar/components/agendaActionBar/agendaActionBar").then((mod) => mod)
        ),
    },
];

export default LeftActionsData;
