import {GetStaticPaths, GetStaticProps} from "next";
import React, {ReactElement, useEffect, useState} from "react";
import {DashLayout, dashLayoutSelector} from "@features/base";
import {getServerTranslations} from "@lib/i18n/getServerTranslations";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import useApci from "@lib/hooks/rest/useApci";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {Box, Button, DialogTitle, Paper, Stack, Theme, Toolbar} from "@mui/material";
import {DesktopContainer} from "@themes/desktopConainter";
import {Otable} from "@features/table";
import {SubHeader} from "@features/subHeader";
import {MobileContainer} from "@themes/mobileContainer";
import {ActMobileCard} from "@features/card";
import {SubFooter} from "@features/subFooter";
import IconUrl from "@themes/urlIcon";
import {LoadingButton} from "@mui/lab";
import CloseIcon from "@mui/icons-material/Close";
import {RootStyled} from "@features/toolbar";
import {Dialog as MedDialog} from "@features/dialog";
import {Add} from "@mui/icons-material";

function InscDetail() {

    const router = useRouter();
    const {t} = useTranslation("settings", {keyPrefix: 'insurance.config'});
    const {apcis} = useApci(router.query.name as string);
    const [search, setSearch] = React.useState("");
    const [mainActes, setMainActes] = useState<any>([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [newAct, setNewAct] = useState<any>(null);

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
    const save = () => {
        if (newAct) {
            const method = newAct.uuid ? "PUT" : "POST"
            const url = newAct.uuid ? `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/insurances/${router.query.uuid}/act/${newAct.uuid}/${router.locale}` : `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/insurances/${router.query.uuid}/act/${router.locale}`;

            const form = new FormData();
            form.append("fees", newAct.fees)
            form.append("refund", newAct.refund ? newAct.refund : 0)
            form.append("patient_part", newAct.patient_part)
            form.append("apcis", newAct.apci)
            if (method === "POST")
                form.append("act", newAct.md_act)

            trigger({
                method,
                url,
                data: form
            }, {
                onSuccess: () => {
                    mutate()
                    setLoading(false);
                    setNewAct(null);
                    setOpen(false)
                },
                onError: () => setLoading(false)
            });
        }
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
                    onClick={() => {
                        setOpen(true)
                    }}
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
                        rows={mainActes}
                        from={"act-row-insurance"}
                        {...{
                            t,
                            loading,
                            handleChange,
                            handleEvent,
                            apcis,
                            mutate,
                            setLoading,
                            trigger,
                            urlMedicalEntitySuffix,
                            medicalEntityHasUser,
                            router
                        }}
                        total={httpActs?.data.currentPage}
                        totalPages={httpActs?.data.totalPages}
                        pagination
                    />
                </DesktopContainer>
                <MobileContainer>
                    <Paper component={Stack} spacing={1} sx={{p: 2, borderRadius: 1}}>
                        {/*<Toolbar {...{t, search, handleSearch}} />*/}
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
                data={{t, newAct, setNewAct, apcis, mainActes}}
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
                        {t("act")}
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
                            {t("cancel")}
                        </Button>
                        <LoadingButton
                            {...{loading}}
                            disabled={!newAct}
                            variant="contained"
                            onClick={save}>
                            {t("save")}
                        </LoadingButton>
                    </>
                }
            />
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await getServerTranslations(context.locale as string, [
            "common",
            "menu",
            "patient",
            "settings",
        ])),
    },
});
export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
};
export default InscDetail;

InscDetail.auth = true;

InscDetail.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
