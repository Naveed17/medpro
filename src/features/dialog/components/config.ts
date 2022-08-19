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
  }

];

export default dialogData;
