import {AppBar, Box, Button, CardContent, Grid, Skeleton, Stack, Toolbar, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import IconUrl from "@themes/urlIcon";
import React, {useState} from "react";
import PanelCardStyled from "./overrides/panelCardStyled";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {Session} from "next-auth";
import {useRequestMutation} from "@lib/axios";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {useMedicalEntitySuffix} from "@lib/hooks";

function NotesPanel({...props}) {
    const {t, patient, mutatePatientDetails, loading} = props;
    const {data: session} = useSession();
    const router = useRouter();
    const urlMedicalEntitySuffix = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const [editable, setEditable] = useState(false);
    const [requestLoading, setRequestLoading] = useState(false);
    const [notes, setNotes] = useState(patient && patient.note ? patient.note : "");

    const {trigger: triggerPatientUpdate} = useRequestMutation(null, "/patient/update/notes");

    const uploadPatientNotes = () => {
        setRequestLoading(true);
        const params = new FormData();
        if (patient) {
            params.append('first_name', patient.firstName);
            params.append('last_name', patient.lastName);
            params.append('phone', JSON.stringify(patient.contact));
            params.append('gender', patient.gender === 'M' ? '1' : '2');
            params.append('note', notes);
            patient.email && params.append('email', patient.email);
            patient.familyDoctor && params.append('family_doctor', patient.familyDoctor);
            patient.profession && params.append('profession', patient.profession);
            patient.birthdate && params.append('birthdate', patient.birthdate);
            patient.idCard && params.append('id_card', patient.idCard);
            patient.nationality && params.append('nationality', patient.nationality.uuid);
            patient?.address && patient?.address.length > 0 && patient?.address[0].city && params.append('country', patient?.address[0]?.city?.country?.uuid);
            patient?.address && patient?.address.length > 0 && patient?.address[0].city && params.append('region', patient?.address[0]?.city?.uuid);
            patient?.address && patient?.address.length > 0 && patient?.address[0].city && params.append('zip_code', patient?.address[0]?.postalCode);
            patient?.address && patient?.address.length > 0 && patient?.address[0].street && params.append('address', JSON.stringify({
                fr: patient?.address[0]?.street
            }));

            medicalEntityHasUser && triggerPatientUpdate({
                method: "PUT",
                url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/${router.locale}`,
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                },
                data: params,
            }).then(() => {
                setRequestLoading(false);
                mutatePatientDetails();
            });
        }
    }

    return (
        <PanelCardStyled>
            <CardContent>
                <Grid container>
                    <AppBar position="static" color={"transparent"} className={"app-bar-header"}>
                        <Toolbar variant="dense">
                            <Box sx={{flexGrow: 1}}>
                                <Typography
                                    variant="body1"
                                    sx={{fontWeight: "bold"}}
                                    gutterBottom>
                                    {loading ? (
                                        <Skeleton variant="text" sx={{maxWidth: 200}}/>
                                    ) : (
                                        t("add-patient.notes")
                                    )}
                                </Typography>
                            </Box>
                            {editable ?
                                <Stack direction={"row"} spacing={2} mt={1} justifyContent='flex-end'>
                                    <Button onClick={() => setEditable(false)}
                                            color={"error"}
                                            className='btn-cancel'
                                            sx={{margin: 'auto'}}
                                            size='small'
                                            startIcon={<CloseIcon/>}>
                                        {t('add-patient.cancel')}
                                    </Button>
                                    <LoadingButton
                                        loading={requestLoading}
                                        onClick={() => {
                                            setEditable(false);
                                            uploadPatientNotes();
                                        }}
                                        className='btn-add'
                                        sx={{margin: 'auto'}}
                                        size='small'
                                        startIcon={<SaveAsIcon/>}>
                                        {t('add-patient.register')}
                                    </LoadingButton>
                                </Stack>
                                :
                                <Button onClick={() => setEditable(true)}
                                        startIcon={<IconUrl path={"setting/edit"}/>}
                                        color="primary" size="small">
                                    {t("add-patient.edit")}
                                </Button>
                            }
                        </Toolbar>
                    </AppBar>
                    <Grid container spacing={1.2}>
                        <Grid item md={12} sm={12} xs={12}>
                            <textarea
                                rows={6}
                                onChange={(event) => setNotes(event.target.value)}
                                placeholder={t("add-patient.notes-placeholder")}
                                disabled={!editable}
                                defaultValue={notes}/>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </PanelCardStyled>
    )
}

export default NotesPanel;
