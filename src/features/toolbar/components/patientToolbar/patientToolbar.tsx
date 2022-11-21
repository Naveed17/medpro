import {useTranslation} from "next-i18next";
import {Typography, Button, Stack} from "@mui/material";
import {useCallback} from "react";
import AddIcon from '@mui/icons-material/Add';
import {LoadingScreen} from "@features/loadingScreen";

function PatientToolbar({...props}) {
    const {onAddPatient} = props;
    const {t, ready} = useTranslation("patient");

    const onPatientDrawer = useCallback(() => {
        onAddPatient()
    }, [onAddPatient]);

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);
    return (
        <>
            <Stack
                direction="row"
                justifyContent="space-between"
                width={1}
                alignItems="center"
            >
                <Typography variant="subtitle2" color="text.primary">
                    {t("sub-header.title")}
                </Typography>
                <Button
                    onClick={onPatientDrawer}
                    variant="contained"
                    color="success"
                    sx={{ml: "auto"}}
                    startIcon={<AddIcon/>}
                >
                    {t("sub-header.add-patient")}
                </Button>
            </Stack>
        </>
    );
}

export default PatientToolbar;
