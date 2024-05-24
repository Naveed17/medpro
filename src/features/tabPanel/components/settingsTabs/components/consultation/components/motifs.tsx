import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { KeyboardEvent, lazy, ReactElement, Suspense, useEffect, useRef, useState, } from "react";
import { configSelector, DashLayout, dashLayoutSelector } from "@features/base";
import {
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Drawer, FormControl, InputAdornment,
    Stack, TextField,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import CloseIcon from '@mui/icons-material/Close';
import { EditMotifDialog } from "@features/dialog";
import { SubHeader } from "@features/subHeader";
import { useAppSelector } from "@lib/redux/hooks";
import { Otable } from "@features/table";
import { useRequestQuery, useRequestQueryMutation } from "@lib/axios";
import { useRouter } from "next/router";
import { useDateConverture, useMedicalEntitySuffix } from "@lib/hooks";
import { DesktopContainer } from "@themes/desktopConainter";
import { MobileContainer } from "@themes/mobileContainer";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import Icon from "@themes/urlIcon";
import { ReactQueryNoValidateConfig } from "@lib/axios/useRequestQuery";
import Can from "@features/casl/can";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { debounce } from "lodash";
import { CustomIconButton } from "@features/buttons";
import IconUrl from "@themes/urlIcon";

const MotifListMobile = lazy(
    (): any => import("@features/card/components/motifListMobile/motifListMobile")
);

function Motif() {
    const theme: Theme = useTheme();
    const router = useRouter();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();
    const inputRef = useRef<HTMLInputElement>(null);

    const { direction } = useAppSelector(configSelector);
    const { medicalEntityHasUser } = useAppSelector(dashLayoutSelector);
    const { t, ready, i18n } = useTranslation(["settings", "common"], { keyPrefix: "motif.config", });

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const durations = useDateConverture(15, 240);
    const delay = useDateConverture(1440, 21600);
    const [displayedItems, setDisplayedItems] = useState(10);
    const [edit, setEdit] = useState(false);
    const [state, setState] = useState({
        duration: true,
        delay_min: true,
        delay_max: true,
        isEnabled: true,
    });
    const [selected, setSelected] = useState<null | any>();
    const [searchName, setSearchName] = useState<null | any>(null);

    const { trigger: triggerMotifUpdate } = useRequestQueryMutation("/settings/motif/update");
    const { trigger: triggerMotifDelete } = useRequestQueryMutation("/settings/motif/delete");

    const { data: httpConsultReasonResponse, mutate: mutateConsultReason } = useRequestQuery(medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/consultation-reasons/${router.locale}`
    } : null, {
        ...ReactQueryNoValidateConfig,
        ...(medicalEntityHasUser && { variables: { query: !isMobile ? `?page=${router.query.page || 1}&limit=10&withPagination=true&sort=true${searchName ? `&name=${searchName}` : ''}` : "?sort=true" } })
    });

    const reasons = (httpConsultReasonResponse as HttpResponse)?.data?.list as ConsultationReasonModel[];
    const reasonsMobile = isMobile ? ((httpConsultReasonResponse as HttpResponse)?.data as ConsultationReasonModel[]) : [];

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
            id: "duration",
            numeric: true,
            disablePadding: false,
            label: "duration",
            align: "left",
            sortable: true
        },
        {
            id: "isEnabled",
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

    const closeDraw = () => {
        setEdit(false);
    }

    const handleChange = (props: any, event: string, value: string) => {
        const form = new FormData();

        switch (event) {
            case "active":
                props.isEnabled = !props.isEnabled;
                if (!props.isEnabled) {
                    state.isEnabled = false;
                    setState({ ...state });
                }
                form.append(
                    "attribute",
                    JSON.stringify({ attribute: "isEnable", value: props.isEnabled })
                );
                break;
            case "duration":
                props.duration = value;
                form.append(
                    "attribute",
                    JSON.stringify({ attribute: "duration", value })
                );
                break;
            case "min":
                props.minimumDelay = value;
                form.append(
                    "attribute",
                    JSON.stringify({ attribute: "minimumDelay", value })
                );
                break;
            case "max":
                props.maximumDelay = value;
                form.append(
                    "attribute",
                    JSON.stringify({ attribute: "maximumDelay", value })
                );
                break;
            default:
                break;
        }

        medicalEntityHasUser && triggerMotifUpdate({
            method: "PATCH",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/consultation-reasons/${props.uuid}/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                mutateConsultReason();
                enqueueSnackbar(t("updated"), { variant: "success" });
            },
            onSettled: () => setTimeout(() => {
                closeSnackbar();
            }, 1000)
        });
    };

    const handleConfig = (props: any, event: string) => {
        // @ts-ignore
        state[event] = !state[event];
        setState({ ...state });
    };

    const editMotif = (props: any, event: string) => {
        setSelected(props);
        if (event === "add") {
            setEdit(true);
        }
        if (event === "edit") {
            setEdit(true);
        }

        if (event === "delete") {
            setOpen(true);
        }
    };

    const removeReason = (uuid: any) => {
        setLoading(true);
        medicalEntityHasUser && triggerMotifDelete({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/consultation-reasons/${uuid}/${router.locale}`
        }, {
            onSuccess: () => {
                enqueueSnackbar(t("alert.delete-reason"), { variant: "success" });
                setLoading(false);
                setTimeout(() => setOpen(false));
                mutateConsultReason();
            }
        });
    };

    const handleScroll = () => {
        const total = (httpConsultReasonResponse as HttpResponse)?.data.length;
        if (window.innerHeight + window.scrollY > document.body.offsetHeight - 50) {
            setLoading(true);
            if (total > displayedItems) {
                setDisplayedItems(displayedItems + 10);
            }
            if (total - displayedItems < 10) {
                setDisplayedItems(total);
            }
            if (total === displayedItems) {
                setLoading(false);
            }
        }
    };

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchName(event.target.value);
    }

    const debouncedOnChange = debounce(handleOnChange, 500);

    useEffect(() => {
        // Add scroll listener
        let promise = new Promise((resolve) => {
            document.body.style.overflow = "hidden";
            setTimeout(() => {
                window.addEventListener("scroll", handleScroll);
                resolve(true);
            }, 2000);
        });
        promise.then(() => {
            setLoading(false);
            return (document.body.style.overflow = "visible");
        });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [httpConsultReasonResponse, displayedItems]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        //reload resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["settings", "common"]);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <>
            <SubHeader>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    width={1}
                    alignItems="center">
                    <Typography color="text.primary">{t("path")}</Typography>
                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                        <FormControl
                            component="form"
                            fullWidth
                            onSubmit={e => e.preventDefault()}>
                            <TextField
                                className={'search-input'}
                                sx={{
                                    '& .MuiInputBase-root': {
                                        padding: 0,
                                    }
                                }}
                                fullWidth
                                {...{ inputRef }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment onClick={() => inputRef.current?.focus()}
                                            position="start">
                                            <SearchRoundedIcon color={"white"} />
                                        </InputAdornment>
                                    ),
                                }}
                                defaultValue={searchName ?? ""}
                                onChange={(e) => debouncedOnChange(e)}
                                placeholder={t(`search`)}
                            />
                        </FormControl>
                        <Can I={"manage"} a={"settings"} field={"settings__motif__create"}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={() => {
                                    editMotif(null as any, "add");
                                }}
                                sx={{ ml: "auto" }}>
                                {t("add")}
                            </Button>
                        </Can>
                    </Stack>
                </Stack>
            </SubHeader>

            <DesktopContainer>
                <Box sx={{ p: { xs: "40px 8px", sm: "30px 8px", md: 2 } }}>
                    <Otable
                        headers={headCells}
                        toolbar={
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                width={1}
                                mb={3}
                                alignItems="center">
                                <Typography color="text.primary" variant="subtitle1" fontWeight={600}>{t("title")}</Typography>
                                <Can I={"manage"} a={"settings"} field={"settings__motif__create"}>
                                    <CustomIconButton

                                        color="primary"
                                        onClick={() => {
                                            editMotif(null as any, "add");
                                        }}
                                        sx={{ ml: "auto" }}>
                                        <IconUrl path="ic-plus" width={16} height={16} color="white" />
                                    </CustomIconButton>
                                </Can>
                            </Stack>
                        }
                        {...{
                            rows: reasons,
                            state,
                            durations,
                            delay,
                            t,
                            handleConfig,
                            handleChange,
                        }}
                        edit={editMotif}
                        from={"motif"}
                        total={(httpConsultReasonResponse as HttpResponse)?.data?.total}
                        totalPages={
                            (httpConsultReasonResponse as HttpResponse)?.data?.totalPages
                        }
                        pagination
                    />
                </Box>
            </DesktopContainer>
            <MobileContainer>
                <Container>
                    <Box pt={3.7}>
                        {reasonsMobile?.slice(0, displayedItems).map((row, idx) => (
                            <Suspense key={idx}>
                                <MotifListMobile
                                    t={t}
                                    data={row}
                                    durations={durations}
                                    delay={delay}
                                    handleChange={handleChange}
                                    editMotif={editMotif}
                                />
                            </Suspense>
                        ))}
                    </Box>
                </Container>
            </MobileContainer>
            <Drawer anchor={"right"} open={edit} dir={direction} onClose={closeDraw}>
                <EditMotifDialog
                    data={selected}
                    durations={durations}
                    delay={delay}
                    mutateEvent={mutateConsultReason}
                    closeDraw={closeDraw}
                />
            </Drawer>
            <Dialog PaperProps={{
                sx: {
                    width: "100%"
                }
            }} maxWidth="sm" open={open}>
                <DialogTitle>
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
                                setLoading(false);
                                setOpen(false);
                            }}
                            startIcon={<CloseIcon />}>
                            {t("dialog.cancel")}
                        </Button>
                        <LoadingButton
                            variant="contained"
                            loading={loading}
                            color="error"
                            onClick={() => removeReason(selected?.uuid as any)}
                            startIcon={<Icon path="setting/icdelete" color="white" />}>
                            {t("dialog.delete")}
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    );
}


export default Motif;


