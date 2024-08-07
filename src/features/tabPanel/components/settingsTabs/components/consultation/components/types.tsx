import React, { useEffect, useState } from "react";
import { configSelector, dashLayoutSelector } from "@features/base";
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Drawer,
    Stack,
    Theme,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import { useTranslation } from "next-i18next";
import { MotifTypeDialog } from "@features/motifTypeDialog";
import { SubHeader } from "@features/subHeader";
import { useAppSelector } from "@lib/redux/hooks";
import { Otable } from "@features/table";
import { useRequestQuery, useRequestQueryMutation } from "@lib/axios";
import { useRouter } from "next/router";
import { DesktopContainer } from "@themes/desktopConainter";
import { MobileContainer } from "@themes/mobileContainer";
import { MotifTypeCard } from "@features/card";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import Icon from "@themes/urlIcon";
import CloseIcon from '@mui/icons-material/Close';
import { useMedicalEntitySuffix } from "@lib/hooks";
import { ReactQueryNoValidateConfig } from "@lib/axios/useRequestQuery";
import Can from "@features/casl/can";
import { CustomIconButton } from "@features/buttons";
import IconUrl from "@themes/urlIcon";

function ConsultationType() {
    const theme: Theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();

    const { t, ready, i18n } = useTranslation(["settings", "common"], { keyPrefix: "motifType.config" });
    const { direction } = useAppSelector(configSelector);
    const { medicalEntityHasUser } = useAppSelector(dashLayoutSelector);

    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState<ConsultationReasonModel[]>([]);
    const [displayedItems, setDisplayedItems] = useState(10);
    const [edit, setEdit] = useState(false);
    const [selected, setSelected] = useState<any>();
    const [open, setOpen] = useState(false);

    const headCells = [
        {
            id: "name",
            numeric: false,
            disablePadding: true,
            label: "name",
            align: "left",
            sortable: true,
        },
        {
            id: "empty_1",
            numeric: false,
            disablePadding: true,
            label: "empty",
            align: "left",
            sortable: false,
        },
        {
            id: "empty_2",
            numeric: false,
            disablePadding: true,
            label: "empty",
            align: "left",
            sortable: false,
        },

        {
            id: "fees",
            numeric: false,
            disablePadding: true,
            label: "consultation_fees",
            align: "center",
            sortable: true,
        },

        {
            id: "action",
            numeric: false,
            disablePadding: false,
            label: "action",
            align: "right",
            sortable: false,
        },
    ];

    const { trigger: triggerTypeDelete } = useRequestQueryMutation("/settings/type/delete");

    const {
        data: appointmentTypesResponse,
        mutate: mutateAppointmentTypes
    } = useRequestQuery(medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/appointments/types/${router.locale}`
    } : null, {
        ...ReactQueryNoValidateConfig,
        ...(medicalEntityHasUser && { variables: { query: !isMobile ? `?page=${router.query.page || 1}&limit=10&withPagination=true&sort=true` : "?sort=true" } })
    });

    const removeAppointmentType = (uuid: any) => {
        setLoading(true)
        medicalEntityHasUser && triggerTypeDelete({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/appointments/types/${uuid}/${router.locale}`
        }, {
            onSuccess: () => {
                enqueueSnackbar(t("alert.delete-reasonType"), { variant: "success" });
                setLoading(false);
                setTimeout(() => setOpen(false));
                mutateAppointmentTypes();
            }
        });
    }

    const handleScroll = () => {
        const total = (appointmentTypesResponse as HttpResponse)?.data.length;
        if (window.innerHeight + window.scrollY > document.body.offsetHeight - 50) {
            if (total > displayedItems) {
                setDisplayedItems(displayedItems + 10);
            }
            if (total - displayedItems < 10) {
                setDisplayedItems(total);
            }
        }
    }

    const closeDraw = () => {
        setEdit(false);
    }

    const editMotif = (props: any, event: string) => {
        setSelected(props);
        if (event === "edit" || event === "add") {
            setEdit(true);

        }
        if (event === "delete") {
            setOpen(true);
        }
    }

    useEffect(() => {
        if (appointmentTypesResponse !== undefined) {
            if (isMobile) {
                setRows((appointmentTypesResponse as HttpResponse).data);
            } else {
                setRows((appointmentTypesResponse as HttpResponse).data?.list);
            }
        }
    }, [appointmentTypesResponse]);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        // Add scroll listener
        if (isMobile) {
            let promise = new Promise((resolve) => {
                document.body.style.overflow = "hidden";
                setTimeout(() => {
                    window.addEventListener("scroll", handleScroll);
                    resolve(true);
                }, 2000);
            });
            promise.then(() => {
                return (document.body.style.overflow = "visible");
            });

            return () => window.removeEventListener("scroll", handleScroll);
        }
    }, [appointmentTypesResponse, displayedItems]); // eslint-disable-line react-hooks/exhaustive-deps


    useEffect(() => {
        //reload resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["settings", "common"]);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <>
            <DesktopContainer>
                <Box
                    sx={{
                        p: { xs: "40px 8px", sm: "30px 8px", md: 2 },
                        "& table": { tableLayout: "fixed" },
                    }}>
                    <Otable
                        headers={headCells}
                        rows={rows}
                        toolbar={
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                width={1}
                                mb={3}
                                alignItems="center">
                                <Typography color="text.primary" variant="subtitle1" fontWeight={600}>{t("title")}</Typography>
                                <Can I={"manage"} a={"settings"} field={"settings__consultation-type__create"}>
                                    <CustomIconButton
                                        color="primary"
                                        onClick={() => editMotif(null, "add")}
                                        sx={{ ml: "auto" }}>
                                        <IconUrl path={'ic-plus'} width={16} height={16} color="white" />
                                    </CustomIconButton>
                                </Can>
                            </Stack>
                        }
                        from={"consultation-type"}
                        pagination
                        t={t}
                        edit={editMotif}
                        total={(appointmentTypesResponse as HttpResponse)?.data?.total}
                        totalPages={(appointmentTypesResponse as HttpResponse)?.data?.totalPages}
                    />
                </Box>
            </DesktopContainer>
            <MobileContainer>
                <Container>
                    <Box pt={3.7}>
                        {rows?.slice(0, displayedItems).map((row, idx) => (
                            <React.Fragment key={idx}>
                                <MotifTypeCard t={t} data={row} handleDrawer={editMotif} />
                            </React.Fragment>
                        ))}
                    </Box>
                </Container>
            </MobileContainer>
            <Drawer anchor={"right"} open={edit} dir={direction} onClose={closeDraw}>
                <MotifTypeDialog
                    data={selected}
                    mutateEvent={mutateAppointmentTypes}
                    closeDraw={closeDraw}
                />
            </Drawer>
            <Dialog
                PaperProps={{
                    sx: {
                        width: "100%"
                    }
                }} maxWidth="sm" open={open}>
                <DialogTitle sx={{
                    bgcolor: (theme: Theme) => theme.palette.error.main,
                    px: 1,
                    py: 2,

                }}>
                    {t("dialog.title")}
                </DialogTitle>
                <DialogContent style={{ paddingTop: 20 }}>
                    <Typography>
                        {t("dialog.desc")}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ borderTop: 1, borderColor: "divider", px: 1, py: 2 }}>
                    <Stack direction="row" spacing={1}>
                        <Button
                            onClick={() => {

                                setOpen(false);
                            }}
                            startIcon={<CloseIcon />}>
                            {t("dialog.cancel")}
                        </Button>
                        <LoadingButton
                            variant="contained"
                            loading={loading}
                            color="error"
                            onClick={() => removeAppointmentType(selected?.uuid as any)}
                            startIcon={<Icon path="setting/icdelete" color="white" />}>
                            {t("dialog.delete")}
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    );
}


export default ConsultationType;

