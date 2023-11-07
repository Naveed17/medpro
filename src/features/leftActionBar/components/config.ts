import dynamic from "next/dynamic";
import {path, ROOTS} from "@lib/routes/routes";

const LeftActionsData = [
    {
        pathname: path(ROOTS.app, "/settings"),
        component: dynamic((): any =>
            import("@features/leftActionBar/components/settings/settings").then(
                (mod) => mod
            )
        ),
    },
    {
        pathname: path(ROOTS.app, "/waiting-room"),
        component: dynamic((): any =>
            import(
                "@features/leftActionBar/components/waitingRoom/components/waitingRoom"
                ).then((mod) => mod)
        ),
    },
    {
        pathname: path(ROOTS.app, "/payment"),
        component: dynamic((): any =>
            import("@features/leftActionBar/components/payment/payment").then(
                (mod) => mod
            )
        ),
    },
    {
        pathname: path(ROOTS.app, "/cashbox"),
        component: dynamic((): any =>
            import("@features/leftActionBar/components/cashbox/cashbox").then(
                (mod) => mod
            )
        ),
    },
    {
        pathname: path(ROOTS.app, "/consultation"),
        component: dynamic((): any =>
            import(
                "@features/leftActionBar/components/consultation/consultation"
                ).then((mod) => mod)
        ),
    },
    {
        pathname: path(ROOTS.app, "/documents/[...document]"),
        component: dynamic((): any =>
            import(
                "@features/leftActionBar/components/document/components/document"
                ).then((mod) => mod)
        ),
    },
    {
        pathname: path(ROOTS.app, "/documents"),
        component: dynamic((): any =>
            import(
                "@features/leftActionBar/components/document/components/docs"
                ).then((mod) => mod)
        ),
    },
    {
        pathname: path(ROOTS.app, "/patient"),
        component: dynamic((): any =>
            import(
                "@features/leftActionBar/components/patient/components/patient"
                ).then((mod) => mod)
        ),
    },
    {
        pathname: path(ROOTS.app, "/questions"),
        component: dynamic((): any =>
            import(
                "@features/leftActionBar/components/questions/components/questions"
                ).then((mod) => mod)
        ),
    },
    {
        pathname: path(ROOTS.app, "/inventory"),
        component: dynamic((): any =>
            import("@features/leftActionBar/components/inventory/inventory").then(
                (mod) => mod
            )
        ),
    },
    /*  {
        pathname: path(ROOTS.app, "/statistics"),
        component: dynamic((): any =>
          import("@features/leftActionBar/components/stats/components/stats").then(
            (mod) => mod
          )
        ),
      },*/
    {
        pathname: path(ROOTS.app, "/agenda"),
        component: dynamic((): any =>
            import("@features/leftActionBar/components/agenda/agenda").then(
                (mod) => mod
            )
        ),
    },
];

export default LeftActionsData;
