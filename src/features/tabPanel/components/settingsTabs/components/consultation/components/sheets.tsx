import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { configSelector } from "@features/base";
import { Box, Button, Drawer, IconButton, Stack, Theme, Toolbar, Typography, useMediaQuery, useTheme, } from "@mui/material";
import { RootStyled } from "@features/toolbar";
import { useRouter } from "next/router";
import { useAppSelector } from "@lib/redux/hooks";
import { Otable } from "@features/table";
import { PfTemplateDetail } from "@features/pfTemplateDetail";
import { useRequestQueryMutation } from "@lib/axios";
import AddIcon from "@mui/icons-material/Add";
import { MobileContainer } from "@themes/mobileContainer";
import { DesktopContainer } from "@themes/desktopConainter";
import { FileTemplateMobileCard } from "@features/card";
import { Dialog } from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import { useInvalidateQueries, useMedicalProfessionalSuffix } from "@lib/hooks";
import { LoadingButton } from "@mui/lab";
import Icon from "@themes/urlIcon";
import { useSnackbar } from "notistack";
import { useWidgetModels } from "@lib/hooks/rest";
import Can from "@features/casl/can";
import { CustomIconButton } from "@features/buttons";
import IconUrl from "@themes/urlIcon";

function PatientFileTemplates() {
    const theme: Theme = useTheme();
    const router = useRouter();
    const isMobile = useMediaQuery("(max-width:669px)");
    const { urlMedicalProfessionalSuffix } = useMedicalProfessionalSuffix();
    const { enqueueSnackbar } = useSnackbar();
    const { models, modelsMutate } = useWidgetModels({
        filter: !isMobile
            ? `?page=${router.query.page || 1}&limit=10&withPagination=true&sort=true`
            : "?sort=true"
    });
    const { trigger: invalidateQueries } = useInvalidateQueries();

    const { t, ready, i18n } = useTranslation("settings", { keyPrefix: "templates.config" });
    const { direction } = useAppSelector(configSelector);

    const [displayedItems, setDisplayedItems] = useState(10);
    const [state, setState] = useState({ active: true, });
    const [action, setAction] = useState("");
    const [data, setData] = useState<ModalModel | null>(null);

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
            id: "active",
            numeric: false,
            disablePadding: false,
            label: "active",
            align: "center",
            sortable: false,
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
    const [rows, setRows] = useState<ModalModel[]>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const { trigger: triggerTemplateUpdate } = useRequestQueryMutation("/settings/patient-file-template/update");
    const { trigger: triggerTemplateDelete } = useRequestQueryMutation("/settings/patient-file-template/delete");

    const handleScroll = () => {
        const total = (models as ModalModel[]).length;
        if (window.innerHeight + window.scrollY > document.body.offsetHeight - 50) {
            if (total > displayedItems) {
                setDisplayedItems(displayedItems + 10);
            }
            if (total - displayedItems < 10) {
                setDisplayedItems(total);
            }
        }
    };

    const handleChange = (props: ModalModel) => {
        props.isEnabled = !props.isEnabled;
        setState({ ...state });
        const form = new FormData();
        form.append("enabled", props.isEnabled.toString());
        triggerTemplateUpdate({
            method: "PATCH",
            url: `${urlMedicalProfessionalSuffix}/modals/${props.uuid}/activity/${router.locale}`,
            data: form
        }, {
            onSuccess: () => invalidateQueries([`${urlMedicalProfessionalSuffix}/modals/${router.locale}`])
        });
    }

    const handleEdit = (props: ModalModel, event: string, value?: string) => {
        switch (event) {
            case "see":
                setOpen(true);
                setAction(event);
                setData(props);
                break;
            case "edit":
                setOpen(true);
                setAction(event);
                setData(props);
                break;
            case "delete":
                setData(props);
                setOpenDialog(true);
                break;
            default:
                break;
        }
    };

    const closeDraw = () => {
        setOpen(false);
    };

    const removeModal = (uuid: string) => {
        setLoading(true);
        triggerTemplateDelete({
            method: "DELETE",
            url: `${urlMedicalProfessionalSuffix}/modals/${uuid}/${router.locale}`
        }, {
            onSuccess: () => {
                enqueueSnackbar(t("alert.modal-deleted"), { variant: "success" });
                setOpenDialog(false);
                setTimeout(() => setLoading(false));
                modelsMutate();
                invalidateQueries([`${urlMedicalProfessionalSuffix}/modals/${router.locale}`]);
            }
        });
    };


    useEffect(() => {
        if (models !== undefined) {
            if (isMobile) {
                setRows((models as ModalModel[]));
            } else {
                setRows((models as ModalModelPagination).list);
            }
        }
    }, [isMobile, models]);

    useEffect(() => {
        // Add scroll listener
        if (isMobile) {
            let promise = new Promise(function (resolve) {
                document.body.style.overflow = "hidden";
                setTimeout(() => {
                    window.addEventListener("scroll", handleScroll);
                    resolve(true);
                }, 2000);
            });
            promise.then(() => {
                return (document.body.style.overflow = "visible");
            });
        }
        return () => window.removeEventListener("scroll", handleScroll);
    }, [models, displayedItems]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        //reload resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["settings"]);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <>

            <Box className="container">
                <DesktopContainer>
                    <Otable
                        headers={headCells}
                        toolbar={
                            <Stack mb={3} direction="row" alignItems="center" justifyContent="space-between">
                                <Typography variant="subtitle1" fontWeight={600}>{t("title")}</Typography>
                                <Can I={"manage"} a={"settings"} field={"settings__patient-file-templates__create"}>
                                    <CustomIconButton
                                        onClick={() => {
                                            setOpen(true);
                                            setData(null);
                                            setAction("add");
                                        }}
                                        color="primary">
                                        <IconUrl path="ic-plus" width={16} height={16} color="white" />
                                    </CustomIconButton>
                                </Can>
                            </Stack>}
                        rows={rows}
                        state={state}
                        from={"template"}
                        t={t}
                        edit={handleEdit}
                        handleConfig={null}
                        handleChange={handleChange}
                        total={(models as ModalModelPagination)?.total}
                        totalPages={(models as ModalModelPagination)?.totalPages}
                        pagination
                    />
                </DesktopContainer>
                <MobileContainer>
                    <Stack spacing={1}>
                        {rows?.slice(0, displayedItems).map((row, idx) => (
                            <React.Fragment key={idx}>
                                <FileTemplateMobileCard
                                    data={row}
                                    edit={handleEdit}
                                    handleChange={handleChange}
                                />
                            </React.Fragment>
                        ))}
                    </Stack>
                </MobileContainer>
                <Drawer
                    anchor={"right"}
                    open={open}
                    dir={direction}
                    onClose={closeDraw}>
                    {data && (
                        <Toolbar sx={{ bgcolor: theme.palette.common.white }}>
                            <Stack alignItems="flex-end" width={1}>
                                <IconButton onClick={closeDraw} disableRipple>
                                    <CloseIcon />
                                </IconButton>
                            </Stack>
                        </Toolbar>
                    )}

                    <PfTemplateDetail {...{
                        action,
                        mutate: modelsMutate,
                        closeDraw,
                        data
                    }} />
                </Drawer>
            </Box>
            <Dialog
                action="delete-modal"
                title={t("delete-dialog-title")}
                open={openDialog}
                size="sm"
                data={{ t }}
                color={theme.palette.error.main}
                actionDialog={
                    <Stack direction="row" spacing={1}>
                        <Button
                            onClick={() => {
                                setLoading(false);
                                setOpenDialog(false);
                            }}
                            startIcon={<CloseIcon />}>
                            {t("cancel")}
                        </Button>
                        <LoadingButton
                            variant="contained"
                            loading={loading}
                            color="error"
                            onClick={() => removeModal(data?.uuid as string)}
                            startIcon={<Icon path="setting/icdelete" color="white" />}>
                            {t("delete")}
                        </LoadingButton>
                    </Stack>
                }
            />
        </>
    );
}


export default PatientFileTemplates;

