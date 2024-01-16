import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {configSelector, DashLayout} from "@features/base";
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
import {useTranslation} from "next-i18next";
import {SubHeader} from "@features/subHeader";
import {useAppSelector} from "@lib/redux/hooks";
import {Otable} from "@features/table";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import {LoadingScreen} from "@features/loadingScreen";
import {useSnackbar} from "notistack";
import {LoadingButton} from "@mui/lab";
import Icon from "@themes/urlIcon";
import CloseIcon from '@mui/icons-material/Close';
import {useMedicalProfessionalSuffix} from "@lib/hooks";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {AnalysisDrawer} from "@features/drawer";
import {AnalysisMobileCard} from "@features/card";

function Analysis() {
    const theme: Theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const router = useRouter();
    const {enqueueSnackbar} = useSnackbar();
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
    const {t, ready} = useTranslation(["settings", "common"], {keyPrefix: "analysis.config"});
    const {direction} = useAppSelector(configSelector);
    const [loading, setLoading] = useState(false);
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
            id: "abbreviation",
            numeric: false,
            disablePadding: true,
            label: "abbreviation",
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

    const {trigger: triggerAnalisisDelete} = useRequestQueryMutation("/settings/analysis/delete");

    const {
        data: analysisResponse,
        mutate: mutateAnalysis
    } = useRequestQuery(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/analysis/${router.locale}`
    } : null, {
        ...ReactQueryNoValidateConfig,
        ...(urlMedicalProfessionalSuffix && {variables: {query: !isMobile ? `?page=${router.query.page || 1}&limit=10&withPagination=true&sort=true` : "?sort=true"}})
    });

    const removeAnalyise = (uuid: any) => {
        setLoading(true)
        urlMedicalProfessionalSuffix && triggerAnalisisDelete({
            method: "DELETE",
            url: `${urlMedicalProfessionalSuffix}/analysis/${uuid}/${router.locale}`
        }, {
            onSuccess: () => {
                enqueueSnackbar(t("alert.delete"), {variant: "success"});
                setLoading(false);
                setTimeout(() => setOpen(false));
                mutateAnalysis();
            }
        });
    }

    const handleScroll = () => {
        const total = (analysisResponse as HttpResponse)?.data.length;
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

    const configAnalysis = (props: any, event: string) => {
        setSelected(props);
        if (event === "edit" || event === "add") {
            setEdit(true);

        }
        if (event === "delete") {
            setOpen(true);
        }
    }

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
    }, [analysisResponse, displayedItems]); // eslint-disable-line react-hooks/exhaustive-deps

    const analysis = ((analysisResponse as HttpResponse)?.data ?? []) as AnalysisModel[];

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <>
            <SubHeader>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    width={1}
                    alignItems="center">
                    <Typography color="text.primary">{t("path")}</Typography>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => configAnalysis(null, "add")}
                        sx={{ml: "auto"}}>
                        {t("add")}
                    </Button>
                </Stack>
            </SubHeader>
            <DesktopContainer>
                <Box
                    sx={{
                        p: {xs: "40px 8px", sm: "30px 8px", md: 2},
                        "& table": {tableLayout: "fixed"},
                    }}>
                    <Otable
                        headers={headCells}
                        rows={analysis}
                        from={"analysis"}
                        pagination
                        t={t}
                        edit={configAnalysis}
                        total={(analysisResponse as HttpResponse)?.data?.total}
                        totalPages={(analysisResponse as HttpResponse)?.data?.totalPages}
                    />
                </Box>
            </DesktopContainer>
            <MobileContainer>
                <Container>
                    <Stack spacing={1} py={3.7}>
                        {analysis?.slice(0, displayedItems).map((row, idx) => (
                            <React.Fragment key={idx}>
                                <AnalysisMobileCard data={row} edit={configAnalysis} t={t}/>
                            </React.Fragment>
                        ))}
                    </Stack>
                </Container>
            </MobileContainer>
            <Drawer anchor={"right"} open={edit} dir={direction} onClose={closeDraw}>
                <AnalysisDrawer
                    data={selected}
                    mutateEvent={mutateAnalysis}
                    closeDraw={closeDraw}
                    t={t}
                />
            </Drawer>
            <Dialog
                PaperProps={{
                    sx: {
                        width: "100%",
                        m: 1
                    }
                }} maxWidth="sm" open={open}>
                <DialogTitle sx={{
                    bgcolor: (theme: Theme) => theme.palette.error.main,
                    px: 1,
                    py: 2,

                }}>
                    {t("dialog.delete.title")}
                </DialogTitle>
                <DialogContent style={{paddingTop: 20}}>
                    <Typography>
                        {t("dialog.delete.desc")}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{borderTop: 1, borderColor: "divider", px: 1, py: 2}}>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="text-black"
                            onClick={() => setOpen(false)}
                            startIcon={<CloseIcon/>}>
                            {t("dialog.cancel")}
                        </Button>
                        <LoadingButton
                            variant="contained"
                            loading={loading}
                            color="error"
                            onClick={() => removeAnalyise(selected?.uuid as any)}
                            startIcon={<Icon path="setting/icdelete" color="white"/>}>
                            {t("dialog.delete.delete")}
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
export default Analysis;

Analysis.auth = true;

Analysis.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
