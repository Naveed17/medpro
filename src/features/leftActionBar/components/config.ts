import dynamic from "next/dynamic";
import { path, ROOTS } from "@app/routes/routes";

const LeftActionsData = [
    {
        pathname: path(ROOTS.app, '/settings'),
        component: dynamic(
            (): any =>
                import("@features/leftActionBar/components/settings/settings").then((mod) => mod)
        ),
    },
    {
        pathname: path(ROOTS.app, '/waiting-room'),
        component: dynamic(
            (): any =>
                import("@features/leftActionBar/components/waitingRoom/components/waitingRoom").then((mod) => mod)
        ),
    }, {
        pathname: path(ROOTS.app, ''),
        component: dynamic(
            (): any =>
                import("@features/leftActionBar/components/agenda/agenda").then((mod) => mod)
        ),
    },
];

export default LeftActionsData;
