interface OcrDocument {
    appointment: any
    documentType: any
    medicalData: any
    patient: PatientModel | null
    patientData: any
    uri: any
    status: number;
    title: string;
    uuid: string;
}
