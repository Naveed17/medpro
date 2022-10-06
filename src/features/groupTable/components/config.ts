import dynamic from "next/dynamic";

const rowsActionsData = [
  {
    action: "patient",
    component: dynamic((): any =>
      import("@features/groupTable/components/rows/rdvRow").then((mod) => mod)
    ),
  },
  {
    action: "upcoming",
    component: dynamic((): any =>
      import("@features/groupTable/components/rows/rdvUpcomingRow").then((mod) => mod)
    ),
  },
];

export default rowsActionsData;
