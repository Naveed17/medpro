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
            "uuid": "ab668f8d-f0e3-48f7-a24e-a5cc38c3c062",
            "type": {
                "uuid": "4af3f837-0ed7-415e-b2cb-59bf922d4574",
                "name": "Consultation",
                "color": "#1BC47D",
                "icon": "ic-consultation",
                "code": 1
            },
            "dayDate": "06-10-2022",
            "startTime": "17:46",
            "endTime": "16:52",
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
                    "uuid": "c9958ed3-8ca5-4818-ab17-f64f1991943d",
                    "standardDrugUuid": "f329e2e8-7797-403d-8526-a3f36e5adb69",
                    "name": "CONNETTIVINA PLUS Crème Derm. Tb 25gr",
                    "startDate": "06-10-2022",
                    "endDate": "11-10-2022",
                    "dosage": "2",
                    "duration": 5,
                    "durationType": "days",
                    "isOtherProfessional": false
                }
            ],
            "requestedAnalyses": [],
            "appointmentData": [
                {
                    "uuid": "738c1976-e834-4d50-a96e-77b67565b366",
                    "name": "models",
                    "value": "{\"poids\":90,\"taille\":189,\"tensionArterielle\":1221}",
                    "type": "models",
                    "isSharedWithPatient": false,
                    "modal": {
                        "uuid": "98e241b4-24a1-4a95-aa73-f3d615d341c6",
                        "label": "Yuuu",
                        "color": "#526686",
                        "isEnabled": false,
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
                                        "key": "tensionArterielle",
                                        "mask": false,
                                        "type": "number",
                                        "input": true,
                                        "label": "Tension artérielle",
                                        "delimiter": false,
                                        "tableView": false,
                                        "customClass": "form-control-material",
                                        "description": " mmHg ",
                                        "inputFormat": "plain",
                                        "placeholder": "--/--",
                                        "requireDecimal": false
                                    }
                                ],
                                "customClass": "fieldset-specialty-formio"
                            }
                        ]
                    },
                    "data": {
                        "poids": 90,
                        "taille": 189,
                        "tensionArterielle": 1221
                    }
                }
            ],
            "acts": []
        },
        "documents": [
            {
                "uuid": "dc474f45-9ebc-4624-9fef-18bbf54a153b",
                "title": "Certificate 06-10-2022",
                "documentType": "medical-certificate",
                "uri": "https://s3-med-core-develop.med.ovh/develop-private/medical-entity/e62a6592-1324-4827-b159-7e6b0d7e06b4/appointments/ab668f8d-f0e3-48f7-a24e-a5cc38c3c062/certificates/ae3f1ea6-b25e-4e32-9335-388b51585a26.pdf?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=root%2F20221007%2Feu-east-1%2Fs3%2Faws4_request&X-Amz-Date=20221007T140309Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Signature=8c2e336bb2381937081b2eb79a3c2d5e9d25beffd286578da1a68f8331a0aaa5",
                "prescription": [],
                "requested_Analyses": [],
                "certificate": [],
                "createdAt": "06-10-2022 16:21"
            },
            {
                "uuid": "4fd35e6b-9d66-4d3e-ae87-a710c7fbf919",
                "title": "Certificate 06-10-2022",
                "documentType": "medical-certificate",
                "uri": "https://s3-med-core-develop.med.ovh/develop-private/medical-entity/e62a6592-1324-4827-b159-7e6b0d7e06b4/appointments/ab668f8d-f0e3-48f7-a24e-a5cc38c3c062/certificates/3f9a0306-9104-45a6-8d9a-acd18335ef10.pdf?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=root%2F20221007%2Feu-east-1%2Fs3%2Faws4_request&X-Amz-Date=20221007T140309Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Signature=985af389ad17d6440b75d0d445adbd7f11bb281b5fd6f54ff28fe2c9be78d1ef",
                "prescription": [],
                "requested_Analyses": [],
                "certificate": [
                    {
                        "uuid": "3f9a0306-9104-45a6-8d9a-acd18335ef10",
                        "content": "Je soussigné, Dr TESTER 4 certifie avoir examiné ce  jour : Imed Neifar et que son etat de sante necessite un repos de 19 jour(s) a compter de ce jour, sauf complications ulterieures"
                    }
                ],
                "createdAt": "06-10-2022 16:49"
            },
            {
                "uuid": "e7eb182b-52fe-4f01-a0b9-e81de483ba0e",
                "title": "prescription",
                "documentType": "prescription",
                "uri": "https://s3-med-core-develop.med.ovh/develop-private/medical-entity/e62a6592-1324-4827-b159-7e6b0d7e06b4/appointments/ab668f8d-f0e3-48f7-a24e-a5cc38c3c062/prescriptions/0a6715d6-e66a-4e8c-ae8b-af2b8de70e8f.pdf?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=root%2F20221007%2Feu-east-1%2Fs3%2Faws4_request&X-Amz-Date=20221007T140309Z&X-Amz-SignedHeaders=host&X-Amz-Expires=900&X-Amz-Signature=d075a10652197c439886355b9f69692c481c20052e26473361a34fa08ddc0461",
                "prescription": [
                    {
                        "uuid": "0a6715d6-e66a-4e8c-ae8b-af2b8de70e8f",
                        "global_note": "",
                        "patient": {
                            "uuid": "5edca04b-1244-48ec-ac07-80383a4a292b",
                            "email": "",
                            "birthdate": "27-03-1991",
                            "firstName": "Imed",
                            "lastName": "Neifar",
                            "gender": "M",
                            "account": null,
                            "address": [],
                            "contact": [
                                {
                                    "uuid": "dd090820-e462-4faf-8c84-935a61b3fd14",
                                    "value": "21226222",
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
                                "uuid": "c9958ed3-8ca5-4818-ab17-f64f1991943d",
                                "note": "",
                                "duration": 5,
                                "duration_type": "days",
                                "standard_drug": {
                                    "uuid": "f329e2e8-7797-403d-8526-a3f36e5adb69",
                                    "commercial_name": "CONNETTIVINA PLUS Crème Derm. Tb 25gr",
                                    "isVerified": true
                                },
                                "dosage": "2"
                            }
                        ]
                    }
                ],
                "requested_Analyses": [],
                "certificate": [],
                "createdAt": "06-10-2022 17:00"
            }
        ]
    },



    {
        "appointment": {
            "uuid": "71d34f40-475f-48cc-b8d8-7c190a941a28",
            "type": {
                "uuid": "4af3f837-0ed7-415e-b2cb-59bf922d4574",
                "name": "Consultation",
                "color": "#1BC47D",
                "icon": "ic-consultation",
                "code": 1
            },
            "dayDate": "06-10-2022",
            "startTime": "19:17",
            "endTime": "19:32",
            "duration": 15,
            "isVip": null,
            "status": 5,
            "consultationReason": null,
            "treatments": [],
            "requestedAnalyses": [],
            "appointmentData": [
                {
                    "uuid": "995bfd6b-8dd5-4f04-aad8-ae048525ac41",
                    "name": "models",
                    "value": "{\"poids\":90,\"taille\":189,\"tensionArterielle\":1221}",
                    "type": "models",
                    "isSharedWithPatient": false,
                    "modal": {
                        "uuid": "98e241b4-24a1-4a95-aa73-f3d615d341c6",
                        "label": "Yuuu",
                        "color": "#526686",
                        "isEnabled": false,
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
                                        "key": "tensionArterielle",
                                        "mask": false,
                                        "type": "number",
                                        "input": true,
                                        "label": "Tension artérielle",
                                        "delimiter": false,
                                        "tableView": false,
                                        "customClass": "form-control-material",
                                        "description": " mmHg ",
                                        "inputFormat": "plain",
                                        "placeholder": "--/--",
                                        "requireDecimal": false
                                    }
                                ],
                                "customClass": "fieldset-specialty-formio"
                            }
                        ]
                    },
                    "data": {
                        "poids": 90,
                        "taille": 189,
                        "tensionArterielle": 1221
                    }
                }
            ],
            "acts": []
        },
        "documents": []
    },

]
function FilesPanel({ ...props }) {
    const { t } = props
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
                            <MotifCard data={app} />
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