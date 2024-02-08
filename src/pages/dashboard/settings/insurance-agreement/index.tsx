import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
import {SubHeader} from "@features/subHeader";
import {RootStyled} from "@features/toolbar";
import {useTranslation} from "next-i18next";
import {
    Box,
    Button,
    DialogTitle,
    InputAdornment,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import {configSelector, DashLayout} from "@features/base";
import {Otable} from "@features/table";
import {Dialog as MedDialog} from "@features/dialog";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {useRouter} from "next/router";
import {Theme} from "@mui/material/styles";
import {MobileContainer} from "@themes/mobileContainer";
import {DesktopContainer} from "@themes/desktopConainter";
import {InsuranceMobileCard, NoDataCard} from "@features/card";


import {LoadingScreen} from "@features/loadingScreen";
import {Add} from "@mui/icons-material";
import {ActionMenu} from "@features/menu";
import IconUrl from "@themes/urlIcon";
import {setStepperIndex, stepperSelector} from "@features/stepper";
import {DefaultCountry} from "@lib/constants";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";

const insuranceData = [
    {
        uuid: "01",
        name: "assurance-1",
        url: "/static/img/assurance-1.png"
    },
    {
        uuid: "02",
        name: "assurance-2",
        url: "/static/img/assurance-2.png"
    },
]

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

const Toolbar = (props: any) => {
    const {t, search, handleSearch} = props
    return (
        <Stack direction={{xs: 'column', sm: 'row'}} spacing={{xs: 1, sm: 0}} borderBottom={1} borderColor={"divider"}
               pb={1} mb={2} alignItems={{xs: 'flex-start', sm: 'center'}} justifyContent="space-between">
            <Typography fontWeight={500}>
                {t("title")}
            </Typography>
            <TextField
                value={search}
                onChange={handleSearch}
                sx={{width: {xs: 1, sm: 'auto'}}}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconUrl path="ic-search"/>
                        </InputAdornment>
                    ),
                }}
                placeholder={t("search")}/>
        </Stack>
    )
}

function InsuranceAndAgreement() {
    const CardData = {
        mainIcon: "convention",
        title: "no-data.title",
        description: "no-data.description"
    };

    const {data: session} = useSession();
    const {currentStep} = useAppSelector(stepperSelector);
    const dispatch = useAppDispatch();

    const {t, ready} = useTranslation("settings", {keyPrefix: "insurance.config"});
    const {direction} = useAppSelector(configSelector);
    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse)
        .medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country
        ? medical_entity.country
        : DefaultCountry;
    const devise = doctor_country.currency?.name;

    const [rows, setRows] = useState<any>([
        ...insuranceData
    ]);
    const router = useRouter();
    const [search, setSearch] = React.useState("")
    const [confirmDialog, setConfirmDialog] = useState(false);
    const theme = useTheme();

    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const [openAgreementDialog, setAgreementDialog] = useState(false);
    const [collapse, setCollapse] = useState(false);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearch(query);
        if (query.length === 0) return setRows(insuranceData)
        const data = rows.filter((row: any) => {
            return row.name.toLowerCase().includes(query.toLowerCase())
        })
        setRows(data);
    }
    const handleContextMenu = (event: MouseEvent) => {

        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                :
                null,
        );
    };
    const OnMenuActions = (props: any) => {
        setContextMenu(null);
    }
    const handleTableActions = (props: { action: string, event: MouseEvent, data: any }) => {
        const {action, event, data} = props;
        switch (action) {
            case "OPEN-POPOVER":
                event.preventDefault();
                handleContextMenu(event)
                break;
            case "ON_ROUTE":
                event.preventDefault();
                router.push(`${router.pathname}/${data.uuid}`, undefined, {locale: router.locale})

        }
    }
    const handleCloseMenu = () => {
        setContextMenu(null);
    }


    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);
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

                {rows.length > 0 ? (
                    <>
                        <DesktopContainer>
                            <Otable
                                toolbar={<Toolbar {...{t, search, handleSearch}} />}
                                headers={headCells}
                                rows={rows}
                                handleEvent={handleTableActions}
                                state={null}
                                from={"insurance-agreement"}
                                t={t}
                                edit={null}

                            />
                        </DesktopContainer>
                        <MobileContainer>
                            <Paper component={Stack} spacing={1} sx={{p: 2, borderRadius: 1}}>
                                <Toolbar {...{t, search, handleSearch}} />
                                {
                                    rows.map((insurance: any) => (
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
                data={{t, devise, stepperData, collapse}}
                direction={direction}
                sx={{bgcolor: theme.palette.background.default}}
                dialogClose={() => {
                    setAgreementDialog(false);
                    setCollapse(false);
                }}
                onClose={() => {
                    setAgreementDialog(false);
                    setCollapse(false);
                }}
                headerDialog={
                    <DialogTitle
                        sx={{
                            backgroundColor: (theme: Theme) => theme.palette.primary.main,
                            position: "relative",
                        }}
                        id="scroll-dialog-title">
                        {t("dialog.title")}
                    </DialogTitle>
                }
                actionDialog={
                    <Stack
                        width={1}
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        position="relative"
                        {...(stepperData.length - 1 === currentStep && {
                            pb: {xs: 6, sm: 0},
                        })}
                    >
                        <Button
                            variant="text-black"
                            onClick={() =>
                                currentStep < 1
                                    ? (setAgreementDialog(false), setCollapse(false))
                                    : dispatch(setStepperIndex(currentStep - 1))
                            }
                        >

                            {t("dialog.back")}

                        </Button>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    if (stepperData.length - 1 > currentStep) {
                                        dispatch(setStepperIndex(currentStep + 1));
                                    } else {
                                        setAgreementDialog(false);
                                        setCollapse(false);
                                    }
                                }}
                                {...(stepperData.length - 1 === currentStep && {
                                    variant: "outlined",
                                    color: "info",
                                    sx: {bgcolor: theme.palette.grey["A500"]},
                                })}
                            >

                                {t("dialog.next")}

                            </Button>
                            {stepperData.length - 1 === currentStep && (
                                <Button
                                    onClick={() => {
                                        setAgreementDialog(false);
                                        setCollapse(false);
                                        setConfirmDialog(true);
                                    }}
                                    variant="contained"
                                    sx={{
                                        position: {xs: "absolute", sm: "static"},
                                        width: {xs: "100%", sm: "auto"},
                                        left: {xs: -8, sm: "unset"},
                                        bottom: {xs: 0, sm: "unset"},
                                    }}
                                >
                                    {t("dialog.confirm_save")}
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                }
            />

        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, [
            "common",
            "menu",
            "settings",
        ])),
    },
});

export default InsuranceAndAgreement;

InsuranceAndAgreement.auth = true;

InsuranceAndAgreement.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
