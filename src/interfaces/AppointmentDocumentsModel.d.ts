interface AppointmentDocumentsModel {
  certificate:CertifModel[]
  createdAt:string
  description:string
  documentType:string
  folder:FolderMd
  medical_imaging:any[]
  prescription:any[]
  requested_Analyses:any[]
  size:number
  title:string
  type:string
  uri:DocumentPreviewModel,
  uuid:string
}
