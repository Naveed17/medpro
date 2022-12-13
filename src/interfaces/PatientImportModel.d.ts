interface PatientImportModel {
    "city": string;
    "gender": number;
    "number": number;
    "address": string;
    "contact": string;
    "birthday": {
        "date": string;
        "timezone": string;
        "timezone_type": number;
    },
    "lastname": string;
    "firstname": string;
    "insurance": {
        "insurance": string;
        "insuranceNumber": string;
        "insuranceRelation": number;
    },
    "profession": string;
    "maritalStatus": string;
    "addressedDoctor": string;
}
