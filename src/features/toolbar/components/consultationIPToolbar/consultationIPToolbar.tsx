import React, {useEffect, useState} from "react";
import {Button, DialogActions, MenuItem, Stack, Tab, Tabs, useMediaQuery,} from "@mui/material";
import ConsultationIPToolbarStyled from "./overrides/consultationIPToolbarStyle";
import StyledMenu from "./overrides/menuStyle";
import {useTranslation} from "next-i18next";
import {documentButtonList} from "./config";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import Icon from "@themes/urlIcon";
import {useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import {useAppDispatch} from "@app/redux/hooks";
import {Theme} from "@mui/material/styles";
import {resetAppointment, setAppointmentPatient} from "@features/tabPanel";
import {openDrawer} from "@features/calendar";
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function ConsultationIPToolbar({...props}) {
    const isMobile = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down("md")
    );
    const {t, ready} = useTranslation("consultation", {
        keyPrefix: "consultationIP",
    });

    const {
        selected,
        appuuid,
        mutate,
        agenda,
        mutateDoc,
        setPendingDocuments,
        pendingDocuments,
        dialog,
        setDialog,
        appointement
    } = props;
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [value, setValue] = useState(appointement.latestAppointments.length === 0 ? "consultation form" : "patient history");
    const [info, setInfo] = useState<null | string>("");
    const [state, setState] = useState<any>();
    const [prescription, setPrescription] = useState<PrespectionDrugModel[]>([]);
    const [checkUp, setCheckUp] = useState<AnalysisModel[]>([]);
    const [imagery, setImagery] = useState<AnalysisModel[]>([]);
    const [tabs, setTabs] = useState(0);
    const [label, setlabel] = useState<string>(appointement.latestAppointments.length === 0 ? "consultation_form" : "patient_history");
    const [lastTabs, setLastTabs] = useState<string>("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [action, setactions] = useState<boolean>(false);
    const open = Boolean(anchorEl);
    const dispatch = useAppDispatch();

    let tabsData = [
        {
            label: "patient_history",
            value: "patient history"
        },
        {
            label: "consultation_form",
            value: "consultation form"
        },
        {
            label: "documents",
            value: "documents"
        },
        {
            label: "medical_procedures",
            value: "medical procedures"
        },
    ];

    if (appointement.latestAppointments.length === 0)
        tabsData = [
            {
                label: "consultation_form",
                value: "consultation form"
            },
            {
                label: "documents",
                value: "documents"
            },
            {
                label: "medical_procedures",
                value: "medical procedures"
            }
        ];

    const {trigger} = useRequestMutation(null, "/drugs");
    const router = useRouter();
    const {data: session} = useSession();
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const ginfo = (session?.data as UserDataResponse).general_information;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleSaveDialog = () => {
        const form = new FormData();
        switch (info) {
            case "medical_prescription":
                form.append("globalNote", "");
                form.append("isOtherProfessional", "false");
                form.append("drugs", JSON.stringify(state));

                trigger({
                    method: "POST",
                    url:
                        "/api/medical-entity/" +
                        medical_entity.uuid +
                        "/appointments/" +
                        appuuid +
                        "/prescriptions/" +
                        router.locale,
                    data: form,
                    headers: {
                        ContentType: "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }).then((r: any) => {
                    mutateDoc();
                    mutate();
                    setInfo("document_detail");
                    const res = r.data.data;

                    setState({
                        uri: res[1],
                        name: "prescription",
                        type: "prescription",
                        info: res[0].prescription_has_drugs,
                        uuid: res[0].uuid,
                        patient: res[0].patient.firstName + " " + res[0].patient.lastName,
                    });
                    setOpenDialog(true);
                    setactions(true);
                    setPrescription([]);

                    let pdoc = [...pendingDocuments];
                    pdoc = pdoc.filter((obj) => obj.id !== 2);
                    setPendingDocuments(pdoc);
                });
                break;
            case "balance_sheet_request":
                form.append("analyses", JSON.stringify(state));

                trigger({
                    method: "POST",
                    url:
                        "/api/medical-entity/" +
                        medical_entity.uuid +
                        "/appointments/" +
                        appuuid +
                        "/requested-analysis/" +
                        router.locale,
                    data: form,
                    headers: {
                        ContentType: "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }).then((r: any) => {
                    mutateDoc();
                    mutate();
                    setCheckUp([]);
                    setInfo("document_detail");
                    const res = r.data.data;
                    setState({
                        uuid: res[0].uuid,
                        uri: res[1],
                        name: "requested-analysis",
                        type: "requested-analysis",
                        info: res[0].analyses,
                        patient: res[0].patient.firstName + " " + res[0].patient.lastName,
                    });
                    setOpenDialog(true);
                    setactions(true);

                    let pdoc = [...pendingDocuments];
                    pdoc = pdoc.filter((obj) => obj.id !== 1);
                    setPendingDocuments(pdoc);
                });
                break;
            case "medical_imagery":
                form.append("medical-imaging", JSON.stringify(state));

                trigger({
                    method: "POST",
                    url:
                        "/api/medical-entity/" +
                        medical_entity.uuid +
                        "/appointment/" +
                        appuuid +
                        "/medical-imaging/" +
                        router.locale,
                    data: form,
                    headers: {
                        ContentType: "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }).then((r: any) => {
                    mutateDoc();
                    mutate();
                    setImagery([]);
                    setInfo("document_detail");
                    const res = r.data.data;
                    setState({
                        uuid: res[0].uuid,
                        uri: res[1],
                        name: "requested-medical-imaging",
                        type: "requested-medical-imaging",
                        info: res[0]["medical-imaging"],
                        patient: res[0].patient.firstName + " " + res[0].patient.lastName,
                    });
                    setOpenDialog(true);
                    setactions(true);

                    let pdoc = [...pendingDocuments];
                    pdoc = pdoc.filter((obj) => obj.id !== 1);
                    setPendingDocuments(pdoc);
                });
                break;
            case "add_a_document":
                //form.append("title", state.name);
                //form.append("description", state.description);
                form.append("type", state.type);
                state.files.map((file: File) => {
                    form.append("files[]", file, file.name);
                });

                trigger({
                    method: "POST",
                    url: `/api/medical-entity/${medical_entity.uuid}/agendas/${agenda}/appointments/${appuuid}/documents/${router.locale}`,
                    data: form,
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }).then(() => {
                    mutateDoc();
                });
                setOpenDialog(true);
                setactions(true);
                break;
            case "write_certif":
                form.append("content", state.content);
                trigger({
                    method: "POST",
                    url: `/api/medical-entity/${medical_entity.uuid}/appointments/${appuuid}/certificates/${router.locale}`,
                    data: form,
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    },
                }).then(() => {
                    mutateDoc();
                    setInfo("document_detail");
                    setState({
                        content: state.content,
                        doctor: state.name,
                        patient: state.patient,
                        days: state.days,
                        name: "certif",
                        type: "write_certif",
                    });
                    setOpenDialog(true);
                    setactions(true);
                });

                break;
        }

        setOpenDialog(false);
        setInfo(null);
    };

    const handleCloseDialog = () => {
        let pdoc = [...pendingDocuments];
        switch (info) {
            case "medical_prescription":
                if (state.length > 0) {
                    if (pdoc.findIndex((pdc) => pdc.id === 2) === -1)
                        pdoc.push({
                            id: 2,
                            name: "Ordonnance médicale",
                            status: "in_progress",
                            icon: "ic-traitement",
                        });
                } else {
                    pdoc = pdoc.filter((obj) => obj.id !== 2);
                }
                break;
            case "balance_sheet_request":
                setCheckUp(state);
                if (state.length > 0) {
                    if (pdoc.findIndex((pdc) => pdc.id === 1) === -1)
                        pdoc.push({
                            id: 1,
                            name: "Demande bilan",
                            status: "in_progress",
                            icon: "ic-analyse",
                        });
                } else {
                    pdoc = pdoc.filter((obj) => obj.id !== 1);
                }
                break;
            case "medical_imagery":
                setImagery(state);
                break;
        }
        setOpenDialog(false);
        setInfo(null);
        setPendingDocuments(pdoc);
    };

    const handleClose = (action: string) => {
        switch (action) {
            case "draw_up_an_order":
                setInfo("medical_prescription");
                setState(prescription);
                break;
            case "balance_sheet_request":
                setInfo("balance_sheet_request");
                setState(checkUp);
                break;
            case "medical_imagery":
                setInfo("medical_imagery");
                setState(imagery);
                break;
            case "write_certif":
                setInfo("write_certif");
                setState({
                    name: ginfo.firstName + " " + ginfo.lastName,
                    days: '....',
                    content: "",
                    patient:
                        appointement.patient.firstName +
                        " " +
                        appointement.patient.lastName,
                });
                break;
            case "upload_document":
                setInfo("add_a_document");
                setState({name: "", description: "", type: "analyse", files: []});
                break;
            case "RDV":
                handleOpen()
                break;
            default:
                setInfo(null);
                break;
        }
        setAnchorEl(null);
        setOpenDialog(true);
        setactions(true);
    };

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    useEffect(() => {
        switch (dialog) {
            case "draw_up_an_order":
                setInfo("medical_prescription");
                break;
            case "balance_sheet_request":
                setInfo("balance_sheet_request");
                setState(checkUp);
                break;
        }
        setDialog("");
        setOpenDialog(true);
        setactions(true);
    }, [checkUp, dialog, prescription, setDialog]);

    useEffect(() => {
        selected(label);
        if (lastTabs === "consultation_form") {
            const btn = document.getElementsByClassName("sub-btn")[1];
            const examBtn = document.getElementsByClassName("sub-exam")[0];

            (btn as HTMLElement)?.click();
            (examBtn as HTMLElement)?.click();
        }
        setLastTabs(label);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabs]);

    const handleOpen = () => {
        dispatch(resetAppointment());
        dispatch(setAppointmentPatient(appointement?.patient));
        dispatch(openDrawer({type: "add", open: true}));
    };
    if (!ready) return <>toolbar loading..</>;

    return (
        <>
            <ConsultationIPToolbarStyled minHeight="inherit" width={1}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                    {/* <Button
            variant="contained"
            onClick={() => {
              setInfo("add_vaccin");
              setOpenDialog(true);
            }}>
            {t("vaccine")}
          </Button>
          <Button onClick={handleClickReport} variant="contained">
            {t("report")}
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorReport}
            open={openReport}
            onClose={handleCloseAnchor}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: 0,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                marginTop: (theme) => theme.spacing(1),
                minWidth: 150,
                backgroundColor: (theme) => theme.palette.text.primary,
              },
            }}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}>
            {reportMenu.map((item, idx) => (
              <MenuItem
                onClick={() => handleCloseAnchor(item.value)}
                key={idx}
                sx={{
                  color: (theme) => theme.palette.grey[0],
                  ".react-svg": {
                    mr: 1,
                    svg: {
                      width: 12,
                      height: 12,
                      path: { fill: (theme) => theme.palette.grey[0] },
                    },
                  },
                }}>
                <Icon path={item.icon} />
                {t(item.value)}
              </MenuItem>
            ))}
          </Menu> */}
                </Stack>
                <Stack
                    direction="row"
                    minHeight="inherit"
                    alignItems="flex-end"
                    width={1}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        sx={{width: {xs: "70%", md: "70%"}}}
                        variant={isMobile ? "scrollable" : "standard"}
                        allowScrollButtonsMobile={isMobile}
                        textColor="primary"
                        indicatorColor="primary"
                        aria-label="patient_history">
                        {tabsData.map(({label, value}, index) => (
                            <Tab
                                onFocus={() => {
                                    setTabs(index);
                                    setlabel(label);
                                }}
                                className="custom-tab"
                                key={label}
                                value={value}
                                label={t(label)}
                            />
                        ))}
                    </Tabs>
                    {/* <LoadingButton
            loading={loading}
            variant="outlined"
            color="primary"
            onClick={() => {
              const btn = document.getElementsByClassName("sub-btn")[1];
              const examBtn = document.getElementsByClassName("sub-exam")[0];

              (btn as HTMLElement)?.click();
              (examBtn as HTMLElement)?.click();

              setLoading(true);

              setTimeout(() => {
                setEnd(true);
                setLoading(false);
              }, 3000);
            }}
            className="action-button">
            {!loading && appointement?.status == 5 ? (
              <Icon path="ic-edit" />
            ) : (
              <Icon path="ic-check" />
            )}
            {appointement?.status == 5
              ? t("edit_of_consultation")
              : t("end_of_consultation")}
          </LoadingButton> */}
                    <Stack
                        direction="row"
                        spacing={1}
                        mb={1}
                        justifyContent="flex-end"
                        sx={{width: {xs: "30%", md: "30%"}}}>
                        {/*<Button
                            variant="contained"
                            sx={{minWidth: 35}}
                            size={isMobile ? "small" : "medium"}
                            onClick={() => {
                                handleOpen();
                            }}>
                            {isMobile ? <IconUrl path="ic-agenda"/> : t("RDV")}
                        </Button>*/}
                        <Button
                            sx={{minWidth: 35}}
                            size={isMobile ? "small" : "medium"}
                            onClick={handleClick}
                            variant="contained"
                            endIcon={<KeyboardArrowDownIcon/>}
                            color="warning">
                            {
                                isMobile ? <AddIcon/> :
                                    <>
                                        <AddIcon style={{marginRight: 5, fontSize: 18}}/> {t("add")}
                                    </>
                            }
                        </Button>
                        <StyledMenu
                            id="basic-menu"
                            elevation={0}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "right",
                            }}
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                                "aria-labelledby": "basic-button",
                            }}>
                            {documentButtonList.map((item, index) => (
                                <MenuItem
                                    key={`document-button-list-${index}`}
                                    onClick={() => handleClose(item.label)}>
                                    <Icon path={item.icon}/>
                                    {t(item.label)}
                                </MenuItem>
                            ))}
                        </StyledMenu>
                    </Stack>
                </Stack>
            </ConsultationIPToolbarStyled>
            {info && (
                <Dialog
                    action={info}
                    open={openDialog}
                    data={{state, setState, t}}
                    size={info === "add_vaccin" ? "sm" : "lg"}
                    direction={"ltr"}
                    sx={{height: 400}}
                    {...(info === "document_detail" && {
                        sx: {height: 400, p: 0},
                    })}
                    title={t(info === "document_detail" ? "doc_detail_title" : info)}
                    {...(info === "document_detail" && {
                        onClose: handleCloseDialog,
                    })}
                    dialogClose={handleCloseDialog}
                    actionDialog={
                        action ? (
                            <DialogActions>
                                <Button onClick={handleCloseDialog} startIcon={<CloseIcon/>}>
                                    {t("cancel")}
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSaveDialog}
                                    disabled={state.length === 0}
                                    startIcon={<Icon path="ic-dowlaodfile"/>}>
                                    {t("save")}
                                </Button>
                            </DialogActions>
                        ) : null
                    }
                />
            )}
        </>
    );
}

export default ConsultationIPToolbar;
