import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useCallback, useEffect, useState} from "react";
import {DashLayout, dashLayoutSelector, setOngoing} from "@features/base";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {
    Autocomplete,
    Box,
    Button,
    createFilterOptions,
    InputAdornment,
    Stack,
    TextField,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions, Checkbox, FormControlLabel, Card,
} from "@mui/material";
import {useTranslation} from "next-i18next";
import {useRequest, useRequestMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {RootStyled} from "@features/toolbar";
import {SubHeader} from "@features/subHeader";
import {Otable} from "@features/table";
import {
    SWRNoValidateConfig,
    TriggerWithoutValidation,
} from "@lib/swr/swrProvider";
import {useSnackbar} from "notistack";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {DefaultCountry} from "@lib/constants";
import {ActFeesMobileCard} from "@features/card";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import {LoadingButton} from "@mui/lab";
import Icon from "@themes/urlIcon";
import CloseIcon from '@mui/icons-material/Close';
import {useMedicalEntitySuffix, useMedicalProfessionalSuffix} from "@lib/hooks";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {useSWRConfig} from "swr";

interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
    sortable: boolean;
    align: "left" | "right" | "center";
}

const filter = createFilterOptions<any>();

const headCells: readonly HeadCell[] = [
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "acts",
        sortable: true,
        align: "left",
    },
    {
        id: "fees",
        numeric: true,
        disablePadding: false,
        label: "amount",
        sortable: true,
        align: "center",
    },
    {
        id: "actions",
        numeric: true,
        disablePadding: false,
        label: "actions",
        sortable: false,
        align: "right",
    },
];

