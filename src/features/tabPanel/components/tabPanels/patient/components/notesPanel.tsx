import {
    AppBar, Box, Button, Card, CardContent, Grid, Skeleton,
    Stack, Toolbar, Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import IconUrl from "@themes/urlIcon";
import React, {useState} from "react";
import NotesPanelStyled from "./overrides/notesPanelStyled";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {Session} from "next-auth";
import {useRequestMutation} from "@app/axios";

function NotesPanel({...props}) {
    const {t, patient, loading} = props;
    const {data: session} = useSession();
    const router = useRouter();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const [editable, setEditable] = useState(false);
    const [requestLoading, setRequestLoading] = useState(false);
    const [notes, setNotes] = useState(loading && patient.note ? patient.note : "");

    const {trigger: triggerPatientUpdate} = useRequestMutation(null, "/patient/update/notes");

    const uploadPatientNotes = () => {
        setRequestLoading(true);
        const params = new FormData();
        if (patient) {
            params.append('first_name', patient.firstName);
            params.append('last_name', patient.lastName);
            params.append('phone', JSON.stringify(patient.contact));
            params.append('gender', patient.gender);
            params.append('note', notes);

            triggerPatientUpdate({
                method: "PUT",
                url: `/api/medical-entity/${medical_entity.uuid}/patients/${patient?.uuid}/${router.locale}`,
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                },
                data: params,
            }).then(() => {
                setRequestLoading(false);
            });
        }
    }

    return (
        <NotesPanelStyled>
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
                            <Box sx={{display: {xs: 'none', md: 'flex'}}}>
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
                            </Box>
                        </Toolbar>
                    </AppBar>
                    <Grid container spacing={1.2}>
                        <Grid item md={12} sm={12} xs={12}>
                            <textarea
                                rows={6}
                                onChange={(event) => setNotes(event.target.value)}
                                placeholder={t("add-patient.notes-placeholder")}
                                readOnly={!editable}
                                defaultValue={notes}/>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </NotesPanelStyled>
    )
}

export default NotesPanel;
