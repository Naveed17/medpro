import {useTranslation} from "next-i18next";
import {
    Typography,
    Button,
    Stack,
    useMediaQuery,
    useTheme,
    IconButton,
} from "@mui/material";
import {useCallback} from "react";
import AddIcon from "@mui/icons-material/Add";

import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {tableActionSelector} from "@features/table";
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import {setDuplicated} from "@features/duplicateDetected";

import {LoadingScreen} from "@features/loadingScreen";


function PatientToolbar({...props}) {
    const {onAddPatient, mutatePatient} = props;
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    const {t, ready} = useTranslation("patient");
    const {tableState: {rowsSelected}} = useAppSelector(tableActionSelector);

    const onPatientDrawer = useCallback(() => {
        onAddPatient();
    }, [onAddPatient]);

    if (!ready)
        return (
            <LoadingScreen
                button
                text={"loading-error"}
            />
        );

    return (
        <>
            <Stack
                direction="row"
                justifyContent="space-between"
                width={1}
                alignItems="center">
                <Typography variant="subtitle2" color="text.primary">
                    {t("sub-header.title")}
                </Typography>
                {isDesktop && (
                    <Stack direction={"row"} spacing={1.2}>
                        {rowsSelected.length > 1 && <Button
                            onClick={(event) => {
                                event.stopPropagation();
                                const duplications = [...rowsSelected];
                                const firstElement = duplications.shift();
                                dispatch(setDuplicated({
                                    duplications,
                                    duplicationSrc: firstElement,
                                    duplicationInit: firstElement,
                                    openDialog: true,
                                    mutate: mutatePatient
                                }));
                            }}
                            variant="contained"
                            color="primary"
                            sx={{ml: "auto"}}
                            startIcon={<ArchiveRoundedIcon/>}>
                            {t("sub-header.merge-patient")}
                        </Button>}
                        <IconButton
                            onClick={onPatientDrawer}
                            color="primary"
                            sx={{ml: "auto","&.MuiIconButton-root":{bgcolor:theme.palette.primary.main,"&.MuiIconButton-colorPrimary:hover":{bgcolor:theme.palette.primary.main}}}}
                            >
                            <AddIcon sx={{color:'common.white'}}/>
                        </IconButton>
                    </Stack>

                )}
            </Stack>
        </>
    );
}

export default PatientToolbar;