function ActFees() {
    const {data: session} = useSession();
    const {data: user} = session as Session;
    const theme = useTheme();
    const router = useRouter();
    const {enqueueSnackbar} = useSnackbar();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {medical_professional} = useMedicalProfessionalSuffix();
    const {mutate} = useSWRConfig();
    const dispatch = useAppDispatch();

    const {t, ready} = useTranslation("settings", {keyPrefix: "actfees"});
    const {medicalProfessionalData} = useAppSelector(dashLayoutSelector);

    const [mainActes, setMainActes] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false)
    const [selected, setSelected] = useState<any>("")
    const [create, setCreate] = useState(false);
    const [displayedItems, setDisplayedItems] = useState(10);
    const [consultationFees, setConsultationFees] = useState(0);
    const [isChecked, setIsChecked] = useState(user.medical_entity.hasDemo);
    const [newFees, setNewFees] = useState<{
        act: ActModel | string | null;
        fees: string;
    }>({act: null, fees: ""});

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    const {trigger} = useRequestMutation(null, "/settings/acts");
    const {trigger: triggerAddAct} = useRequestMutation(null, "/settings/acts/add");

    const {data: httpActSpeciality} = useRequest(medical_professional ? {
        method: "GET",
        url: `/api/public/acts/${router.locale}`,
        params: {
            ["specialities[0]"]:
            medical_professional.specialities[0].speciality.uuid,
        }
    } : null);

    const {data: httpProfessionalsActs, mutate:mutateActs} = useRequest(medical_professional ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/professionals/${medical_professional?.uuid}/acts/${router.locale}${
            !isMobile
                ? `?page=${router.query.page || 1}&limit=10&withPagination=true&sort=true`
                : "?sort=true"
        }`
    } : null, SWRNoValidateConfig);


    useEffect(() => {
        if (medicalProfessionalData) {
            setConsultationFees(Number(medicalProfessionalData[0]?.consultation_fees));
            if (localStorage.getItem('newCashbox')){
                setIsChecked(localStorage.getItem('newCashbox') === '1')
            }
        }
    }, [medicalProfessionalData]);

    useEffect(() => {
        setLoading(true);
        if (httpProfessionalsActs !== undefined) {
            if (isMobile) {
                const response = (httpProfessionalsActs as HttpResponse).data;
                setMainActes(response as ActModel[]);
                setLoading(false);
            } else {
                const response = (
                    httpProfessionalsActs as HttpResponse
                ).data?.list;
                setMainActes(response as ActModel[]);
                setLoading(false);
            }
        }
    }, [httpProfessionalsActs]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleCreate = () => {
        setCreate(true);
    }

    const handleRemove = () => {
        setCreate(false);
        setNewFees({act: null, fees: ""});
    };

    const editFees = () => {
        const form = new FormData();
        form.append("consultation_fees", consultationFees.toString());
        trigger(
            {
                method: "PATCH",
                url: `${urlMedicalEntitySuffix}/professionals/${medical_professional?.uuid}/${router.locale}`,
                data: form
            },
            TriggerWithoutValidation
        ).then(() => enqueueSnackbar(t("alert.updated"), {variant: "success"}));
    };

    const removeFees = (uuid: string) => {
        setLoading(true)
        trigger(
            {
                method: "DELETE",
                url: `${urlMedicalEntitySuffix}/acts/${uuid}/${router.locale}`
            },
            TriggerWithoutValidation
        ).then(() => {
            mutateActs().then(() => {
                setOpen(false);
                setLoading(false)
                enqueueSnackbar(t("alert.delete-act"), {variant: "success"});
                mutateMedicalProfessionalData();
            });
        }).catch((error) => {
            const {
                response: {data},
            } = error;
            setLoading(false);
            setOpen(false);
            enqueueSnackbar(t("alert." + data.message.replace(/\s/g, '-').toLowerCase()), {variant: "error"});
        });
    };

    const mutateMedicalProfessionalData = () => {
        mutate(`${urlMedicalEntitySuffix}/professionals/${router.locale}`).then(r => dispatch(setOngoing(r.data.data)));
    };

    const saveFees = () => {
        if (newFees.fees !== "" && typeof newFees.act === "string") {
            const form = new FormData();
            form.append(
                "name",
                JSON.stringify({
                    [router.locale as string]: newFees.act,
                })
            );
            form.append("price", `${newFees.fees}`);

            trigger(
                {
                    method: "POST",
                    url: `${urlMedicalEntitySuffix}/professionals/${medical_professional?.uuid}/new-acts/${router.locale}`,
                    data: form
                },
                TriggerWithoutValidation
            ).then(() => {
                mutateActs().then(() => {
                    setCreate(false);
                    setNewFees({act: null, fees: ""});
                    enqueueSnackbar(t("alert.add"), {variant: "success"});
                });
            });
        }
    };

    const setActFees = useCallback((
            isTopAct: boolean,
            actFees: any
        ) => {
            const form = new FormData();
            form.append("topAct", isTopAct.toString());
            form.append("act", actFees?.act?.uuid);
            triggerAddAct({
                method: "POST",
                url: `${urlMedicalEntitySuffix}/professionals/${medical_professional?.uuid}/acts/${router.locale}`,
                data: form
            }).then(() => handleEdit(actFees, actFees.fees, (actFees.act as ActModel).name));
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            medical_entity.uuid,
            medical_professional?.uuid,
            mutateActs,
            router.locale,
            session?.accessToken,
            triggerAddAct,
        ]
    );

    const handleEdit = (v: any, fees: string, name?: string) => {
        const form = new FormData();
        form.append("price", fees);
        name && form.append("name", name);
        trigger({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/professionals/${medical_professional?.uuid}/acts/${v.act?.uuid}/${router.locale}`,
            data: form
        }).then(() => {
            mutateActs().then(() => {
                enqueueSnackbar(t("alert.updated"), {variant: "success"});
                mutateMedicalProfessionalData();
                if (typeof newFees.act !== "string") {
                    setCreate(false);
                    setNewFees({act: null, fees: ""});
                }
            });
        });
    }
    const handleSelected = (prop: string) => {
        setOpen(true);
        setSelected(prop)
    }
    const handleScroll = () => {
        const total = (httpProfessionalsActs as HttpResponse)?.data.length;
        if (window.innerHeight + window.scrollY > document.body.offsetHeight - 50) {
            setLoading(true);
            if (total > displayedItems) {
                setDisplayedItems(displayedItems + 10);
            }
            if (total - displayedItems < 10) {
                setDisplayedItems(total);
            }
        }
    };

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
    }, [httpProfessionalsActs, displayedItems]); // eslint-disable-line react-hooks/exhaustive-deps

    const acts = (httpActSpeciality as HttpResponse)?.data as ActModel[];

    if (!ready) return (<LoadingScreen  button text={"loading-error"}/>);

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t("path")}</p>
                </RootStyled>
                {!create && isMobile && (
                    <Button
                        variant="contained"
                        color={"success"}
                        onClick={() => handleCreate()}>
                        {t("add_a_new_act")}
                    </Button>
                )}

                {!isMobile && (
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                        {!create && (
                            <Button
                                variant="contained"
                                color={"success"}
                                onClick={() => handleCreate()}>
                                {t("add_a_new_act")}
                            </Button>
                        )}
                        {/*<span>|</span>
                        <Typography>{t("consultation")} :</Typography>
                        <TextField
                            id="outlined-basic"
                            value={consultationFees}
                            size="small"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">{devise}</InputAdornment>
                                ),
                                style: {width: 120, backgroundColor: "white"},
                            }}
                            onChange={(ev) => {
                                setConsultationFees(Number(ev.target.value));
                            }}
                            variant="outlined"
                        />
                        <IconButton
                            color={"primary"}
                            onClick={() => {
                                editFees();
                            }}>
                            <SaveRoundedIcon color={"primary"}/>
                        </IconButton>*/}
                    </Stack>
                )}
            </SubHeader>

            <Card style={{margin:20,marginBottom: 0,paddingLeft: 10}}>
                    <FormControlLabel
                        label={t('betav')}
                        control={
                            <Checkbox
                                checked={isChecked}
                                onChange={() =>{

                                    const form = new FormData();
                                    form.append("is_demo", (!isChecked).toString());

                                    trigger(
                                        {
                                            method: "PATCH",
                                            url: `${urlMedicalEntitySuffix}/demo/${router.locale}`,
                                            data: form
                                        },
                                        TriggerWithoutValidation
                                    ).then(() => {
                                        enqueueSnackbar(t(isChecked ? "alert.demodisabled":"alert.demo"), {variant: "success"})
                                        console.log(!isChecked)
                                        dispatch(setOngoing({newCashBox: !isChecked}));
                                        localStorage.setItem('newCashbox',!isChecked ? '1':'0')
                                        setIsChecked(!isChecked);
                                    });

                                }}
                            />
                        }
                    />
            </Card>

            {isMobile && (
                <Box padding={2}>
                    <Stack
                        spacing={1}
                        padding={2}
                        style={{
                            background: "white",
                            borderRadius: 10,
                        }}>
                        <Typography>{t("consultation")}</Typography>
                        <TextField
                            id="outlined-basic"
                            value={consultationFees}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">{devise}</InputAdornment>
                                ),
                            }}
                            onChange={(ev) => {
                                setConsultationFees(Number(ev.target.value));
                            }}
                            variant="outlined"
                        />
                        <Button
                            variant={"contained"}
                            onClick={() => {
                                editFees();
                            }}>
                            <Typography>{t("save")}</Typography>
                        </Button>
                    </Stack>
                </Box>
            )}
            <Box
                sx={{
                    p: {xs: "40px 8px", sm: "30px 8px", md: 2},
                    table: {tableLayout: "fixed"},
                }}>
                {create && (
                    <Stack
                        style={{
                            background: "white",
                            padding: "10px 15px",
                            border: `1px solid ${theme.palette.warning.main}`,
                            borderRadius: 10,
                        }}
                        spacing={2}
                        mb={2}>
                        <Typography
                            style={{color: theme.palette.grey[400], fontSize: 10}}>
                            {t("newAct")}
                        </Typography>
                        <Stack
                            direction={isMobile ? "column" : "row"}
                            alignItems={"center"}
                            spacing={2}>
                            <Autocomplete
                                sx={{width: isMobile ? "100%" : "44%"}}
                                size="small"
                                value={newFees.act}
                                onChange={(event, newValue) => {
                                    if (typeof newValue === "string") {
                                        setNewFees({
                                            ...newFees,
                                            act: newValue,
                                        });
                                    } else if (newValue && newValue.inputValue) {
                                        // Create a new value from the user input
                                        setNewFees({
                                            ...newFees,
                                            act: newValue.inputValue,
                                        });
                                    } else {
                                        setNewFees({
                                            ...newFees,
                                            act: newValue as ActModel,
                                        });
                                    }
                                }}
                                filterOptions={(options, params) => {
                                    const filtered = filter(options, params);
                                    const {inputValue} = params;
                                    // Suggest the creation of a new value
                                    const isExisting = options.some(
                                        (option) => inputValue === option.name
                                    );
                                    if (inputValue !== "" && !isExisting) {
                                        filtered.push({
                                            inputValue,
                                            name: `${t("add_act")} "${inputValue}"`,
                                        });
                                    }

                                    return filtered;
                                }}
                                selectOnFocus
                                clearOnEscape
                                handleHomeEndKeys
                                id="name"
                                options={acts ? acts : []}
                                getOptionLabel={(option) => {
                                    // Value selected with enter, right from the input
                                    if (typeof option === "string") {
                                        return option;
                                    }
                                    // Add "xxx" option created dynamically
                                    if (option.inputValue) {
                                        return option.inputValue;
                                    }
                                    // Regular option
                                    return option.name;
                                }}
                                renderOption={(props, option) => (
                                    <li {...props}>{option.name}</li>
                                )}
                                freeSolo
                                renderInput={(params) => (
                                    <TextField {...params} label={t("placeholder_act")}/>
                                )}
                            />

                            <TextField
                                id="outlined-basic"
                                value={newFees.fees}
                                type={"number"}
                                size="small"
                                label={t("price")}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">{devise}</InputAdornment>
                                    ),
                                    style: {
                                        width: isMobile ? "" : 150,
                                        backgroundColor: "white",
                                    },
                                }}
                                onChange={(ev) => {
                                    newFees.fees = ev.target.value;
                                    setNewFees({...newFees});
                                }}
                                variant="outlined"
                                {...(isMobile && {
                                    fullWidth: true,
                                })}
                            />
                            <Button
                                disabled={newFees.act === null || newFees.fees.length === 0}
                                variant="contained"
                                onClick={() => {
                                    if (typeof newFees.act === "string") {
                                        saveFees();
                                    } else {
                                        setActFees(false, newFees);
                                    }
                                }}>
                                {t("save")}
                            </Button>
                            <Button
                                onClick={() => {
                                    handleRemove();
                                }}>
                                {t("cancel")}
                            </Button>
                        </Stack>
                    </Stack>
                )}
                <DesktopContainer>
                    <Otable
                        headers={headCells}
                        rows={mainActes}
                        from={"actfees"}
                        edit={handleEdit}
                        {...{t, loading, handleSelected}}
                        total={(httpProfessionalsActs as HttpResponse)?.data?.total}
                        totalPages={(httpProfessionalsActs as HttpResponse)?.data?.totalPages}
                        pagination
                    />
                </DesktopContainer>
                <MobileContainer>
                    <Stack spacing={1}>
                        {mainActes.slice(0, displayedItems).map((act: any) => (
                            <React.Fragment key={act.uuid}>
                                <ActFeesMobileCard
                                    data={act}
                                    editMotif={handleEdit}
                                    {...{t, handleSelected}}
                                />
                            </React.Fragment>
                        ))}
                    </Stack>
                </MobileContainer>
            </Box>
            <Dialog PaperProps={{
                sx: {
                    width: "100%"
                }
            }} maxWidth="sm" open={open}>
                <DialogTitle sx={{
                    bgcolor: (theme: Theme) => theme.palette.error.main,
                    px: 1,
                    py: 2,

                }}>
                    {t("dialog.delete-act-title")}
                </DialogTitle>
                <DialogContent style={{paddingTop: 20}}>
                    <Typography>
                        {t("dialog.delete-act-desc")}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{borderTop: 1, borderColor: "divider", px: 1, py: 2}}>
                    <Stack direction="row" spacing={1}>
                        <Button
                            onClick={() => {

                                setOpen(false);
                            }}
                            startIcon={<CloseIcon/>}>
                            {t("dialog.cancel")}
                        </Button>
                        <LoadingButton
                            variant="contained"
                            loading={loading}
                            color="error"
                            onClick={() => removeFees(selected?.uuid as any)}
                            startIcon={<Icon path="setting/icdelete" color="white"/>}>
                            {t("dialog.delete")}
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, [
            "common",
            "menu",
            "patient",
            "settings",
        ])),
    },
});

export default ActFees;

ActFees.auth = true;

ActFees.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
