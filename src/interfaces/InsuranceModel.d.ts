interface InsuranceModel {
    documents?: any[];
    uuid: string;
    name: string;
    logoUrl: { url: string };
    hasApci:boolean;
    boxes:InsuranceBoxModel[];
}
