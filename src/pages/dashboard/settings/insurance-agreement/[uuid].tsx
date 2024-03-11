import {GetStaticPaths, GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState,} from "react";
import {SubHeader} from "@features/subHeader";
import {useTranslation} from "next-i18next";
import {Box, Button, DialogTitle, InputAdornment, Paper, Stack, TextField, Typography} from "@mui/material";
import {RootStyled} from "@features/toolbar";
import {useRouter} from "next/router";
import {DashLayout, dashLayoutSelector} from "@features/base";
import {DesktopContainer} from "@themes/desktopConainter";
import {Otable} from "@features/table";
import IconUrl from "@themes/urlIcon";
import {MobileContainer} from "@themes/mobileContainer";
import {ActMobileCard} from "@features/card";
import {SubFooter} from "@features/subFooter";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {Add} from "@mui/icons-material";
import {Theme} from "@mui/material/styles";
import {SetAgreement, setStepperIndex} from "@features/stepper";
import moment from "moment";
import {Dialog as MedDialog} from "@features/dialog";
import {direction} from "html2canvas/dist/types/css/property-descriptors/direction";
import useApci from "@lib/hooks/rest/useApci";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";

const Toolbar = (props: any) => {
    const {t, search, handleSearch} = props
    return (
        <Stack direction={{xs: 'column', sm: 'row'}} spacing={{xs: 1, sm: 0}} borderBottom={1} borderColor={"divider"}
               pb={1} mb={2} alignItems={{xs: 'flex-start', sm: 'center'}} justifyContent="space-between">
            <Stack>
                <Typography variant="body2" fontWeight={500}>
                    {t("table.name")} {"CNAM"}
                </Typography>
                <Typography fontWeight={600}>
                    {t("table.act")}
                </Typography>
            </Stack>
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

function Actes() {
    const router = useRouter();
    const {t} = useTranslation("settings", {keyPrefix: 'insurance.config'});
    const {apcis} = useApci(router.query.name as string);
    const [search, setSearch] = React.useState("");
    const [mainActes, setMainActes] = useState<any>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [newAct, setNewAct] = useState(null);

    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {trigger} = useRequestQueryMutation("/act/update");

    const {data: httpActs, mutate} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/insurances/${router.query.uuid}/act/${router.locale}`,
    });
    const headCells = [
        {
            id: "act",
            numeric: false,
            disablePadding: false,
            label: "act",
            align: "left",
            sortable: true,
        },
        {
            id: "fees",
            numeric: false,
            disablePadding: false,
            label: "fees",
            align: "center",
            sortable: false,
        },
        {
            id: "rem_amount",
            numeric: true,
            disablePadding: false,
            label: "rem_amount",
            align: "center",
            sortable: false,
        },
        {
            id: "patient_share",
            numeric: true,
            disablePadding: false,
            label: "patient_share",
            align: "center",
            sortable: false,
        },
        {
            id: "apci",
            numeric: false,
            disablePadding: false,
            label: "apci",
            align: "center",
            sortable: false,
        }, {
            id: "action",
            numeric: false,
            disablePadding: false,
            label: "action",
            align: "center",
            sortable: false,
        },
    ];
    const handleChange = (row: ActModel) => {
        const updated = mainActes.map((item: ActModel) => {
            if (item.uuid === row.uuid) {
                return row
            }
            return item;
        })
        console.log(updated)
        setMainActes(updated);
    }
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearch(query);
        if (query.length === 0) return setMainActes(httpActs?.data.acts)
        const data = mainActes.filter((row: any) => {
            return row?.act?.name.toLowerCase().includes(query.toLowerCase())
        })
        setMainActes(data);
    }
    const handleEvent = ({...props}) => {
        if (props.action === "DELETE")
            trigger({
                method: "DELETE",
                url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/insurances/${router.query.uuid}/act/${props.data.uuid}/${router.locale}`,
            }, {
                onSuccess: () => {
                    mutate()
                    setLoading(false);
                },
                onError: () => setLoading(false)
            });
    }

    useEffect(() => {
        setLoading(true);
        if (httpActs) {
            setMainActes(httpActs.data.acts as ActModel[]);
            setLoading(false);
        }
    }, [httpActs]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t("path.update")}</p>
                </RootStyled>
                <Button
                    onClick={() => {setOpen(true)}}
                    startIcon={<Add/>}
                    variant="contained"
                >
                    {t("add")}
                </Button>
            </SubHeader>

            <Box className="container">
                <DesktopContainer>
                    <Otable
                        headers={headCells}
                        toolbar={<Toolbar {...{t, search, handleSearch}} />}
                        rows={mainActes}
                        from={"act-row-insurance"}
                        {...{t, loading, handleChange, handleEvent,apcis,mutate,setLoading,trigger,urlMedicalEntitySuffix,medicalEntityHasUser,router}}
                        total={httpActs?.data.currentPage}
                        totalPages={httpActs?.data.totalPages}
                        pagination
                    />
                </DesktopContainer>
                <MobileContainer>
                    <Paper component={Stack} spacing={1} sx={{p: 2, borderRadius: 1}}>
                        <Toolbar {...{t, search, handleSearch}} />
                        {
                            mainActes.map((act: ActModel) => (
                                <React.Fragment key={act.uuid}>
                                    <ActMobileCard row={act} {...{t, loading, handleChange}} />
                                </React.Fragment>
                            ))
                        }

                    </Paper>
                </MobileContainer>
                <Box p={4}>
                    <SubFooter sx={{".MuiToolbar-root": {justifyContent: 'flex-end'}}}>
                        <Button startIcon={<IconUrl path="ic-check"/>} variant="contained">
                            {t("save")}
                        </Button>
                    </SubFooter>
                </Box>
            </Box>

            <MedDialog
                action={"add-act"}
                open={open}
                data={{t,newAct, setNewAct,apcis}}
                dialogClose={() => {
                    setOpen(false)
                }}
                onClose={() => {
                    setOpen(false)
                }}
                headerDialog={
                    <DialogTitle
                        sx={{
                            backgroundColor: (theme: Theme) => theme.palette.primary.main,
                            position: "relative",
                        }}
                        id="scroll-dialog-title">
                        {t("dialog.addAct")}
                    </DialogTitle>
                }
                actionDialog={
                    <>
                        <Button
                            variant="text-primary"
                            onClick={() => {
                                setOpen(false)
                            }}
                            startIcon={<CloseIcon/>}>
                            {t("dialogs.merge-dialog.cancel")}
                        </Button>
                        <LoadingButton
                            {...{loading}}
                            loadingPosition="start"
                            variant="contained"
                            color={"error"}
                            onClick={()=>{}}
                            startIcon={<ArchiveRoundedIcon/>}>
                            {t("dialogs.merge-dialog.confirm")}
                        </LoadingButton>
                    </>
                }
            />
        </>
    );
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
};
export const getStaticProps: GetStaticProps = async ({locale}) => {

    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(locale as string, [
                "common",
                "menu",
                "patient",
                "settings",
            ])),
        },
    }
};

export default Actes;

Actes.auth = true;

Actes.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
