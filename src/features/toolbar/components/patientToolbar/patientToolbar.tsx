import { useTranslation } from "next-i18next";
import {
    Typography,
    Button,
    Stack,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { tableActionSelector } from "@features/table";
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import { setDuplicated } from "@features/duplicateDetected";
import { LoadingScreen } from "@features/loadingScreen";
import AgendaAddViewIcon from "@themes/overrides/icons/agendaAddViewIcon";
import { CustomIconButton } from "@features/buttons";
import Can from "@features/casl/can";
import { agendaSelector, setNavigatorMode } from "@features/calendar";
import IconUrl from "@themes/urlIcon";
import { ToggleButtonStyled } from "@features/toolbar";

function PatientToolbar({ ...props }) {
    const { onAddPatient, mutatePatient } = props;
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

    const { t, ready } = useTranslation("patient");
    const { tableState: { rowsSelected } } = useAppSelector(tableActionSelector);
    const { mode } = useAppSelector(agendaSelector);

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
                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                    {t("sub-header.title")}
                </Typography>
                <Stack direction={"row"} spacing={1.2}>
                    <ToggleButtonStyled
                        id="toggle-button"
                        value="toggle"
                        onClick={() => dispatch(setNavigatorMode(mode === "normal" ? "discreet" : "normal"))}
                        className={"toggle-button"}
                        sx={{
                            ...(mode !== "normal" && { border: "none" }),
                            background: mode !== "normal" ? theme.palette.primary.main : theme.palette.grey['A500']
                        }}>
                        <IconUrl width={19} height={19}
                            path={"ic-eye-slash"} {...(mode !== "normal" && { color: "white" })} />
                    </ToggleButtonStyled>
                    {isDesktop && (
                        <Stack direction={"row"} spacing={1.2}>
                            <Can I={"manage"} a={"patients"} field={"patients__patient__merge"}>
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
                                    sx={{ ml: "auto" }}
                                    startIcon={<ArchiveRoundedIcon />}>
                                    {t("sub-header.merge-patient")}
                                </Button>}
                            </Can>
                            <Can I={"manage"} a={"patients"} field={"patients__patient__create"}>
                                <CustomIconButton
                                    onClick={onPatientDrawer}
                                    variant="filled"
                                    sx={{ p: .6 }}
                                    color={"primary"}
                                    size={"small"}>
                                    <AgendaAddViewIcon />
                                </CustomIconButton>
                            </Can>
                        </Stack>
                    )}
                </Stack>
            </Stack>
        </>
    );
}

export default PatientToolbar;
