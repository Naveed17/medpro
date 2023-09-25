interface TransactionDataModel {
  amount: number
  data:any
  insurance: string
  payment_date:string
  payment_time:string
  payment_means: {uuid: string, name: string, slug: string, logoUrl: string}
  status_transaction:string
  type_transaction:string
  uuid?:string
}