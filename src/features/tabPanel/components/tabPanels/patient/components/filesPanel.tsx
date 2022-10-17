import {
    Box,
    Typography,
    Paper,
    FormControlLabel,
    Checkbox,
    FormGroup,
    Stack,
    List,
    ListItem,
    ListItemIcon,
    Collapse,
    IconButton,
    Grid
} from '@mui/material'
import { MotifCard, PatientHistoryCard, DocumentCard } from '@features/card'
import React, { useState } from 'react'
import PanelStyled from './overrides/panelStyle'
import IconUrl from '@themes/urlIcon'
const filterData = [
    "all",
    "report",
    "analysis",
    "prescription_drugs",
    "medical_imaging",
    "photo",
    "video",
    "audio"
];
const subMotifCard = [
    {
        id: 1,
        title: 'treatment_medication',
        icon: 'ic-traitement',
        type: 'treatment',
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
            }
        ]
    },
    {
        id: 2,
        title: 'documents',
        icon: 'ic-document',
        type: 'document',
        documents: [
            'document_1',
            'document_2',
        ]
    },
    {
        id: 3,
        title: 'bal_sheet_req',
        icon: 'ic-document',
        type: 'req-sheet',

    }
];

const apps = [
    {
        "appointment": {
            "uuid": "7166d54e-936b-4ccd-a7ff-c3bcf8f5729c",
            "type": {
                "uuid": "4af3f837-0ed7-415e-b2cb-59bf922d4574",
                "name": "Consultation",
                "color": "#1BC47D",
                "icon": "ic-consultation",
                "code": 1
            },
            "dayDate": "10-10-2022",
            "startTime": "10:27",
            "endTime": "09:30",
            "duration": 15,
            "isVip": null,
            "status": 5,
            "consultationReason": null,
            "treatments": [
                {
                    "uuid": "69c88de2-39b5-4be2-88aa-e18063862eb1",
                    "standardDrugUuid": "b25a4865-e28a-4ea4-9752-6beaf31034f1",
                    "name": "ZENEXOR  LP 75mg Gél. à Liberation Prolongée Bt 30",
                    "startDate": "10-10-2022",
                    "endDate": "11-10-2022",
                    "dosage": "1cp",
                    "duration": 1,
                    "durationType": "days",
                    "isOtherProfessional": false
                },
                {
                    "uuid": "3fc4c8da-fe88-4627-a8ad-b966090351e0",
                    "standardDrugUuid": "7cb2eeb5-ab52-410a-8995-4068962e367f",
                    "name": "EDGAR 150mg Gél. Bt 60",
                    "startDate": "10-10-2022",
                    "endDate": "15-10-2022",
                    "dosage": "1cp",
                    "duration": 5,
                    "durationType": "days",
                    "isOtherProfessional": false
                }
            ],
            "requestedAnalyses": [
                {
                    "uuid": "b3ca26f5-852b-46ca-bd77-b6ba60d4dca8",
                    "hasAnalysis": [
                        {
                            "uuid": "5a6b5a13-0cbe-4e5a-a4a9-ccff2e0431b7",
                            "result": null,
                            "analysis": {
                                "uuid": "90601ff4-f424-42db-b8af-6132edcb56c0",
                                "name": "Ac Anti CCP"
                            }
                        },
                        {
                            "uuid": "a6d69f52-d7eb-401c-99ce-8757651a485c",
                            "result": null,
                            "analysis": {
                                "uuid": "bd5a61bd-c875-43b5-8ff7-a13a812fef20",
                                "name": "Ac Anti Muscle"
                            }
                        },
                        {
                            "uuid": "087f63d7-638a-4b58-be4b-152e078de7cc",
                            "result": null,
                            "analysis": {
                                "uuid": "28d0f908-5475-4d06-b78d-3f40f92d9937",
                                "name": "Ac Antiphospholipides igG"
                            }
                        },
                        {
                            "uuid": "d7921fd3-7d11-462f-9872-6747988135d4",
                            "result": null,
                            "analysis": {
                                "uuid": "bd032d58-b641-416d-960e-61f3f0217793",
                                "name": "Ac Anti Tg"
                            }
                        }
                    ]
                }
            ],
            "appointmentData": [
                {
                    "uuid": "1851a501-3b57-40c6-8842-f5e243772b02",
                    "name": "models",
                    "value": "{\"textField\":\"\",\"textField1\":\"\",\"textField2\":\"\",\"poids\":77,\"taille\":180,\"imc\":24}",
                    "type": "models",
                    "isSharedWithPatient": false,
                    "modal": {
                        "uuid": "631b27e8-d7fe-4c86-a7dc-3e85065b4b67",
                        "label": "calcul",
                        "color": "#FEBD15",
                        "isEnabled": true,
                        "hasData": true,
                        "structure": [
                            {
                                "key": "General Practitioner",
                                "type": "fieldset",
                                "input": false,
                                "label": "Généraliste",
                                "legend": "Généraliste",
                                "tableView": false,
                                "components": [
                                    {
                                        "key": "poids",
                                        "mask": false,
                                        "type": "number",
                                        "input": true,
                                        "label": "Poids",
                                        "delimiter": false,
                                        "tableView": false,
                                        "customClass": "form-control-material",
                                        "description": "Kg",
                                        "inputFormat": "plain",
                                        "placeholder": "--",
                                        "requireDecimal": false
                                    },
                                    {
                                        "key": "taille",
                                        "mask": false,
                                        "type": "number",
                                        "input": true,
                                        "label": "Taille",
                                        "delimiter": false,
                                        "tableView": false,
                                        "customClass": "form-control-material",
                                        "description": "Cm",
                                        "inputFormat": "plain",
                                        "placeholder": "--",
                                        "requireDecimal": false
                                    },
                                    {
                                        "key": "imc",
                                        "mask": false,
                                        "type": "number",
                                        "input": true,
                                        "label": "IMC",
                                        "logic": [
                                            {
                                                "name": "calculIMC",
                                                "actions": [
                                                    {
                                                        "name": "calculIMC",
                                                        "type": "value",
                                                        "value": "value = data.poids / data.taille"
                                                    }
                                                ],
                                                "trigger": {
                                                    "type": "javascript",
                                                    "javascript": "result = (data['poids'].length > 0 && data['taille'].length > 0)"
                                                }
                                            }
                                        ],
                                        "delimiter": false,
                                        "tableView": false,
                                        "customClass": "form-control-material",
                                        "description": "Kg/m²",
                                        "inputFormat": "plain",
                                        "placeholder": "--",
                                        "requireDecimal": false
                                    }
                                ],
                                "customClass": "fieldset-specialty-formio"
                            }
                        ]
                    },
                    "data": {
                        "imc": 24,
                        "poids": 77,
                        "taille": 180,
                        "textField": "",
                        "textField1": "",
                        "textField2": ""
                    }
                },
                {
                    "uuid": "63f95699-2653-4159-b3c8-69fe62747a3f",
                    "name": "notes",
                    "value": "premiere consultation",
                    "type": "notes",
                    "isSharedWithPatient": false,
                    "modal": null,
                    "data": []
                },
                {
                    "uuid": "f98467b6-da1e-47d6-b43c-9a1de2bc48f7",
                    "name": "diagnostics",
                    "value": "premier diagnostique",
                    "type": "diagnostics",
                    "isSharedWithPatient": false,
                    "modal": null,
                    "data": []
                },
                {
                    "uuid": "8bbddd1a-4f7f-4a8f-9ce0-be1cc3b9c290",
                    "name": "treatments",
                    "value": "premier traitement",
                    "type": "treatments",
                    "isSharedWithPatient": false,
                    "modal": null,
                    "data": []
                }
            ],
            "acts": [
                {
                    "price": 20,
                    "act_uuid": "a4260d31-8ffd-41cb-a15c-217f6c603ec4"
                },
                {
                    "price": 0,
                    "act_uuid": "5bbd41d9-7d26-4935-bc0c-93837d5f9a73"
                },
                {
                    "price": 59,
                    "act_uuid": "3daf2051-d896-4955-b49a-cf9e93882a44"
                }
            ]
        },
        "documents": [
            {
                "uuid": "8679e330-e7fb-4c46-8ad7-159a9701f118",
                "title": "prescription",
                "documentType": "prescription",
                "uri": "https://s3-med-core-develop.med.ovh/develop-private/medical-entity/e62a6592-1324-4827-b159-7e6b0d7e06b4/appointments/7166d54e-936b-4ccd-a7ff-c3bcf8f5729c/prescriptions/c0a6d266-47d0-482c-a4c2-049eff4dbbaf.pdf?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=root%2F20221010%2Feu-east-1%2Fs3%2Faws4_request&X-Amz-Date=20221010T103125Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Signature=3df9c727c7e9c845ab151f836db866ade051dca11defe21a55fbd10fd810c66c",
                "prescription": [
                    {
                        "uuid": "c0a6d266-47d0-482c-a4c2-049eff4dbbaf",
                        "global_note": "",
                        "patient": {
                            "uuid": "d15d9c2c-7614-4e5d-b68b-e9c3fa4a33cc",
                            "email": "",
                            "birthdate": "10-04-2002",
                            "firstName": "mr 5 rdv",
                            "lastName": "test",
                            "gender": "M",
                            "account": null,
                            "address": [],
                            "contact": [
                                {
                                    "uuid": "9939704d-2d01-4cd4-9447-2808a0d7c513",
                                    "value": "55555555",
                                    "type": "phone",
                                    "contactType": {
                                        "uuid": "5f8269fa-0f88-474e-92fe-eec0084b491f",
                                        "name": "Téléphone"
                                    },
                                    "isPublic": false,
                                    "isSupport": false,
                                    "isVerified": false,
                                    "description": null,
                                    "code": null
                                }
                            ],
                            "insurances": [],
                            "isParent": false
                        },
                        "prescription_has_drugs": [
                            {
                                "uuid": "69c88de2-39b5-4be2-88aa-e18063862eb1",
                                "note": "",
                                "duration": 1,
                                "duration_type": "days",
                                "standard_drug": {
                                    "uuid": "b25a4865-e28a-4ea4-9752-6beaf31034f1",
                                    "commercial_name": "ZENEXOR  LP 75mg Gél. à Liberation Prolongée Bt 30",
                                    "isVerified": true
                                },
                                "dosage": "1cp"
                            },
                            {
                                "uuid": "3fc4c8da-fe88-4627-a8ad-b966090351e0",
                                "note": "",
                                "duration": 5,
                                "duration_type": "days",
                                "standard_drug": {
                                    "uuid": "7cb2eeb5-ab52-410a-8995-4068962e367f",
                                    "commercial_name": "EDGAR 150mg Gél. Bt 60",
                                    "isVerified": true
                                },
                                "dosage": "1cp"
                            }
                        ]
                    }
                ],
                "requested_Analyses": [],
                "certificate": [],
                "createdAt": "10-10-2022 09:29"
            },
            {
                "uuid": "e746ddcb-c826-44e9-9087-23050a86d392",
                "title": "Certificate 10-10-2022",
                "documentType": "medical-certificate",
                "uri": "https://s3-med-core-develop.med.ovh/develop-private/medical-entity/e62a6592-1324-4827-b159-7e6b0d7e06b4/appointments/7166d54e-936b-4ccd-a7ff-c3bcf8f5729c/certificates/2d0f29c9-c929-427f-af98-03038acf55bc.pdf?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=root%2F20221010%2Feu-east-1%2Fs3%2Faws4_request&X-Amz-Date=20221010T103125Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Signature=71f9bfb2995e5582c08c76108bccda8fb33a72fb825ab779afa3060f8f5d8e7e",
                "prescription": [],
                "requested_Analyses": [],
                "certificate": [
                    {
                        "uuid": "2d0f29c9-c929-427f-af98-03038acf55bc",
                        "content": "Je soussigné, Dr TESTER 4 certifie avoir examiné ce  jour : mr 5 rdv test et que son etat de sante necessite un repos de 19 jour(s) a compter de ce jour, sauf complications ulterieures"
                    }
                ],
                "createdAt": "10-10-2022 09:29"
            },
            {
                "uuid": "199b236d-9bea-46f6-a652-27adb833e9de",
                "title": "requested-analysis",
                "documentType": "requested-analysis",
                "uri": "https://s3-med-core-develop.med.ovh/develop-private/medical-entity/e62a6592-1324-4827-b159-7e6b0d7e06b4/appointments/7166d54e-936b-4ccd-a7ff-c3bcf8f5729c/requested-analysis/b3ca26f5-852b-46ca-bd77-b6ba60d4dca8.pdf?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=root%2F20221010%2Feu-east-1%2Fs3%2Faws4_request&X-Amz-Date=20221010T103125Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Signature=125976d1d8400ab69d52c825bca71a97fa811c934f0a73a9af6175937edf2cf4",
                "prescription": [],
                "requested_Analyses": [
                    {
                        "uuid": "b3ca26f5-852b-46ca-bd77-b6ba60d4dca8",
                        "patient": {
                            "uuid": "d15d9c2c-7614-4e5d-b68b-e9c3fa4a33cc",
                            "email": "",
                            "birthdate": "10-04-2002",
                            "firstName": "mr 5 rdv",
                            "lastName": "test",
                            "gender": "M",
                            "account": null,
                            "address": [],
                            "contact": [
                                {
                                    "uuid": "9939704d-2d01-4cd4-9447-2808a0d7c513",
                                    "value": "55555555",
                                    "type": "phone",
                                    "contactType": {
                                        "uuid": "5f8269fa-0f88-474e-92fe-eec0084b491f",
                                        "name": "Téléphone"
                                    },
                                    "isPublic": false,
                                    "isSupport": false,
                                    "isVerified": false,
                                    "description": null,
                                    "code": null
                                }
                            ],
                            "insurances": [],
                            "isParent": false
                        },
                        "appointment": {
                            "uuid": "7166d54e-936b-4ccd-a7ff-c3bcf8f5729c",
                            "type": {
                                "uuid": "4af3f837-0ed7-415e-b2cb-59bf922d4574",
                                "name": "Consultation",
                                "color": "#1BC47D",
                                "icon": "ic-consultation",
                                "code": 1
                            },
                            "dayDate": "10-10-2022",
                            "startTime": "10:27",
                            "endTime": "09:30",
                            "duration": 15,
                            "isVip": null,
                            "status": 5,
                            "instruction": "",
                            "consultationReason": null,
                            "createdAt": "10-10-2022 09:26",
                            "patient": {
                                "uuid": "d15d9c2c-7614-4e5d-b68b-e9c3fa4a33cc",
                                "email": "",
                                "birthdate": "10-04-2002",
                                "firstName": "mr 5 rdv",
                                "lastName": "test",
                                "gender": "M",
                                "contact": [
                                    {
                                        "uuid": "9939704d-2d01-4cd4-9447-2808a0d7c513",
                                        "value": "55555555",
                                        "type": "phone",
                                        "contactType": {
                                            "uuid": "5f8269fa-0f88-474e-92fe-eec0084b491f",
                                            "name": "Téléphone"
                                        },
                                        "isPublic": false,
                                        "isSupport": false,
                                        "isVerified": false,
                                        "description": null,
                                        "code": null
                                    }
                                ],
                                "antecedents": {
                                    "way_of_life": [
                                        {
                                            "uuid": "535b57f5-5f05-4a43-822d-aaec870345fa",
                                            "name": "Alcool",
                                            "startDate": "2010",
                                            "endDate": "",
                                            "ascendantOf": null
                                        },
                                        {
                                            "uuid": "c152bad7-a901-4ad6-95db-c542e4e62860",
                                            "name": "Tabac",
                                            "startDate": "2010",
                                            "endDate": "",
                                            "ascendantOf": null
                                        },
                                        {
                                            "uuid": "b5565961-7eaa-4e91-9791-5fcef270ac17",
                                            "name": "Drogue",
                                            "startDate": "",
                                            "endDate": "",
                                            "ascendantOf": null
                                        }
                                    ],
                                    "allergic": [
                                        {
                                            "uuid": "e3c40211-04a0-4135-adfe-e56eec24e635",
                                            "name": "Allergie aux protéines de lait de vache",
                                            "startDate": "2010",
                                            "endDate": "2014",
                                            "ascendantOf": null
                                        }
                                    ],
                                    "treatment": [],
                                    "family_antecedents": [
                                        {
                                            "uuid": "71fb9a0a-7d2c-4c8c-8d7a-07fdf57f7b75",
                                            "name": "Acrosyndrome paroxystique",
                                            "startDate": "",
                                            "endDate": null,
                                            "ascendantOf": ""
                                        },
                                        {
                                            "uuid": "db6cd272-ac71-4432-93a7-0a36090ad25d",
                                            "name": "Asthme",
                                            "startDate": "2000",
                                            "endDate": null,
                                            "ascendantOf": "father"
                                        }
                                    ],
                                    "surgical_antecedents": [
                                        {
                                            "uuid": "0775761f-08d9-4622-a422-be4b691e0848",
                                            "name": "Occlusion intestinale",
                                            "startDate": "2010",
                                            "endDate": "",
                                            "ascendantOf": null
                                        },
                                        {
                                            "uuid": "1470c0dc-0c95-4277-a90f-3b4ce0e89db7",
                                            "name": "Cholecystectomie",
                                            "startDate": "",
                                            "endDate": "",
                                            "ascendantOf": null
                                        }
                                    ]
                                }
                            },
                            "overlapEvent": false,
                            "PatientHasAgendaAppointment": false
                        },
                        "analyses": [
                            {
                                "uuid": "90601ff4-f424-42db-b8af-6132edcb56c0",
                                "name": "Ac Anti CCP"
                            },
                            {
                                "uuid": "bd5a61bd-c875-43b5-8ff7-a13a812fef20",
                                "name": "Ac Anti Muscle"
                            },
                            {
                                "uuid": "28d0f908-5475-4d06-b78d-3f40f92d9937",
                                "name": "Ac Antiphospholipides igG"
                            },
                            {
                                "uuid": "bd032d58-b641-416d-960e-61f3f0217793",
                                "name": "Ac Anti Tg"
                            }
                        ]
                    }
                ],
                "certificate": [],
                "createdAt": "10-10-2022 09:30"
            }
        ]
    },
    {
        "appointment": {
            "uuid": "c9536fbb-b3de-41cc-9573-a65b50ee8994",
            "type": {
                "uuid": "4af3f837-0ed7-415e-b2cb-59bf922d4574",
                "name": "Consultation",
                "color": "#1BC47D",
                "icon": "ic-consultation",
                "code": 1
            },
            "dayDate": "10-10-2022",
            "startTime": "10:30",
            "endTime": "09:33",
            "duration": 15,
            "isVip": null,
            "status": 5,
            "consultationReason": {
                "uuid": "6cb9ed7d-9a77-4ce5-9e40-fa24ddcccdec",
                "name": "test",
                "duration": 15,
                "color": "#0696D6"
            },
            "treatments": [
                {
                    "uuid": "3fb36926-7416-4464-8ec5-f78807ef0e71",
                    "standardDrugUuid": "7cb2eeb5-ab52-410a-8995-4068962e367f",
                    "name": "EDGAR 150mg Gél. Bt 60",
                    "startDate": "10-10-2022",
                    "endDate": "11-10-2022",
                    "dosage": " 3 jours",
                    "duration": 1,
                    "durationType": "days",
                    "isOtherProfessional": false
                },
                {
                    "uuid": "078c59a7-8c38-41a0-a405-cc22eeb599da",
                    "standardDrugUuid": "0b3374d0-62b8-4209-8e2e-d5c528d0803f",
                    "name": "TRIATEC  5mg Comp. Séc. Bt 28",
                    "startDate": "10-10-2022",
                    "endDate": "12-10-2022",
                    "dosage": "3 JOURS",
                    "duration": 2,
                    "durationType": "days",
                    "isOtherProfessional": false
                }
            ],
            "requestedAnalyses": [
                {
                    "uuid": "c3edc379-df8f-466a-bcdc-18d8223f1303",
                    "hasAnalysis": [
                        {
                            "uuid": "e0630ee4-a25c-4ba8-a05e-94f98038688e",
                            "result": "12",
                            "analysis": {
                                "uuid": "5b8359b5-684f-4664-b366-26b826c60874",
                                "name": "Ac Anti-Gliadine IgA"
                            }
                        },
                        {
                            "uuid": "a326c5fa-0492-42f6-b361-2708d955a23a",
                            "result": "12",
                            "analysis": {
                                "uuid": "737ed3af-55fa-41b2-998f-15b9421653f0",
                                "name": "Ac Anti-Gliadine IgG"
                            }
                        },
                        {
                            "uuid": "2c226179-38b1-4330-9186-5a42e648417c",
                            "result": "12",
                            "analysis": {
                                "uuid": "ae4ba11e-a53c-4c2b-ba0e-660e88739087",
                                "name": "Ac Anti Muscle"
                            }
                        },
                        {
                            "uuid": "02d7cf56-649e-4494-86d1-6bdf3bbeda5b",
                            "result": "12",
                            "analysis": {
                                "uuid": "57abb4ca-2388-4083-abfc-a4a09fae24b5",
                                "name": "Ac Antiphospholipides igG"
                            }
                        },
                        {
                            "uuid": "b05f4ff0-cf0d-43ef-9e3f-d3dbe67039ae",
                            "result": "12",
                            "analysis": {
                                "uuid": "7ac227ed-33d3-4d22-9b44-021c874ad649",
                                "name": "Ac Anti Tg"
                            }
                        }
                    ]
                }
            ],
            "appointmentData": [
                {
                    "uuid": "cc4c9c33-0728-40d1-acc4-1aa8f8b04413",
                    "name": "models",
                    "value": "{\"poids\":77,\"taille\":180,\"imc\":24,\"textField\":\"\",\"textField1\":\"\",\"textField2\":\"\"}",
                    "type": "models",
                    "isSharedWithPatient": false,
                    "modal": {
                        "uuid": "631b27e8-d7fe-4c86-a7dc-3e85065b4b67",
                        "label": "calcul",
                        "color": "#FEBD15",
                        "isEnabled": true,
                        "hasData": true,
                        "structure": [
                            {
                                "key": "General Practitioner",
                                "type": "fieldset",
                                "input": false,
                                "label": "Généraliste",
                                "legend": "Généraliste",
                                "tableView": false,
                                "components": [
                                    {
                                        "key": "poids",
                                        "mask": false,
                                        "type": "number",
                                        "input": true,
                                        "label": "Poids",
                                        "delimiter": false,
                                        "tableView": false,
                                        "customClass": "form-control-material",
                                        "description": "Kg",
                                        "inputFormat": "plain",
                                        "placeholder": "--",
                                        "requireDecimal": false
                                    },
                                    {
                                        "key": "taille",
                                        "mask": false,
                                        "type": "number",
                                        "input": true,
                                        "label": "Taille",
                                        "delimiter": false,
                                        "tableView": false,
                                        "customClass": "form-control-material",
                                        "description": "Cm",
                                        "inputFormat": "plain",
                                        "placeholder": "--",
                                        "requireDecimal": false
                                    },
                                    {
                                        "key": "imc",
                                        "mask": false,
                                        "type": "number",
                                        "input": true,
                                        "label": "IMC",
                                        "logic": [
                                            {
                                                "name": "calculIMC",
                                                "actions": [
                                                    {
                                                        "name": "calculIMC",
                                                        "type": "value",
                                                        "value": "value = data.poids / data.taille"
                                                    }
                                                ],
                                                "trigger": {
                                                    "type": "javascript",
                                                    "javascript": "result = (data['poids'].length > 0 && data['taille'].length > 0)"
                                                }
                                            }
                                        ],
                                        "delimiter": false,
                                        "tableView": false,
                                        "customClass": "form-control-material",
                                        "description": "Kg/m²",
                                        "inputFormat": "plain",
                                        "placeholder": "--",
                                        "requireDecimal": false
                                    }
                                ],
                                "customClass": "fieldset-specialty-formio"
                            }
                        ]
                    },
                    "data": {
                        "imc": 24,
                        "poids": 77,
                        "taille": 180,
                        "textField": "",
                        "textField1": "",
                        "textField2": ""
                    }
                },
                {
                    "uuid": "c58731ee-0321-4f2e-bb8c-9cd10e73f182",
                    "name": "notes",
                    "value": "deuxième consulations",
                    "type": "notes",
                    "isSharedWithPatient": false,
                    "modal": null,
                    "data": []
                },
                {
                    "uuid": "be60c6ab-8db7-4380-b47a-7b6c13cdfd14",
                    "name": "diagnostics",
                    "value": "deuxième diganostique",
                    "type": "diagnostics",
                    "isSharedWithPatient": false,
                    "modal": null,
                    "data": []
                },
                {
                    "uuid": "41cfed14-a5bb-4129-9947-8e367f93a3f3",
                    "name": "treatments",
                    "value": "deuxième tratement",
                    "type": "treatments",
                    "isSharedWithPatient": false,
                    "modal": null,
                    "data": []
                }
            ],
            "acts": [
                {
                    "price": 20,
                    "act_uuid": "a4260d31-8ffd-41cb-a15c-217f6c603ec4"
                },
                {
                    "price": 59,
                    "act_uuid": "3daf2051-d896-4955-b49a-cf9e93882a44"
                },
                {
                    "price": 12,
                    "act_uuid": "1ea1fde0-ecc8-40ed-a321-4ad24f3637c2"
                }
            ]
        },
        "documents": [
            {
                "uuid": "c575945e-3ee2-4758-8593-e6887b0fa8f6",
                "title": "prescription",
                "documentType": "prescription",
                "uri": "https://s3-med-core-develop.med.ovh/develop-private/medical-entity/e62a6592-1324-4827-b159-7e6b0d7e06b4/appointments/c9536fbb-b3de-41cc-9573-a65b50ee8994/prescriptions/def480c6-5b2e-4267-b560-2184da8e29ce.pdf?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=root%2F20221010%2Feu-east-1%2Fs3%2Faws4_request&X-Amz-Date=20221010T103126Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Signature=b5f59533be6d4a65d748bd21c93145528ccbf9857da49c51a83540ce6439a78f",
                "prescription": [
                    {
                        "uuid": "def480c6-5b2e-4267-b560-2184da8e29ce",
                        "global_note": "",
                        "patient": {
                            "uuid": "d15d9c2c-7614-4e5d-b68b-e9c3fa4a33cc",
                            "email": "",
                            "birthdate": "10-04-2002",
                            "firstName": "mr 5 rdv",
                            "lastName": "test",
                            "gender": "M",
                            "account": null,
                            "address": [],
                            "contact": [
                                {
                                    "uuid": "9939704d-2d01-4cd4-9447-2808a0d7c513",
                                    "value": "55555555",
                                    "type": "phone",
                                    "contactType": {
                                        "uuid": "5f8269fa-0f88-474e-92fe-eec0084b491f",
                                        "name": "Téléphone"
                                    },
                                    "isPublic": false,
                                    "isSupport": false,
                                    "isVerified": false,
                                    "description": null,
                                    "code": null
                                }
                            ],
                            "insurances": [],
                            "isParent": false
                        },
                        "prescription_has_drugs": [
                            {
                                "uuid": "3fb36926-7416-4464-8ec5-f78807ef0e71",
                                "note": "",
                                "duration": 1,
                                "duration_type": "days",
                                "standard_drug": {
                                    "uuid": "7cb2eeb5-ab52-410a-8995-4068962e367f",
                                    "commercial_name": "EDGAR 150mg Gél. Bt 60",
                                    "isVerified": true
                                },
                                "dosage": " 3 jours"
                            },
                            {
                                "uuid": "078c59a7-8c38-41a0-a405-cc22eeb599da",
                                "note": "",
                                "duration": 2,
                                "duration_type": "days",
                                "standard_drug": {
                                    "uuid": "0b3374d0-62b8-4209-8e2e-d5c528d0803f",
                                    "commercial_name": "TRIATEC  5mg Comp. Séc. Bt 28",
                                    "isVerified": true
                                },
                                "dosage": "3 JOURS"
                            }
                        ]
                    }
                ],
                "requested_Analyses": [],
                "certificate": [],
                "createdAt": "10-10-2022 09:32"
            },
            {
                "uuid": "09c4cdf6-bbd0-498d-86d1-d4920171202e",
                "title": "Certificate 10-10-2022",
                "documentType": "medical-certificate",
                "uri": "https://s3-med-core-develop.med.ovh/develop-private/medical-entity/e62a6592-1324-4827-b159-7e6b0d7e06b4/appointments/c9536fbb-b3de-41cc-9573-a65b50ee8994/certificates/68ec8bf1-52b5-4500-bde1-427bee6129f9.pdf?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=root%2F20221010%2Feu-east-1%2Fs3%2Faws4_request&X-Amz-Date=20221010T103126Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Signature=5b08800ce8726487cb7eccf45bf8d0ebc477a6840322c448fe119a080b9aa029",
                "prescription": [],
                "requested_Analyses": [],
                "certificate": [
                    {
                        "uuid": "68ec8bf1-52b5-4500-bde1-427bee6129f9",
                        "content": "Je soussigné, Dr TESTER 4 certifie avoir examiné ce  jour : mr 5 rdv test et que son etat de sante necessite un repos de 19 jour(s) a compter de ce jour, sauf complications ulterieures"
                    }
                ],
                "createdAt": "10-10-2022 09:32"
            },
            {
                "uuid": "9b8b2ffc-476f-4561-8d0e-715d91085196",
                "title": "requested-analysis",
                "documentType": "requested-analysis",
                "uri": "https://s3-med-core-develop.med.ovh/develop-private/medical-entity/e62a6592-1324-4827-b159-7e6b0d7e06b4/appointments/c9536fbb-b3de-41cc-9573-a65b50ee8994/requested-analysis/c3edc379-df8f-466a-bcdc-18d8223f1303.pdf?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=root%2F20221010%2Feu-east-1%2Fs3%2Faws4_request&X-Amz-Date=20221010T103126Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Signature=33dd7aa0d56b54b7cbea7609e67f22cb7f89dfe00294c46fdafad158d53c34e4",
                "prescription": [],
                "requested_Analyses": [
                    {
                        "uuid": "c3edc379-df8f-466a-bcdc-18d8223f1303",
                        "patient": {
                            "uuid": "d15d9c2c-7614-4e5d-b68b-e9c3fa4a33cc",
                            "email": "",
                            "birthdate": "10-04-2002",
                            "firstName": "mr 5 rdv",
                            "lastName": "test",
                            "gender": "M",
                            "account": null,
                            "address": [],
                            "contact": [
                                {
                                    "uuid": "9939704d-2d01-4cd4-9447-2808a0d7c513",
                                    "value": "55555555",
                                    "type": "phone",
                                    "contactType": {
                                        "uuid": "5f8269fa-0f88-474e-92fe-eec0084b491f",
                                        "name": "Téléphone"
                                    },
                                    "isPublic": false,
                                    "isSupport": false,
                                    "isVerified": false,
                                    "description": null,
                                    "code": null
                                }
                            ],
                            "insurances": [],
                            "isParent": false
                        },
                        "appointment": {
                            "uuid": "c9536fbb-b3de-41cc-9573-a65b50ee8994",
                            "type": {
                                "uuid": "4af3f837-0ed7-415e-b2cb-59bf922d4574",
                                "name": "Consultation",
                                "color": "#1BC47D",
                                "icon": "ic-consultation",
                                "code": 1
                            },
                            "dayDate": "10-10-2022",
                            "startTime": "10:30",
                            "endTime": "09:33",
                            "duration": 15,
                            "isVip": null,
                            "status": 5,
                            "instruction": "",
                            "consultationReason": {
                                "uuid": "6cb9ed7d-9a77-4ce5-9e40-fa24ddcccdec",
                                "name": "test",
                                "duration": 15,
                                "color": "#0696D6"
                            },
                            "createdAt": "10-10-2022 09:26",
                            "patient": {
                                "uuid": "d15d9c2c-7614-4e5d-b68b-e9c3fa4a33cc",
                                "email": "",
                                "birthdate": "10-04-2002",
                                "firstName": "mr 5 rdv",
                                "lastName": "test",
                                "gender": "M",
                                "contact": [
                                    {
                                        "uuid": "9939704d-2d01-4cd4-9447-2808a0d7c513",
                                        "value": "55555555",
                                        "type": "phone",
                                        "contactType": {
                                            "uuid": "5f8269fa-0f88-474e-92fe-eec0084b491f",
                                            "name": "Téléphone"
                                        },
                                        "isPublic": false,
                                        "isSupport": false,
                                        "isVerified": false,
                                        "description": null,
                                        "code": null
                                    }
                                ],
                                "antecedents": {
                                    "way_of_life": [
                                        {
                                            "uuid": "535b57f5-5f05-4a43-822d-aaec870345fa",
                                            "name": "Alcool",
                                            "startDate": "2010",
                                            "endDate": "",
                                            "ascendantOf": null
                                        },
                                        {
                                            "uuid": "c152bad7-a901-4ad6-95db-c542e4e62860",
                                            "name": "Tabac",
                                            "startDate": "2010",
                                            "endDate": "",
                                            "ascendantOf": null
                                        },
                                        {
                                            "uuid": "b5565961-7eaa-4e91-9791-5fcef270ac17",
                                            "name": "Drogue",
                                            "startDate": "",
                                            "endDate": "",
                                            "ascendantOf": null
                                        }
                                    ],
                                    "allergic": [
                                        {
                                            "uuid": "e3c40211-04a0-4135-adfe-e56eec24e635",
                                            "name": "Allergie aux protéines de lait de vache",
                                            "startDate": "2010",
                                            "endDate": "2014",
                                            "ascendantOf": null
                                        }
                                    ],
                                    "treatment": [],
                                    "family_antecedents": [
                                        {
                                            "uuid": "71fb9a0a-7d2c-4c8c-8d7a-07fdf57f7b75",
                                            "name": "Acrosyndrome paroxystique",
                                            "startDate": "",
                                            "endDate": null,
                                            "ascendantOf": ""
                                        },
                                        {
                                            "uuid": "db6cd272-ac71-4432-93a7-0a36090ad25d",
                                            "name": "Asthme",
                                            "startDate": "2000",
                                            "endDate": null,
                                            "ascendantOf": "father"
                                        }
                                    ],
                                    "surgical_antecedents": [
                                        {
                                            "uuid": "0775761f-08d9-4622-a422-be4b691e0848",
                                            "name": "Occlusion intestinale",
                                            "startDate": "2010",
                                            "endDate": "",
                                            "ascendantOf": null
                                        },
                                        {
                                            "uuid": "1470c0dc-0c95-4277-a90f-3b4ce0e89db7",
                                            "name": "Cholecystectomie",
                                            "startDate": "",
                                            "endDate": "",
                                            "ascendantOf": null
                                        }
                                    ]
                                }
                            },
                            "overlapEvent": false,
                            "PatientHasAgendaAppointment": false
                        },
                        "analyses": [
                            {
                                "uuid": "5b8359b5-684f-4664-b366-26b826c60874",
                                "name": "Ac Anti-Gliadine IgA"
                            },
                            {
                                "uuid": "737ed3af-55fa-41b2-998f-15b9421653f0",
                                "name": "Ac Anti-Gliadine IgG"
                            },
                            {
                                "uuid": "ae4ba11e-a53c-4c2b-ba0e-660e88739087",
                                "name": "Ac Anti Muscle"
                            },
                            {
                                "uuid": "57abb4ca-2388-4083-abfc-a4a09fae24b5",
                                "name": "Ac Antiphospholipides igG"
                            },
                            {
                                "uuid": "7ac227ed-33d3-4d22-9b44-021c874ad649",
                                "name": "Ac Anti Tg"
                            }
                        ]
                    }
                ],
                "certificate": [],
                "createdAt": "10-10-2022 09:32"
            }
        ]
    },
    {
        "appointment": {
            "uuid": "c724289e-1ca8-49c3-86f6-ca518f1faf31",
            "type": {
                "uuid": "4af3f837-0ed7-415e-b2cb-59bf922d4574",
                "name": "Consultation",
                "color": "#1BC47D",
                "icon": "ic-consultation",
                "code": 1
            },
            "dayDate": "10-10-2022",
            "startTime": "10:33",
            "endTime": "09:41",
            "duration": 15,
            "isVip": null,
            "status": 5,
            "consultationReason": {
                "uuid": "6cb9ed7d-9a77-4ce5-9e40-fa24ddcccdec",
                "name": "test",
                "duration": 15,
                "color": "#0696D6"
            },
            "treatments": [
                {
                    "uuid": "aa66fa18-5673-46a4-b516-e89ddeab55d8",
                    "standardDrugUuid": "97292793-0148-458d-a1f3-29bb7c1e4957",
                    "name": "equipement orthopédique",
                    "startDate": "10-10-2022",
                    "endDate": "17-10-2022",
                    "dosage": "14",
                    "duration": 7,
                    "durationType": "days",
                    "isOtherProfessional": false
                }
            ],
            "requestedAnalyses": [
                {
                    "uuid": "d839db15-011c-40ab-b537-136be7096343",
                    "hasAnalysis": [
                        {
                            "uuid": "79bcf31a-bc84-4286-8b71-63ff553b8704",
                            "result": null,
                            "analysis": {
                                "uuid": "4ab7e94f-fd82-4fdd-9756-735f54b492e8",
                                "name": "Ac Anti-Gliadine IgA"
                            }
                        },
                        {
                            "uuid": "78b0e3e9-84f8-4bfc-a386-c391850b4ea9",
                            "result": null,
                            "analysis": {
                                "uuid": "28f212b3-9fee-4b1f-bcd6-e5d9fcb92358",
                                "name": "Ac Anti-Gliadine IgG"
                            }
                        },
                        {
                            "uuid": "755a4b6d-6798-4cee-8630-42545c4ba526",
                            "result": null,
                            "analysis": {
                                "uuid": "b37550f1-6be4-4c0a-b912-168c1e421bbd",
                                "name": "Ac Anti Muscle"
                            }
                        },
                        {
                            "uuid": "741b5a0d-c1ca-467b-8a19-cd452b87c29a",
                            "result": null,
                            "analysis": {
                                "uuid": "5ec93ce9-9f1f-46d2-a557-b1edab52967c",
                                "name": "Ac Antiphospholipides igG"
                            }
                        },
                        {
                            "uuid": "d8fc2d65-c484-43f4-ba72-a82f746b5bdd",
                            "result": null,
                            "analysis": {
                                "uuid": "4a683526-fbb0-461f-af7e-02158dfcf6cf",
                                "name": "Ac Anti Tg"
                            }
                        }
                    ]
                }
            ],
            "appointmentData": [
                {
                    "uuid": "2d570b50-816b-4757-bae9-bc27730d0c46",
                    "name": "models",
                    "value": "{\"poids\":77,\"taille\":180,\"imc\":24,\"textField\":\"\",\"textField1\":\"\",\"textField2\":\"\"}",
                    "type": "models",
                    "isSharedWithPatient": false,
                    "modal": {
                        "uuid": "631b27e8-d7fe-4c86-a7dc-3e85065b4b67",
                        "label": "calcul",
                        "color": "#FEBD15",
                        "isEnabled": true,
                        "hasData": true,
                        "structure": [
                            {
                                "key": "General Practitioner",
                                "type": "fieldset",
                                "input": false,
                                "label": "Généraliste",
                                "legend": "Généraliste",
                                "tableView": false,
                                "components": [
                                    {
                                        "key": "poids",
                                        "mask": false,
                                        "type": "number",
                                        "input": true,
                                        "label": "Poids",
                                        "delimiter": false,
                                        "tableView": false,
                                        "customClass": "form-control-material",
                                        "description": "Kg",
                                        "inputFormat": "plain",
                                        "placeholder": "--",
                                        "requireDecimal": false
                                    },
                                    {
                                        "key": "taille",
                                        "mask": false,
                                        "type": "number",
                                        "input": true,
                                        "label": "Taille",
                                        "delimiter": false,
                                        "tableView": false,
                                        "customClass": "form-control-material",
                                        "description": "Cm",
                                        "inputFormat": "plain",
                                        "placeholder": "--",
                                        "requireDecimal": false
                                    },
                                    {
                                        "key": "imc",
                                        "mask": false,
                                        "type": "number",
                                        "input": true,
                                        "label": "IMC",
                                        "logic": [
                                            {
                                                "name": "calculIMC",
                                                "actions": [
                                                    {
                                                        "name": "calculIMC",
                                                        "type": "value",
                                                        "value": "value = data.poids / data.taille"
                                                    }
                                                ],
                                                "trigger": {
                                                    "type": "javascript",
                                                    "javascript": "result = (data['poids'].length > 0 && data['taille'].length > 0)"
                                                }
                                            }
                                        ],
                                        "delimiter": false,
                                        "tableView": false,
                                        "customClass": "form-control-material",
                                        "description": "Kg/m²",
                                        "inputFormat": "plain",
                                        "placeholder": "--",
                                        "requireDecimal": false
                                    }
                                ],
                                "customClass": "fieldset-specialty-formio"
                            }
                        ]
                    },
                    "data": {
                        "imc": 24,
                        "poids": 77,
                        "taille": 180,
                        "textField": "",
                        "textField1": "",
                        "textField2": ""
                    }
                },
                {
                    "uuid": "87bf8599-198f-4c21-bee6-24f575921fc4",
                    "name": "notes",
                    "value": "note 3",
                    "type": "notes",
                    "isSharedWithPatient": false,
                    "modal": null,
                    "data": []
                },
                {
                    "uuid": "7608601a-8944-4e5c-b1c6-b88aa32ba445",
                    "name": "diagnostics",
                    "value": "diag 3",
                    "type": "diagnostics",
                    "isSharedWithPatient": false,
                    "modal": null,
                    "data": []
                },
                {
                    "uuid": "2f0f8899-6cc7-41de-81ab-54a66b0475ff",
                    "name": "treatments",
                    "value": "traitement 3",
                    "type": "treatments",
                    "isSharedWithPatient": false,
                    "modal": null,
                    "data": []
                }
            ],
            "acts": [
                {
                    "price": 20,
                    "act_uuid": "a4260d31-8ffd-41cb-a15c-217f6c603ec4"
                },
                {
                    "price": 59,
                    "act_uuid": "3daf2051-d896-4955-b49a-cf9e93882a44"
                },
                {
                    "price": 0,
                    "act_uuid": "5bbd41d9-7d26-4935-bc0c-93837d5f9a73"
                }
            ]
        },
        "documents": [
            {
                "uuid": "b4b7016c-4e40-4635-954e-f55edbca95ec",
                "title": "prescription",
                "documentType": "prescription",
                "uri": "https://s3-med-core-develop.med.ovh/develop-private/medical-entity/e62a6592-1324-4827-b159-7e6b0d7e06b4/appointments/c724289e-1ca8-49c3-86f6-ca518f1faf31/prescriptions/65d494eb-47e5-4b77-9165-78fa9726ca9d.pdf?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=root%2F20221010%2Feu-east-1%2Fs3%2Faws4_request&X-Amz-Date=20221010T103126Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Signature=571913fb7fb0f3e2318b67babf0e2f02b526a0bfca9abe14d0e882b9ef644627",
                "prescription": [
                    {
                        "uuid": "65d494eb-47e5-4b77-9165-78fa9726ca9d",
                        "global_note": "",
                        "patient": {
                            "uuid": "d15d9c2c-7614-4e5d-b68b-e9c3fa4a33cc",
                            "email": "",
                            "birthdate": "10-04-2002",
                            "firstName": "mr 5 rdv",
                            "lastName": "test",
                            "gender": "M",
                            "account": null,
                            "address": [],
                            "contact": [
                                {
                                    "uuid": "9939704d-2d01-4cd4-9447-2808a0d7c513",
                                    "value": "55555555",
                                    "type": "phone",
                                    "contactType": {
                                        "uuid": "5f8269fa-0f88-474e-92fe-eec0084b491f",
                                        "name": "Téléphone"
                                    },
                                    "isPublic": false,
                                    "isSupport": false,
                                    "isVerified": false,
                                    "description": null,
                                    "code": null
                                }
                            ],
                            "insurances": [],
                            "isParent": false
                        },
                        "prescription_has_drugs": []
                    }
                ],
                "requested_Analyses": [],
                "certificate": [],
                "createdAt": "10-10-2022 09:37"
            },
            {
                "uuid": "5058bdf9-2896-4205-8cef-b21d4655d582",
                "title": "prescription",
                "documentType": "prescription",
                "uri": "https://s3-med-core-develop.med.ovh/develop-private/medical-entity/e62a6592-1324-4827-b159-7e6b0d7e06b4/appointments/c724289e-1ca8-49c3-86f6-ca518f1faf31/prescriptions/40e69afc-e13b-4130-bf01-c2eacb4c0032.pdf?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=root%2F20221010%2Feu-east-1%2Fs3%2Faws4_request&X-Amz-Date=20221010T103126Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Signature=7fd3ebd0dcbe4bb50cbe869786fb21860256f5d74a6a9bbe5761ba437914df36",
                "prescription": [
                    {
                        "uuid": "40e69afc-e13b-4130-bf01-c2eacb4c0032",
                        "global_note": "",
                        "patient": {
                            "uuid": "d15d9c2c-7614-4e5d-b68b-e9c3fa4a33cc",
                            "email": "",
                            "birthdate": "10-04-2002",
                            "firstName": "mr 5 rdv",
                            "lastName": "test",
                            "gender": "M",
                            "account": null,
                            "address": [],
                            "contact": [
                                {
                                    "uuid": "9939704d-2d01-4cd4-9447-2808a0d7c513",
                                    "value": "55555555",
                                    "type": "phone",
                                    "contactType": {
                                        "uuid": "5f8269fa-0f88-474e-92fe-eec0084b491f",
                                        "name": "Téléphone"
                                    },
                                    "isPublic": false,
                                    "isSupport": false,
                                    "isVerified": false,
                                    "description": null,
                                    "code": null
                                }
                            ],
                            "insurances": [],
                            "isParent": false
                        },
                        "prescription_has_drugs": [
                            {
                                "uuid": "aa66fa18-5673-46a4-b516-e89ddeab55d8",
                                "note": "",
                                "duration": 7,
                                "duration_type": "days",
                                "standard_drug": {
                                    "uuid": "97292793-0148-458d-a1f3-29bb7c1e4957",
                                    "commercial_name": "equipement orthopédique",
                                    "isVerified": false
                                },
                                "dosage": "14"
                            }
                        ]
                    }
                ],
                "requested_Analyses": [],
                "certificate": [],
                "createdAt": "10-10-2022 09:38"
            },
            {
                "uuid": "289e6920-339c-4aac-9764-f1fd52106a25",
                "title": "requested-analysis",
                "documentType": "requested-analysis",
                "uri": "https://s3-med-core-develop.med.ovh/develop-private/medical-entity/e62a6592-1324-4827-b159-7e6b0d7e06b4/appointments/c724289e-1ca8-49c3-86f6-ca518f1faf31/requested-analysis/d839db15-011c-40ab-b537-136be7096343.pdf?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=root%2F20221010%2Feu-east-1%2Fs3%2Faws4_request&X-Amz-Date=20221010T103126Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Signature=5b07b4b1722f50be4e08dbbd525b452eae059e4456ce649b6e4222d8fcbde6da",
                "prescription": [],
                "requested_Analyses": [
                    {
                        "uuid": "d839db15-011c-40ab-b537-136be7096343",
                        "patient": {
                            "uuid": "d15d9c2c-7614-4e5d-b68b-e9c3fa4a33cc",
                            "email": "",
                            "birthdate": "10-04-2002",
                            "firstName": "mr 5 rdv",
                            "lastName": "test",
                            "gender": "M",
                            "account": null,
                            "address": [],
                            "contact": [
                                {
                                    "uuid": "9939704d-2d01-4cd4-9447-2808a0d7c513",
                                    "value": "55555555",
                                    "type": "phone",
                                    "contactType": {
                                        "uuid": "5f8269fa-0f88-474e-92fe-eec0084b491f",
                                        "name": "Téléphone"
                                    },
                                    "isPublic": false,
                                    "isSupport": false,
                                    "isVerified": false,
                                    "description": null,
                                    "code": null
                                }
                            ],
                            "insurances": [],
                            "isParent": false
                        },
                        "appointment": {
                            "uuid": "c724289e-1ca8-49c3-86f6-ca518f1faf31",
                            "type": {
                                "uuid": "4af3f837-0ed7-415e-b2cb-59bf922d4574",
                                "name": "Consultation",
                                "color": "#1BC47D",
                                "icon": "ic-consultation",
                                "code": 1
                            },
                            "dayDate": "10-10-2022",
                            "startTime": "10:33",
                            "endTime": "09:41",
                            "duration": 15,
                            "isVip": null,
                            "status": 5,
                            "instruction": "",
                            "consultationReason": {
                                "uuid": "6cb9ed7d-9a77-4ce5-9e40-fa24ddcccdec",
                                "name": "test",
                                "duration": 15,
                                "color": "#0696D6"
                            },
                            "createdAt": "10-10-2022 09:26",
                            "patient": {
                                "uuid": "d15d9c2c-7614-4e5d-b68b-e9c3fa4a33cc",
                                "email": "",
                                "birthdate": "10-04-2002",
                                "firstName": "mr 5 rdv",
                                "lastName": "test",
                                "gender": "M",
                                "contact": [
                                    {
                                        "uuid": "9939704d-2d01-4cd4-9447-2808a0d7c513",
                                        "value": "55555555",
                                        "type": "phone",
                                        "contactType": {
                                            "uuid": "5f8269fa-0f88-474e-92fe-eec0084b491f",
                                            "name": "Téléphone"
                                        },
                                        "isPublic": false,
                                        "isSupport": false,
                                        "isVerified": false,
                                        "description": null,
                                        "code": null
                                    }
                                ],
                                "antecedents": {
                                    "way_of_life": [
                                        {
                                            "uuid": "535b57f5-5f05-4a43-822d-aaec870345fa",
                                            "name": "Alcool",
                                            "startDate": "2010",
                                            "endDate": "",
                                            "ascendantOf": null
                                        },
                                        {
                                            "uuid": "c152bad7-a901-4ad6-95db-c542e4e62860",
                                            "name": "Tabac",
                                            "startDate": "2010",
                                            "endDate": "",
                                            "ascendantOf": null
                                        },
                                        {
                                            "uuid": "b5565961-7eaa-4e91-9791-5fcef270ac17",
                                            "name": "Drogue",
                                            "startDate": "",
                                            "endDate": "",
                                            "ascendantOf": null
                                        }
                                    ],
                                    "allergic": [
                                        {
                                            "uuid": "e3c40211-04a0-4135-adfe-e56eec24e635",
                                            "name": "Allergie aux protéines de lait de vache",
                                            "startDate": "2010",
                                            "endDate": "2014",
                                            "ascendantOf": null
                                        }
                                    ],
                                    "treatment": [],
                                    "family_antecedents": [
                                        {
                                            "uuid": "71fb9a0a-7d2c-4c8c-8d7a-07fdf57f7b75",
                                            "name": "Acrosyndrome paroxystique",
                                            "startDate": "",
                                            "endDate": null,
                                            "ascendantOf": ""
                                        },
                                        {
                                            "uuid": "db6cd272-ac71-4432-93a7-0a36090ad25d",
                                            "name": "Asthme",
                                            "startDate": "2000",
                                            "endDate": null,
                                            "ascendantOf": "father"
                                        }
                                    ],
                                    "surgical_antecedents": [
                                        {
                                            "uuid": "0775761f-08d9-4622-a422-be4b691e0848",
                                            "name": "Occlusion intestinale",
                                            "startDate": "2010",
                                            "endDate": "",
                                            "ascendantOf": null
                                        },
                                        {
                                            "uuid": "1470c0dc-0c95-4277-a90f-3b4ce0e89db7",
                                            "name": "Cholecystectomie",
                                            "startDate": "",
                                            "endDate": "",
                                            "ascendantOf": null
                                        }
                                    ]
                                }
                            },
                            "overlapEvent": false,
                            "PatientHasAgendaAppointment": false
                        },
                        "analyses": [
                            {
                                "uuid": "4ab7e94f-fd82-4fdd-9756-735f54b492e8",
                                "name": "Ac Anti-Gliadine IgA"
                            },
                            {
                                "uuid": "28f212b3-9fee-4b1f-bcd6-e5d9fcb92358",
                                "name": "Ac Anti-Gliadine IgG"
                            },
                            {
                                "uuid": "b37550f1-6be4-4c0a-b912-168c1e421bbd",
                                "name": "Ac Anti Muscle"
                            },
                            {
                                "uuid": "5ec93ce9-9f1f-46d2-a557-b1edab52967c",
                                "name": "Ac Antiphospholipides igG"
                            },
                            {
                                "uuid": "4a683526-fbb0-461f-af7e-02158dfcf6cf",
                                "name": "Ac Anti Tg"
                            }
                        ]
                    }
                ],
                "certificate": [],
                "createdAt": "10-10-2022 09:41"
            }
        ]
    },
    {
        "appointment": {
            "uuid": "31a91856-625a-4e2b-8267-f8183d13f612",
            "type": {
                "uuid": "4af3f837-0ed7-415e-b2cb-59bf922d4574",
                "name": "Consultation",
                "color": "#1BC47D",
                "icon": "ic-consultation",
                "code": 1
            },
            "dayDate": "10-10-2022",
            "startTime": "10:42",
            "endTime": "09:44",
            "duration": 15,
            "isVip": null,
            "status": 5,
            "consultationReason": null,
            "treatments": [
                {
                    "uuid": "6ef9c426-6f1b-4bc7-9bcf-a24206c421b8",
                    "standardDrugUuid": "b25a4865-e28a-4ea4-9752-6beaf31034f1",
                    "name": "ZENEXOR  LP 75mg Gél. à Liberation Prolongée Bt 30",
                    "startDate": "10-10-2022",
                    "endDate": "11-10-2022",
                    "dosage": "1cp",
                    "duration": 1,
                    "durationType": "days",
                    "isOtherProfessional": false
                },
                {
                    "uuid": "d6f95d4a-5bb7-432d-ac67-46e3377ce56d",
                    "standardDrugUuid": "7cb2eeb5-ab52-410a-8995-4068962e367f",
                    "name": "EDGAR 150mg Gél. Bt 60",
                    "startDate": "10-10-2022",
                    "endDate": "15-10-2022",
                    "dosage": "1cp",
                    "duration": 5,
                    "durationType": "days",
                    "isOtherProfessional": false
                }
            ],
            "requestedAnalyses": [],
            "appointmentData": [
                {
                    "uuid": "f5a22562-25c5-4427-9a1b-26a5c27152cd",
                    "name": "models",
                    "value": "{\"poids\":77,\"taille\":180,\"imc\":24,\"textField\":\"\",\"textField1\":\"\",\"textField2\":\"\"}",
                    "type": "models",
                    "isSharedWithPatient": false,
                    "modal": {
                        "uuid": "631b27e8-d7fe-4c86-a7dc-3e85065b4b67",
                        "label": "calcul",
                        "color": "#FEBD15",
                        "isEnabled": true,
                        "hasData": true,
                        "structure": [
                            {
                                "key": "General Practitioner",
                                "type": "fieldset",
                                "input": false,
                                "label": "Généraliste",
                                "legend": "Généraliste",
                                "tableView": false,
                                "components": [
                                    {
                                        "key": "poids",
                                        "mask": false,
                                        "type": "number",
                                        "input": true,
                                        "label": "Poids",
                                        "delimiter": false,
                                        "tableView": false,
                                        "customClass": "form-control-material",
                                        "description": "Kg",
                                        "inputFormat": "plain",
                                        "placeholder": "--",
                                        "requireDecimal": false
                                    },
                                    {
                                        "key": "taille",
                                        "mask": false,
                                        "type": "number",
                                        "input": true,
                                        "label": "Taille",
                                        "delimiter": false,
                                        "tableView": false,
                                        "customClass": "form-control-material",
                                        "description": "Cm",
                                        "inputFormat": "plain",
                                        "placeholder": "--",
                                        "requireDecimal": false
                                    },
                                    {
                                        "key": "imc",
                                        "mask": false,
                                        "type": "number",
                                        "input": true,
                                        "label": "IMC",
                                        "logic": [
                                            {
                                                "name": "calculIMC",
                                                "actions": [
                                                    {
                                                        "name": "calculIMC",
                                                        "type": "value",
                                                        "value": "value = data.poids / data.taille"
                                                    }
                                                ],
                                                "trigger": {
                                                    "type": "javascript",
                                                    "javascript": "result = (data['poids'].length > 0 && data['taille'].length > 0)"
                                                }
                                            }
                                        ],
                                        "delimiter": false,
                                        "tableView": false,
                                        "customClass": "form-control-material",
                                        "description": "Kg/m²",
                                        "inputFormat": "plain",
                                        "placeholder": "--",
                                        "requireDecimal": false
                                    }
                                ],
                                "customClass": "fieldset-specialty-formio"
                            }
                        ]
                    },
                    "data": {
                        "imc": 24,
                        "poids": 77,
                        "taille": 180,
                        "textField": "",
                        "textField1": "",
                        "textField2": ""
                    }
                }
            ],
            "acts": []
        },
        "documents": [
            {
                "uuid": "b8f52b2e-edb4-4101-8447-74a614993d28",
                "title": "prescription",
                "documentType": "prescription",
                "uri": "https://s3-med-core-develop.med.ovh/develop-private/medical-entity/e62a6592-1324-4827-b159-7e6b0d7e06b4/appointments/31a91856-625a-4e2b-8267-f8183d13f612/prescriptions/e8cf77d8-ec1f-4eae-88d4-a60af047b92a.pdf?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=root%2F20221010%2Feu-east-1%2Fs3%2Faws4_request&X-Amz-Date=20221010T103126Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Signature=21f9aec33934d7eefb88fbbfdab8eda51931b1a968d02d491ef92f6a1052543d",
                "prescription": [
                    {
                        "uuid": "e8cf77d8-ec1f-4eae-88d4-a60af047b92a",
                        "global_note": "",
                        "patient": {
                            "uuid": "d15d9c2c-7614-4e5d-b68b-e9c3fa4a33cc",
                            "email": "",
                            "birthdate": "10-04-2002",
                            "firstName": "mr 5 rdv",
                            "lastName": "test",
                            "gender": "M",
                            "account": null,
                            "address": [],
                            "contact": [
                                {
                                    "uuid": "9939704d-2d01-4cd4-9447-2808a0d7c513",
                                    "value": "55555555",
                                    "type": "phone",
                                    "contactType": {
                                        "uuid": "5f8269fa-0f88-474e-92fe-eec0084b491f",
                                        "name": "Téléphone"
                                    },
                                    "isPublic": false,
                                    "isSupport": false,
                                    "isVerified": false,
                                    "description": null,
                                    "code": null
                                }
                            ],
                            "insurances": [],
                            "isParent": false
                        },
                        "prescription_has_drugs": [
                            {
                                "uuid": "6ef9c426-6f1b-4bc7-9bcf-a24206c421b8",
                                "note": "",
                                "duration": 1,
                                "duration_type": "days",
                                "standard_drug": {
                                    "uuid": "b25a4865-e28a-4ea4-9752-6beaf31034f1",
                                    "commercial_name": "ZENEXOR  LP 75mg Gél. à Liberation Prolongée Bt 30",
                                    "isVerified": true
                                },
                                "dosage": "1cp"
                            },
                            {
                                "uuid": "d6f95d4a-5bb7-432d-ac67-46e3377ce56d",
                                "note": "",
                                "duration": 5,
                                "duration_type": "days",
                                "standard_drug": {
                                    "uuid": "7cb2eeb5-ab52-410a-8995-4068962e367f",
                                    "commercial_name": "EDGAR 150mg Gél. Bt 60",
                                    "isVerified": true
                                },
                                "dosage": "1cp"
                            }
                        ]
                    }
                ],
                "requested_Analyses": [],
                "certificate": [],
                "createdAt": "10-10-2022 09:43"
            }
        ]
    }
]

