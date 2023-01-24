interface TransactionDataModel {
  payment_means: string;
  insurance?: string;
  amount: number;
  status_transaction: string;
  payment_type?:any;
  payment_date: string;
  type_transaction:string
  data: any;
  designation?:string;
}