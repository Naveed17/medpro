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
        action: "openingHours",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/openingHoursDialog/components/openingHoursDialog"
                ).then((mod) => mod)
        ),
    },
    {
        action: "send-email",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/sendEmailDialog/sendEmailDialog"
                ).then((mod) => mod)
        ),
    },
    {
        action: "switch-consultation",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/switchConsultationDialog/switchConsultationDialog"
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
        action: "createCashBox",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/createCashBox/createCashBoxDialog"
                ).then((mod) => mod)
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
            import(
                "@features/dialog/components/consultationModalDialog/consultationModalDialog"
                ).then((mod) => mod)
        ),
    },
    {
        action: "medical_prescription",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/medicalPrescriptionDialog/medicalPrescriptionDialog"
                ).then((mod) => mod)
        ),
    },
    {
        action: "medical_prescription_model",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/medicalPrescriptionModelDialog/components/medicalPrescriptionModelDialog"
                ).then((mod) => mod)
        ),
    },
    {
        action: "medical_prescription_cycle",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/medicalPrescriptionCycleDialog/medicalPrescriptionCycleDialog"
                ).then((mod) => mod)
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
        action: "insurance_document_print",
        component: dynamic((): any =>
            import("@features/dialog/components/insuranceDocumentPrint/insuranceDocumentPrint").then(
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
        action: "ocr_docs",
        component: dynamic((): any =>
            import("@features/dialog/components/ocrDocsDialog/ocrDocsDialog").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "balance_sheet_pending",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/balanceSheetPending/balanceSheetPending"
                ).then((mod) => mod)
        ),
    },
    {
        action: "medical_imaging_pending",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/medicalImagingPending/medicalImagingPending"
                ).then((mod) => mod)
        ),
    },
    {
        action: "add_a_document",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/addDocumentDialog/addDocumentDialog"
                ).then((mod) => mod)
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
            import(
                "@features/dialog/components/addTreatmentDialog/addTreatmentDialog"
                ).then((mod) => mod)
        ),
    },
    {
        action: "way_of_life",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/lifeStyleDialog/lifeStyleDialog"
                ).then((mod) => mod)
        ),
    },
    {
        action: "allergic",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/lifeStyleDialog/lifeStyleDialog"
                ).then((mod) => mod)
        ),
    },
    {
        action: "dynamicAnt",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/lifeStyleDialog/lifeStyleDialog"
                ).then((mod) => mod)
        ),
    },
    {
        action: "document_detail",
        component: dynamic(
            (): any =>
                import(
                    "@features/dialog/components/documentDetailDialog/documentDetailDialog"
                    ).then((mod) => mod),
            {
                ssr: false,
            }
        ),
    },
    {
        action: "end_consultation",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/endConsultationDialog/endConsultationDialog"
                ).then((mod) => mod)
        ),
    },
    {
        action: "secretary_consultation_alert",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/secretaryConsultationDialog/secretaryConsultationDialog"
                ).then((mod) => mod)
        ),
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
            import(
                "@features/dialog/components/moveAppointmentDialog/components/moveAppointmentDialog"
                ).then((mod) => mod)
        ),
    },
    {
        action: "quick_add_appointment",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/quickAddAppointment/quickAddAppointment"
                ).then((mod) => mod)
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
        action: "open_ai",
        component: dynamic((): any =>
            import("@features/dialog/components/medAIDialog/medAIDialog").then(
                (mod) => mod
            )
        ),
    },
    {
        action: "quote-request-dialog",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/addQuoteRequestDialog/addQuoteRequestDialog"
                ).then((mod) => mod)
        ),
    },
    {
        action: "cashout",
        component: dynamic((): any =>
            import("@features/dialog/components/cashOutDialog/cashOutDialog").then(
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
    },
    {
        action: "add_vaccin",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/addVaccineDialog/addVaccineDialog"
                ).then((mod) => mod)
        ),
    },
    {
        action: "add_insurance",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/InsuranceAddDialog/InsuranceAddDialog"
                ).then((mod) => mod)
        ),
    },
    {
        action: "patient_observation_history",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/observationHistoryDialog/observationHistoryDialog"
                ).then((mod) => mod)
        ),
    },
    {
        action: "pre_consultation_data",
        component: dynamic(
            (): any =>
                import(
                    "@features/dialog/components/preConsultationDialog/components/preConsultationDialog"
                    ).then((mod) => mod),
            {
                ssr: false,
            }
        ),
    },
    {
        action: "add-new-role",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/addNewRoleDialog/components/addNewRoleDialog"
                ).then((mod) => mod)
        ),
    },
    {
        action: "add-feature-profile",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/addFeatureProfileDialog/components/addFeatureProfileDialog"
                ).then((mod) => mod)
        ),
    },
    {
        action: "add-visitor",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/addVisitorDialog/components/addVisitorDialog"
                ).then((mod) => mod)
        ),
    },
    {
        action: "delete-modal",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/deleteModalDialog/components/deleteModalDialog"
                ).then((mod) => mod)
        ),
    },
    {
        action: "delete-transaction",
        component: dynamic((): any =>
            import(
                "@features/dialog/components/deleteModalDialog/components/deleteTransactionDialog"
                ).then((mod) => mod)
        ),
    }
];

export default dialogData;