function FilesPanel({ ...props }) {
    const { t, previousAppointments} = props
    console.log(previousAppointments);
    const [filter, setfilter] = useState<any>({});
    const [collapse, setCollapse] = useState<any>('');
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setfilter({
            ...filter,
            [event.target.name]: event.target.checked,
        });

    }
    return (
        <PanelStyled>
            <Box className="files-panel">
                <Typography fontWeight={600} gutterBottom>
                    {t('tabs.filter')}
                </Typography>
                <Paper className='filter'>
                    <FormGroup row>
                        {
                            filterData.map((item: any, idx: number) =>
                                <FormControlLabel
                                    key={idx}
                                    control={
                                        <Checkbox checked={filter[item]} onChange={handleChange}
                                            name={filter[item]} />
                                    }
                                    label={t("tabs." + item)}
                                />
                            )
                        }

                    </FormGroup>
                </Paper>
                <Typography fontWeight={600}>
                    {t("tabs.history")}
                </Typography>
                <Stack spacing={2}>
                    {apps.map((app: any) => (
                        <PatientHistoryCard t={t} key={app.appointment.uuid} data={app} appuuid={app.appointment.uuid}>
                            <MotifCard data={app} {...{t}} />
                            <List dense>
                                {
                                    subMotifCard.map((col: any, idx: number) => (
                                        <React.Fragment key={`list-item-${idx}`}>
                                            <>
                                                <ListItem
                                                    onClick={() => setCollapse(collapse === col.id ? "" : col.id)}
                                                    sx={{
                                                        cursor: "pointer",
                                                        borderTop: 1,
                                                        borderColor: 'divider',
                                                        px: 0,
                                                        '& .MuiListItemIcon-root': {
                                                            minWidth: 20,
                                                            svg: {
                                                                width: 14,
                                                                height: 14,
                                                            }
                                                        }
                                                    }}>
                                                    <ListItemIcon>
                                                        <IconUrl path={col.icon} />
                                                    </ListItemIcon>
                                                    <Typography variant='body2' fontWeight={700}>
                                                        {t(col.title)}
                                                    </Typography>
                                                    <IconButton size="small" sx={{ ml: 'auto' }}>
                                                        <IconUrl path="ic-expand-more" />
                                                    </IconButton>
                                                </ListItem>

                                                <ListItem sx={{ p: 0 }}>
                                                    <Collapse in={collapse === col.id} sx={{ width: 1 }}>
                                                        {col.type === "treatment" && app.appointment.treatments.map((treatment: any, idx: number) => (
                                                            <Box key={`list-treatement-${idx}`} sx={{
                                                                bgcolor: theme => theme.palette.grey['A100'],
                                                                mb: 1,
                                                                padding: 2,
                                                                borderRadius: 0.7
                                                            }}>
                                                                <p style={{
                                                                    margin: 0,
                                                                    fontSize: 13
                                                                }}>{treatment.name}</p>
                                                                <p style={{
                                                                    margin: 0,
                                                                    color: 'gray',
                                                                    fontSize: 12,
                                                                    marginLeft: 15
                                                                }}>• {treatment.dosage}</p>
                                                                <p style={{
                                                                    margin: 0,
                                                                    color: 'gray',
                                                                    fontSize: 12,
                                                                    marginLeft: 15
                                                                }}>• {treatment.duration} {t(treatment.durationType)}</p>
                                                            </Box>
                                                        ))}
                                                        {col.type === "treatment" && app.appointment.treatments.length == 0 &&
                                                            <p style={{
                                                                fontSize: 12,
                                                                color: "gray",
                                                                textAlign: "center"
                                                            }}>Aucun traitement</p>}

                                                        {col.type === "req-sheet" && app?.appointment.requestedAnalyses.map((reqSheet: any, idx: number) => (
                                                            <Box key={`req-sheet-item-${idx}`} sx={{
                                                                bgcolor: theme => theme.palette.grey['A100'],
                                                                mb: 1,
                                                                padding: 2,
                                                                borderRadius: 0.7
                                                            }}>
                                                                {reqSheet.hasAnalysis.map((rs: any, idx: number) => (
                                                                    <p key={`req-sheet-p-${idx}`}
                                                                        style={{
                                                                            margin: 0,
                                                                            fontSize: 12
                                                                        }}>{rs.analysis.name} : {rs.result ? rs.result : ' --'}</p>
                                                                ))}
                                                            </Box>
                                                        ))}
                                                        {col.type === "req-sheet" && app.appointment.requestedAnalyses.length == 0 &&
                                                            <p style={{
                                                                fontSize: 12,
                                                                color: "gray",
                                                                textAlign: "center"
                                                            }}>Aucune demande</p>}

                                                        {
                                                            col.type === "document" && app.documents.length > 0 &&
                                                            <Box style={{ padding: 20, paddingTop: 25 }}>
                                                                <Grid container spacing={2} sx={{
                                                                    bgcolor: theme => theme.palette.grey['A100'],
                                                                    mb: 1,
                                                                    padding: 2,
                                                                    borderRadius: 0.7
                                                                }}>
                                                                    {
                                                                        app.documents.map((card: any) =>
                                                                            <Grid item xs={3}
                                                                                key={`doc-item-${card.uuid}`}>
                                                                                <DocumentCard
                                                                                    data={card}
                                                                                    style={{ width: 30 }}
                                                                                    t={t}
                                                                                />

                                                                            </Grid>
                                                                        )
                                                                    }
                                                                </Grid>
                                                            </Box>
                                                        }


                                                        {
                                                            col.type === "document" && (app.documents === null || app.documents.length === 0) &&
                                                            <p style={{
                                                                fontSize: 12,
                                                                color: "gray",
                                                                textAlign: "center"
                                                            }}>Aucun document</p>
                                                        }
                                                    </Collapse>
                                                </ListItem>
                                            </>
                                        </React.Fragment>
                                    ))
                                }
                            </List>
                        </PatientHistoryCard>
                    ))}
                </Stack>
            </Box>
        </PanelStyled>
    )
}

export default FilesPanel
