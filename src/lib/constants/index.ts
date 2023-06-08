import {countries} from "@features/countrySelect/countries";
import data from "public/static/data/medicalFormeUnite.json";

export const SocialInsured = [
    {grouped: "socialInsured", key: "socialInsured", value: "0", label: "himself"},
    {grouped: "partner", key: "partner", value: "1", label: "partner"},
    {grouped: "ascendant", key: "father", value: "2", label: "father"},
    {grouped: "ascendant", key: "mother", value: "3", label: "mother"},
    {grouped: "child", key: "child", value: "4", label: "1_child"},
    {grouped: "child", key: "child", value: "5", label: "2_child"},
    {grouped: "child", key: "child", value: "6", label: "3_child"},
    {grouped: "child", key: "child", value: "7", label: "other_child"},
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

export const WaitingHeadCells = [
    {
        id: "id",
        numeric: true,
        disablePadding: true,
        label: "Id",
        align: "left",
        sortable: true,
    },
    {
        id: "patient",
        numeric: false,
        disablePadding: true,
        label: "patient",
        align: "left",
        sortable: true,
    },
    {
        id: "arrivaltime",
        numeric: false,
        disablePadding: true,
        label: "arrival time",
        align: "left",
        sortable: true,
    },
    {
        id: "appointmentTime",
        numeric: false,
        disablePadding: true,
        label: "appointment time",
        align: "left",
        sortable: false,
    },
    {
        id: "waiting",
        numeric: false,
        disablePadding: true,
        label: "waiting",
        align: "left",
        sortable: true,
    },
    {
        id: "type",
        numeric: false,
        disablePadding: true,
        label: "type",
        align: "left",
        sortable: false,
    },
    {
        id: "motif",
        numeric: false,
        disablePadding: true,
        label: "reason",
        align: "left",
        sortable: false,
    },
    {
        id: "fees",
        numeric: false,
        disablePadding: true,
        label: "empty",
        align: "right",
        sortable: false,
    },
    {
        id: "action",
        numeric: false,
        disablePadding: true,
        label: "action",
        align: "right",
        sortable: false,
    }
];

export const AddWaitingRoomCardData = {
    mainIcon: "ic-salle",
    title: "empty",
    description: "desc",
    buttonText: "table.no-data.event.title",
    buttonIcon: "ic-salle",
    buttonVariant: "primary",
};

export const UrlMedicalEntitySuffix: string = '/api/medical-entity';

export const UrlMedicalProfessionalSuffix: string = '/api/medical-professional';

export const MedicalFormUnit = data;

export const PrescriptionMultiUnits = MedicalFormUnit.filter(medic => medic.multiple).map(medic => medic.unit);
