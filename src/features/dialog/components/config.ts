import dynamic from "next/dynamic";

const dialogData = [
    {
        action: "qualification",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/qualificationDialog/qualificationDialog"
            ).then((mod) => mod)
        ),
    },
    {
        action: "assurance",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/assuranceDialog/assuranceDialog"
            ).then((mod) => mod)
        ),
    },
    {
        action: "mode",
        component: dynamic((): any =>
            import("@features/dialog/components/modeRegDialog/modeRegDialog").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "langues",
        component: dynamic((): any =>
            import("@features/dialog/components/languesDialog/languesDialog").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "remove",
        component: dynamic((): any =>
            import("@features/dialog/components/removeDialog/removeDialog").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "consultation-modal",
        component: dynamic((): any =>
            import("@features/dialog/components/consultationModalDialog/consultationModalDialog").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "medical_prescription",
        component: dynamic((): any =>
            import("@features/dialog/components/medicalPrescriptionDialog/medicalPrescriptionDialog").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "balance_sheet_request",
        component: dynamic((): any =>
            import("@features/dialog/components/balanceSheet/balanceSheet").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "medical_imagery",
        component: dynamic((): any =>
            import("@features/dialog/components/medicalImagery/medicalImagery").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "balance_sheet_pending",
        component: dynamic((): any =>
            import("@features/dialog/components/balanceSheetPending/balanceSheetPending").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "add_a_document",
        component: dynamic((): any =>
            import("@features/dialog/components/addDocumentDialog/addDocumentDialog").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "qr-dialog",
        component: dynamic((): any =>
            import("@features/dialog/components/qrCodeDialog/qrCodeDialog").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "add_treatment",
        component: dynamic((): any =>
            import("@features/dialog/components/medicalPrescriptionDialog/medicalPrescriptionDialog").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "way_of_life",
        component: dynamic((): any =>
            import("@features/dialog/components/lifeStyleDialog/lifeStyleDialog").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "allergic",
        component: dynamic((): any =>
            import("@features/dialog/components/lifeStyleDialog/lifeStyleDialog").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "medical_antecedents",
        component: dynamic((): any =>
            import("@features/dialog/components/lifeStyleDialog/lifeStyleDialog").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "family_antecedents",
        component: dynamic((): any =>
            import("@features/dialog/components/familyHistoryDialog/familyHistoryDialog").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "surgical_antecedents",
        component: dynamic((): any =>
            import("@features/dialog/components/lifeStyleDialog/lifeStyleDialog").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "document_detail",
        component: dynamic((): any =>
            import("@features/dialog/components/documentDetailDialog/documentDetailDialog").then(
                (mod) => mod
            ),
            {
                ssr: false
            }
        ),
    },
    {
        action: "end_consultation",
        component: dynamic((): any =>
            import("@features/dialog/components/endConsultationDialog/endConsultationDialog").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "secretary_consultation_alert",
        component: dynamic((): any =>
            import("@features/dialog/components/secretaryConsultationDialog/secretaryConsultationDialog").then(
                (mod) => mod
            )
        )
    },
    {
        action: "modelName",
        component: dynamic((): any =>
            import("@features/dialog/components/modelName/modelName").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "move_appointment",
        component: dynamic((): any =>
            import("@features/dialog/components/moveAppointmentDialog/components/moveAppointmentDialog").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "payment_dialog",
        component: dynamic((): any =>
            import("@features/dialog/components/paymentDialog/paymentDialog").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "write_certif",
        component: dynamic((): any =>
            import("@features/dialog/components/certifDialog/certifDialog").then(
                (mod) => mod
            )
        ),
    }
];

export default dialogData;
