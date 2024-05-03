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

export const PatientContactRelation = [
    {key: "himself", value: 0, label: "himself"},
    {key: "partner", value: 1, label: "partner"},
    {key: "father", value: 2, label: "father"},
    {key: "mother", value: 3, label: "mother"},
    {key: "child", value: 4, label: "child"},
];

export const PhoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const DefaultCountry = countries.find(country => country.code === process.env.NEXT_PUBLIC_COUNTRY) as CountryModel;

export const EnvPattern = ["localhost", "develop", "master", "preview"];

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
        id: "appointment",
        numeric: false,
        disablePadding: true,
        label: "appointment",
        align: "left",
        sortable: true,
    },
    {
        id: "waiting_time",
        numeric: false,
        disablePadding: true,
        label: "waiting_time",
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
        id: "empty",
        numeric: false,
        disablePadding: true,
        label: "empty",
        align: "right",
        sortable: false,
    }
];

export const WaitingTodayCells = [
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
        id: "appointment",
        numeric: false,
        disablePadding: true,
        label: "appointment",
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
        id: "empty",
        numeric: false,
        disablePadding: true,
        label: "empty",
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

export const PrescriptionMultiUnits = MedicalFormUnit.reduce((medics: any[], medic: any) => [...(medics ?? []), ...(medic.multiple ? [medic.unit] : [])], []);

export const TransactionType = [
    // Add Payment ( ajout caisse/ Alimenter )
    {
        key: "IN",
        value: "1",
    },
    // Cash withdrawal ( retrait du caisse/ Dépense )
    {
        key: "OUT",
        value: "2",
    },
    // Appointment transaction (  transaction RDV )
    {
        key: "APP",
        value: "3",
    },
    // Collection transaction ( operation d'encaissement/ Encaisser )
    {
        key: "ENC",
        value: "4",
    },
    {
        key: "WAL",
        value: "5",
    },
];

export const TransactionStatus = [
    {
        key: "NOT_PAID",
        value: "1",
    },
    {
        key: "PARTIAL_PAID",
        value: "2",
    },
    {
        key: "PAID",
        value: "3",
    },
];

export const iconDocument = (data: string) => {
    return data === "prescription" && "docs/ic-prescription" ||
        data == "requested-analysis" && "docs/ic-analyse" ||
        data == "analyse" && "docs/ic-analyse" ||
        data == "medical-imaging" && "docs/ic-soura" ||
        data == "requested-medical-imaging" && "docs/ic-soura" ||
        data === "photo" && "docs/ic-ic-gallery" ||
        data === "audio" && "docs/ic-audio" ||
        data === "Rapport" && "docs/ic-ordonnance" ||
        data === "medical-certificate" && "docs/ic-ordonnance" ||
        data === "video" && "ic-video-outline" ||
        data !== "prescription" && "ic-quote" || ""
}

export const tinymcePlugins = "advlist anchor autosave charmap codesample directionality  emoticons help image insertdatetime  lists media   nonbreaking pagebreak searchreplace table visualblocks visualchars wordcount table"
export const tinymceToolbar = "blocks fontfamily fontsize | bold italic underline forecolor backcolor | align lineheight checklist bullist numlist | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol "
export const tinymceToolbarNotes = " bold italic underline forecolor backcolor | align lineheight checklist bullist numlist | blocks fontfamily fontsize"

export const MobileContainer: number = 820

export const humanizerConfig = {
    language: "shortEn",
    languages: {
        shortEn: {
            y: () => "y",
            mo: () => "mo",
            w: () => "w",
            d: () => "d",
            h: () => "h",
            m: () => "min",
            s: () => "s",
            ms: () => "ms",
        },
    },
}

export const deleteAppointmentOptionsData = [
    {
        key: "delete-appointment-insertion",
        selected: true
    },
    {
        key: "delete-appointment-data",
        selected: false
    },
    {
        key: "delete-transaction",
        selected: false
    }
]

export const generatedDocs = ['prescription', 'requested-analysis', 'requested-medical-imaging', 'write_certif', 'fees', 'quote', 'glasses', 'lens']

export const slugs = ['prescription', 'requested-analysis', 'requested-medical-imaging', 'medical-certificate', 'invoice']

export const multiMedias = ['video', 'audio', 'photo'];

export const PsychomotorDevelopmentXY = [
    {
        key: "premiers_mots",
        coordinates: {
            startDate: {x: 394, y: 480, size: 12},
            note: {x: 354, y: 512, size: 16}
        }
    },
    {
        key: "station_debout",
        coordinates: {
            startDate: {x: 492, y: 496, size: 12}
        }
    },
    {
        key: "station_assise",
        coordinates: {
            startDate: {x: 338, y: 380, size: 12}
        }
    },
    {
        key: "marche_sans_appui",
        coordinates: {
            startDate: {x: 564, y: 426, size: 12}
        }
    },
    {
        key: "proprete_nocturne_et_diurne",
        coordinates: {
            startDate: {x: 522, y: 361, size: 12}
        }
    },
    {
        key: "premiere_dent",
        coordinates: {
            startDate: {x: 405, y: 438, size: 12}
        }
    }
]

export const signs = ['Bélier: Le Bélier', 'Taureau: Le Taureau', 'Gémeaux: Les Gémeaux', 'Cancer: Le Crabe', 'Lion: Le Lion', 'Vierge: La Vierge', 'Balance: La Balance', 'Scorpion: Le Scorpion', 'Sagittaire: Le Sagittaire', 'Capricorne: Le Capricorne', 'Verseau: Le Verseau', 'Poissons: Les Poissons'];
