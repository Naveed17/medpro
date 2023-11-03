interface OcrDocument {
    appointment: any
    documentType: any
    medicalData: any
    patient: PatientModel | null
    patientData: any
    status: number;
    title: string;
    uuid: string;
}
