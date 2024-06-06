interface InsuranceModel {
    documents?: any[];
    uuid: string;
    name: string;
    logoUrl: { url: string };
    hasApci:boolean;
    hasExport:boolean;
    boxes:InsuranceBoxModel[];
    insurance:any;
    insuranceNumber:number;
}
