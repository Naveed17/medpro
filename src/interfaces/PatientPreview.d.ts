interface PatientPreview {
  uuid:string
  antecedents: any
  contact:string[]
  documents:number
  email: string
  fiche_id: string
  first_name:string
  hasPhoto:boolean
  insurances:InsuranceModel[]
  lastName:string
  note:string
  requestedAnalyses: number
  requestedImaging: number
  treatments: number
  rest_amount:number

  birthdate:string
  gender:string
  idCard:string
}