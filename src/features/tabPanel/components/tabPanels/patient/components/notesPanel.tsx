import {AppBar, Box, Button, CardContent, Grid, Skeleton, Stack, Toolbar, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import IconUrl from "@themes/urlIcon";
import React, {useState} from "react";
import PanelCardStyled from "./overrides/panelCardStyled";
import {useRouter} from "next/router";
import {useRequestQueryMutation} from "@lib/axios";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {useMedicalEntitySuffix} from "@lib/hooks";

function NotesPanel({...props}) {
    const {t, patient, mutatePatientDetails, loading} = props;
    const router = useRouter();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [editable, setEditable] = useState(false);
    const [requestLoading, setRequestLoading] = useState(false);
    const [notes, setNotes] = useState(patient && patient.note ? patient.note : "");

    const {trigger: triggerPatientUpdate} = useRequestQueryMutation("/patient/notes/update");

    const uploadPatientNotes = () => {
        setRequestLoading(true);
        const params = new FormData();
        if (patient) {
            params.append('attribute', 'note');
            params.append('value', notes);

            medicalEntityHasUser && triggerPatientUpdate({
                method: "PATCH",
                url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/${router.locale}`,
                data: params,
            }, {
                onSuccess: () => {
                    setRequestLoading(false);
                    mutatePatientDetails();
                }
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
