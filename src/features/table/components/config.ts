import dynamic from "next/dynamic";
import StaffRow from "@features/table/components/rows/staffRow";

const rowsActionsData = [
    {
        action: "motif",
        component: dynamic((): any =>
            import("@features/table/components/rows/motifRow").then((mod) => mod)
        ),
    },
    {
        action: "consultation-type",
        component: dynamic((): any =>
            import("@features/table/components/rows/motifTypeRow").then((mod) => mod)
        ),
    },
    {
        action: "insurance",
        component: dynamic((): any =>
            import("@features/table/components/rows/insuranceRow").then((mod) => mod)
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
        action: "ocrDocument",
        component: dynamic((): any =>
            import("@features/table/components/rows/ocrDocumentRow").then((mod) => mod)
        ),
    },
    {
        action: "trash",
        component: dynamic((): any =>
            import("@features/table/components/rows/trashRow").then((mod) => mod)
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
        action: "doctors",
        component: dynamic((): any =>
            import("@features/table/components/rows/doctorRow").then((mod) => mod)
        ),
    },
    {
        action: "staff",
        component: dynamic((): any =>
            import("@features/table/components/rows/staffRow").then((mod) => mod)
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
    {
        action: "cashbox",
        component: dynamic((): any =>
            import("@features/table/components/rows/cashboxRow").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "unpaidconsult",
        component: dynamic((): any =>
            import("@features/table/components/rows/unpaidConsultRow").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "chequesList",
        component: dynamic((): any =>
            import("@features/table/components/rows/chequeRow").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "payment_dialog",
        component: dynamic((): any =>
            import("@features/table/components/rows/paymentDialogRow").then(
                (mod) => mod
            )
        ),
    }, {
        action: "import_data",
        component: dynamic((): any =>
            import("@features/table/components/rows/importDataRow").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "inventory",
        component: dynamic((): any =>
            import("@features/table/components/rows/inventoryRow").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "paid-consultation",
        component: dynamic((): any =>
            import("@features/table/components/rows/paidConsultRow").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "analysis",
        component: dynamic((): any =>
            import("@features/table/components/rows/analysisRow").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "drugs",
        component: dynamic((): any =>
            import("@features/table/components/rows/drugsRow").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "profile",
        component: dynamic((): any =>
            import("@features/table/components/rows/profileRow").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "medical-imaging",
        component: dynamic((): any =>
            import("@features/table/components/rows/medicalImagingRow").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "actfees-collapse",
        component: dynamic((): any =>
            import("@features/table/components/rows/actsFeesCollapseRow").then(
                (mod) => mod
            )
        ),
    },
     {
        action: "rest-pass",
        component: dynamic((): any =>
            import("@features/table/components/rows/restPassRow").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "billing-history",
        component: dynamic((): any =>
            import("@features/table/components/rows/billingHishtoryRow").then(
                (mod) => mod
            )
        ),
    },

];

export default rowsActionsData;
