import dynamic from "next/dynamic";

const rowsActionsData = [
  {
    action: "motif",
    component: dynamic((): any =>
      import("@features/table/components/rows/motifRow").then((mod) => mod)
    ),
  },
  {
    action: "motif-type",
    component: dynamic((): any =>
      import("@features/table/components/rows/motifTypeRow").then((mod) => mod)
    ),
  },
  {
    action: "template",
    component: dynamic((): any =>
      import("@features/table/components/rows/templateRow").then((mod) => mod)
    ),
  },
  {
    action: "lieux",
    component: dynamic((): any =>
      import("@features/table/components/rows/lieuxRow").then((mod) => mod)
    ),
  },
  {
    action: "permission",
    component: dynamic((): any =>
      import("@features/table/components/rows/permissionRow").then((mod) => mod)
    ),
  },
  {
    action: "agenda",
    component: dynamic((): any =>
      import("@features/table/components/rows/agendaRow").then((mod) => mod)
    ),
  },
  {
    action: "calendar",
    component: dynamic((): any =>
      import("@features/table/components/rows/calendarRow").then((mod) => mod)
    ),
  },
  {
    action: "patient",
    component: dynamic((): any =>
      import("@features/table/components/rows/patientRow").then((mod) => mod)
    ),
  },
  {
    action: "patient-documents",
    component: dynamic((): any =>
      import("@features/table/components/rows/patientDocumentRow").then(
        (mod) => mod
      )
    ),
  },

  {
    action: "waitingRoom",
    component: dynamic((): any =>
      import("@features/table/components/rows/waitingRoomRow").then(
        (mod) => mod
      )
    ),
  },
  {
    action: "holidays",
    component: dynamic((): any =>
      import("@features/table/components/rows/HolidayRow").then((mod) => mod)
    ),
  },
  {
    action: "substitute",
    component: dynamic((): any =>
      import("@features/table/components/rows/substituteRow").then((mod) => mod)
    ),
  },
  {
    action: "users",
    component: dynamic((): any =>
      import("@features/table/components/rows/userRow").then((mod) => mod)
    ),
  },
  {
    action: "instructions",
    component: dynamic((): any =>
      import("@features/table/components/rows/instructionRow").then(
        (mod) => mod
      )
    ),
  },
  {
    action: "CIP-medical-procedures",
    component: dynamic((): any =>
      import("@features/table/components/rows/cIPMedicalProceduresRow").then(
        (mod) => mod
      )
    ),
  },
  {
    action: "CIP-next-appointment",
    component: dynamic((): any =>
      import("@features/table/components/rows/cIPNextAppointRow").then(
        (mod) => mod
      )
    ),
  },
  {
    action: "actfees",
    component: dynamic((): any =>
      import("@features/table/components/rows/actsFeesRow").then(
        (mod) => mod
      )
    ),
  },
  {
    action: "payment",
    component: dynamic((): any =>
      import("@features/table/components/rows/paymentRow").then(
        (mod) => mod
      )
    ),
  },
];

export default rowsActionsData;
