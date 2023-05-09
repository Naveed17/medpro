import {countries} from "@features/countrySelect/countries";

export const SocialInsured = [
    {grouped: "L'assuré social", key: "socialInsured", value: "0", label: "Lui-même"},
    {grouped: "Le conjoint", key: "partner", value: "1", label: "Le conjoint"},
    {grouped: "L'ascendant", key: "father", value: "2", label: "Le Pére"},
    {grouped: "L'ascendant", key: "mother", value: "3", label: "La Mére"},
    {grouped: "L'enfant", key: "child", value: "4", label: "1er Enfant"},
    {grouped: "L'enfant", key: "child", value: "5", label: "2ème Enfant"},
    {grouped: "L'enfant", key: "child", value: "6", label: "3ème Enfant"},
    {grouped: "L'enfant", key: "child", value: "7", label: "Autre"},
];

export const PhoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const DefaultCountry = countries.find(country => country.code === process.env.NEXT_PUBLIC_COUNTRY) as CountryModel;

export const EnvPattern = ["localhost", "develop", "master"];

export const SubMotifCard = [
    {
        id: 1,
        title: "treatment_medication",
        icon: "ic-traitement",
        type: "treatment",
        drugs: [
            {
                id: 1,
                name: "Doliprane 1000",
                dosage: "dosage_unit",
                duration: 10,
            },
            {
                id: 2,
                name: "Doliprane 1000",
                dosage: "dosage_unit",
                duration: 10,
            },
        ],
    },
    {
        id: 2,
        title: "documents",
        icon: "ic-document",
        type: "document",
        documents: ["document_1", "document_2"],
    },
    {
        id: 3,
        title: "bal_sheet_req",
        icon: "ic-document",
        type: "req-sheet",
    },
    {
        id: 4,
        title: "medical_sheet_req",
        icon: "ic-soura",
        type: "req-medical-imaging",
    },
    {
        id: 5,
        title: "actfees",
        icon: "ic-text",
        type: "act-fees",
    },
];

export const UrlMedicalEntitySuffix = '/api/medical-entity';
