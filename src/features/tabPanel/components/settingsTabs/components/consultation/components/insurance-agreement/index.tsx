import React, {useEffect, useState} from "react";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/toolbar";
import {useTranslation} from "next-i18next";
import {Box, Button, DialogTitle, MenuItem, Paper, Stack, Typography, useTheme} from "@mui/material";
import {configSelector, dashLayoutSelector} from "@features/base";
import {Otable} from "@features/table";
import {Dialog as MedDialog} from "@features/dialog";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {useRouter} from "next/router";
import {Theme} from "@mui/material/styles";
import {MobileContainer} from "@themes/mobileContainer";
import {DesktopContainer} from "@themes/desktopConainter";
import {InsuranceMobileCard, NoDataCard} from "@features/card";
import {Add} from "@mui/icons-material";
import {ActionMenu} from "@features/menu";
import {SetAgreement, setStepperIndex, stepperSelector} from "@features/stepper";
import {DefaultCountry} from "@lib/constants";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import moment from "moment/moment";

const stepperData = [
    {
        title: "dialog.stepper.step-1",
    },
    {
        title: "dialog.stepper.step-2",
    },
    {
        title: "dialog.stepper.step-3",
    },
];

function InsuranceAndAgreement() {
    const CardData = {
        mainIcon: "convention",
        title: "no-data.title",
        description: "no-data.description"
    };
    const popoverActions = [{
        icon: <Add/>,
        title: "add",
        action: "onAdd"
    }]
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
            id: "label",
            numeric: false,
            disablePadding: false,
            label: "label",
            align: "center",
            sortable: true,
        },
        {
            id: "start_date",
            numeric: false,
            disablePadding: false,
            label: "start_date",
            align: "center",
            sortable: false,
        },
        {
            id: "end_date",
            numeric: true,
            disablePadding: false,
            label: "end_date",
            align: "center",
            sortable: false,
        },
        {
            id: "empty",
            numeric: false,
            disablePadding: false,
            label: "empty",
            align: "center",
            sortable: false,
        },
    ];


    const {currentStep} = useAppSelector(stepperSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {direction} = useAppSelector(configSelector);
    const {agreement} = useAppSelector(stepperSelector);

    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const {trigger} = useRequestQueryMutation("/insurance");
    const {trigger: invalidateQueries} = useInvalidateQueries();

    const {t, ready} = useTranslation("settings", {keyPrefix: "insurance.config"});
    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    const [search, setSearch] = React.useState("")
    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const [openAgreementDialog, setAgreementDialog] = useState(false);
    const [collapse, setCollapse] = useState(false);
    const [agreements, setAgreements] = useState([]);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    const {data: httpInsurances, mutate} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/insurances/${router.locale}`,
    });

    const OnMenuActions = (props: any) => {
        setContextMenu(null);
    }
    const handleTableActions = (props: { action: string, event: MouseEvent, data: any }) => {
        const {action, event, data} = props;
        switch (action) {
            case "DELETE":
                event.preventDefault();
                trigger(
                    {
                        method: "DELETE",
                        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/insurances/${data.uuid}/${router.locale}`,
                    },
                    {
                        onSuccess: () => {
                            mutate()
                        }
                    }
                );
                break;
            case "ON_ROUTE":
                event.preventDefault();
                router.push(`/dashboard/settings/insurance-agreement/${data.uuid}?name=${data.insurance.uuid}`)/*{
                    pathname: `/dashboard/settings/insurance-agreement/${data.uuid}`,
                    ...(data.insurance && {query: {name: data.insurance.uuid}})
                });*/
        }
    }

    const handleCloseMenu = () => {
        setContextMenu(null);
    }

    const saveChanges = (from: string) => {
        const form = new FormData();
        form.append("insurance", agreement.insurance && agreement.insurance.uuid ? agreement.insurance.uuid : "")
        form.append("name", agreement.label)
        form.append("mutual", agreement.name ? agreement.name : "")
        form.append("start_date", agreement.startDate ? moment(agreement.startDate).format("DD/MM/YYYY") : moment().format("DD/MM/YYYY"))
        form.append("end_date", agreement.endDate ? moment(agreement.endDate).format("DD/MM/YYYY") : moment().add(1, "year").format("DD/MM/YYYY"))
        if (selectedRow === null)
            form.append("acts", JSON.stringify(agreement.acts))
        form.append("medicalEntityHasUsers", medicalEntityHasUser as string)
        trigger(
            {
                method: selectedRow ? "PUT" : "POST",
                url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/insurances/${selectedRow ? selectedRow.uuid + "/" : ""}${router.locale}`,
                data: form
            },
            {
                onSuccess: () => {
                    setCollapse(false);
                    dispatch(SetAgreement({
                        type: 'insurance',
                        insurance: {name: ""},
                        label: '',
                        startDate: null,
                        endDate: null,
                        acts: []
                    }))
                    mutate()
                    invalidateQueries([`/api/public/insurances/${router.locale}?MedicalEntity=${medical_entity.uuid}`])
                    dispatch(setStepperIndex(0))
                    if (from !== "next")
                        setAgreementDialog(false)
                }
            }
        );
    }

    useEffect(() => {
        if (httpInsurances)
            setAgreements(httpInsurances.data)
    }, [httpInsurances])

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t("path.root")}</p>
                </RootStyled>
                <Button
                    onClick={() => setAgreementDialog(true)}
                    startIcon={<Add/>}
                    variant="contained"
                >
                    {t("add")}
                </Button>
            </SubHeader>

            <Box className="container">

                {agreements.length > 0 ? (
                    <>
                        <DesktopContainer>
                            <Otable
                                /*toolbar={<Toolbar {...{t, search, handleSearch}} />}*/
                                headers={headCells}
                                rows={agreements}
                                {...{setAgreementDialog, setSelectedRow}}
                                handleEvent={handleTableActions}
                                state={null}
                                from={"insurance-agreement"}
                                t={t}
                                edit={null}

                            />
                        </DesktopContainer>
                        <MobileContainer>
                            <Paper component={Stack} spacing={1} sx={{p: 2, borderRadius: 1}}>
                                {/* <Toolbar {...{t, search, handleSearch}} />*/}
                                {
                                    agreements.map((insurance: any) => (
                                        <React.Fragment key={insurance.uuid}>
                                            <InsuranceMobileCard t={t} row={insurance}
                                                                 handleEvent={handleTableActions}/>
                                        </React.Fragment>
                                    ))
                                }

                            </Paper>
                        </MobileContainer>
                    </>
                ) : (
                    <NoDataCard t={t} data={CardData} ns={"settings"}/>
                )}
            </Box>
            <ActionMenu {...{contextMenu, handleClose: handleCloseMenu}}>
                {popoverActions.map(
                    (v: any, index) => (
                        <MenuItem
                            key={index}
                            className="popover-item"
                            onClick={() => {
                                OnMenuActions(v.action);
                            }}>
                            {v.icon}
                            <Typography fontSize={15} sx={{color: "#fff"}}>
                                {t(`popover-actions.${v.title}`)}
                            </Typography>
                        </MenuItem>
                    )
                )}
            </ActionMenu>

            <MedDialog
                action={"agreement"}
                open={openAgreementDialog}
                data={{t, devise, stepperData, collapse, selectedRow, agreements}}
                direction={direction}
                sx={{bgcolor: theme.palette.background.default}}
                dialogClose={() => {
                    setAgreementDialog(false);
                    setSelectedRow(null)
                    setCollapse(false);
                    dispatch(SetAgreement({
                        type: 'insurance',
                        insurance: {name: ""},
                        label: '',
                        startDate: null,
                        endDate: null,
                        acts: []
                    }))
                }}
                onClose={() => {
                    setAgreementDialog(false);
                    setSelectedRow(null)
                    setCollapse(false);
                    dispatch(SetAgreement({
                        type: 'insurance',
                        insurance: {name: ""},
                        label: '',
                        startDate: null,
                        endDate: null,
                        acts: []
                    }))
                }}
                title={t("dialog.title")}
                actionDialog={
                    <Stack
                        width={1}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        position="relative"
                        {...(stepperData.length - 1 === currentStep && {
                            pb: {xs: 6, sm: 0},
                        })}>
                        <Button
                            variant="text-black"
                            onClick={() =>
                                currentStep < 1
                                    ? (setAgreementDialog(false), setCollapse(false),
                                        dispatch(SetAgreement({
                                            type: 'insurance',
                                            insurance: {name: ""},
                                            label: '',
                                            startDate: null,
                                            endDate: null,
                                            acts: []
                                        })))
                                    : dispatch(setStepperIndex(currentStep - 1))
                            }
                        >

                            {t("dialog.back")}

                        </Button>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            {stepperData.length - 1 === currentStep && (
                                <Button
                                    onClick={() => {
                                        saveChanges("next")
                                    }}
                                    variant="contained"
                                    color={"info"}
                                    sx={{
                                        position: {xs: "absolute", sm: "static"},
                                        width: {xs: "100%", sm: "auto"},
                                        left: {xs: -8, sm: "unset"},
                                        bottom: {xs: 0, sm: "unset"},
                                        bgcolor: theme.palette.grey["A500"]
                                    }}
                                >
                                    {t("dialog.confirm_save")}
                                </Button>
                            )}
                            {selectedRow ? <Button
                                variant="contained"
                                disabled={currentStep === 0 && ((agreement?.type === "insurance" && !agreement?.insurance?.uuid) || (agreement?.type === "agreement" && !agreement?.name))}
                                onClick={() => {
                                    saveChanges("")
                                }}>
                                {t("dialog.edit")}
                            </Button> : <Button
                                variant="contained"
                                disabled={currentStep === 0 && ((agreement?.type === "insurance" && !agreement?.insurance?.uuid) || (agreement?.type === "agreement" && !agreement?.name))}
                                onClick={() => {
                                    if (stepperData.length - 1 > currentStep) {
                                        dispatch(setStepperIndex(currentStep + 1));
                                    } else {
                                        saveChanges("")
                                    }
                                }}>
                                {t(stepperData.length - 1 === currentStep ? "dialog.confirm" : "dialog.next")}
                            </Button>}
                        </Stack>
                    </Stack>
                }
            />

        </>
    );
}

export default InsuranceAndAgreement;
