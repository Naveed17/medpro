interface PatientPreview {
    uuid: string
    antecedents: any
    contact: ContactModel[]
    documents: number
    email: string
    fiche_id: string
    firstName: string
    hasPhoto: boolean
    insurances: InsuranceModel[]
    lastName: string
    note: string
    requestedAnalyses: number
    requestedImaging: number
    treatments: number
    rest_amount: number
    birthdate: string
    gender: string
    idCard: string
    wallet: number
}
