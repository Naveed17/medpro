import dynamic from "next/dynamic";

const rowsActionsData = [
    {
        action: 'motif',
        component: dynamic(():any => import("@features/table/components/rows/motifRow").then((mod) => mod))
    },
    {
        action: 'lieux',
        component: dynamic(():any => import("@features/table/components/rows/lieuxRow").then((mod) => mod))
    },
    {
        action: 'permission',
        component: dynamic(():any => import("@features/table/components/rows/permissionRow").then((mod) => mod))
    },
    {
        action: 'agenda',
        component: dynamic(():any => import("@features/table/components/rows/agendaRow").then((mod) => mod))
    }
];

export default rowsActionsData;
