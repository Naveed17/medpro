interface CountryModel {
    uuid: string;
    name: string;
    code: string;
    phone: string;
    hasState: boolean;
    nationality: string;
    currency?: {
        uuid: string;
        name: string;
    }
}
