import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {lazy, ReactElement, Suspense, useEffect, useState,} from "react";
import {configSelector, DashLayout} from "@features/base";
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Container,
    Drawer,
    Stack,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {useTranslation} from "next-i18next";
import {EditMotifDialog} from "@features/editMotifDialog";
import {SubHeader} from "@features/subHeader";
import {useAppSelector} from "@app/redux/hooks";
import {Otable} from "@features/table";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRequest, useRequestMutation} from "@app/axios";
import {useRouter} from "next/router";
import {useDateConverture} from "@app/hooks";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import {LoadingScreen} from "@features/loadingScreen";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useSnackbar} from "notistack";

const MotifListMobile = lazy(
    (): any => import("@features/card/components/motifListMobile/motifListMobile")
);

function Motif() {
    const {data: session} = useSession();
    const theme: Theme = useTheme();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const durations = useDateConverture(15, 240);
    const delay = useDateConverture(1440, 21600);
    const [displayedItems, setDisplayedItems] = useState(10);
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {direction} = useAppSelector(configSelector);
    const {t, ready} = useTranslation(["settings", "common"], {
        keyPrefix: "motif.config",
    });
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [edit, setEdit] = useState(false);
    const [state, setState] = useState({
        duration: true,
        delay_min: true,
        delay_max: true,
        isEnabled: true,
    });
    const [selected, setSelected] = useState();

    const {trigger} = useRequestMutation(null, "/settings/motifs");
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse)
        .medical_entity as MedicalEntityModel;

    const {data: httpConsultReasonResponse, mutate: mutateConsultReason} =
        useRequest(
            {
                method: "GET",
                url: `/api/medical-entity/${medical_entity.uuid}/consultation-reasons/${
                    router.locale
                }${
                    !isMobile
                        ? `?page=${router.query.page || 1}&limit=10&withPagination=true`
                        : ""
                }`,
                headers: {Authorization: `Bearer ${session?.accessToken}`},
            },
            SWRNoValidateConfig
        );

    const closeDraw = () => {
        setEdit(false);
    };

    const reasons = (httpConsultReasonResponse as HttpResponse)?.data
        ?.list as ConsultationReasonModel[];
    const reasonsMobile = isMobile
        ? ((httpConsultReasonResponse as HttpResponse)
            ?.data as ConsultationReasonModel[])
        : [];

    if (!ready)
        return (
            <LoadingScreen
                error
                button={"loading-error-404-reset"}
                text={"loading-error"}
            />
        );

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
            numeric: false,
            disablePadding: false,
            label: "duration",
            align: "left",
            sortable: false,
        },
        /*{
                id: 'delay_min',
                numeric: false,
                disablePadding: false,
                label: 'delay_min',
                align: 'left',
                sortable: false
            },
            {
                id: 'delay_max',
                numeric: true,
                disablePadding: false,
                label: 'delay_max',
                align: 'left',
                sortable: false
            },*/
        /*{
                id: 'agenda',
                numeric: true,
                disablePadding: false,
                label: 'agenda',
                align: 'center',
                sortable: false
            },
            {
                id: 'type',
                numeric: false,
                disablePadding: false,
                label: 'type',
                align: 'center',
                sortable: true
            },*/
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
            align: "center",
            sortable: false,
        },
    ];

    const handleChange = (props: any, event: string, value: string) => {
        const form = new FormData();

        switch (event) {
            case "active":
                props.isEnabled = !props.isEnabled;
                if (!props.isEnabled) {
                    state.isEnabled = false;
                    setState({...state});
                }
                form.append(
                    "attribute",
                    JSON.stringify({attribute: "isEnable", value: props.isEnabled})
                );
                break;
            case "duration":
                props.duration = value;
                form.append(
                    "attribute",
                    JSON.stringify({attribute: "duration", value})
                );
                break;
            case "min":
                props.minimumDelay = value;
                form.append(
                    "attribute",
                    JSON.stringify({attribute: "minimumDelay", value})
                );
                break;
            case "max":
                props.maximumDelay = value;
                form.append(
                    "attribute",
                    JSON.stringify({attribute: "maximumDelay", value})
                );
                break;
            default:
                break;
        }

        trigger({
            method: "PATCH",
            url:
                "/api/medical-entity/" +
                medical_entity.uuid +
                "/consultation-reasons/" +
                props.uuid +
                "/" +
                router.locale,
            data: form,
            headers: {
                ContentType: "application/x-www-form-urlencoded",
                Authorization: `Bearer ${session?.accessToken}`,
            },
        })
            .then(() => {
                mutateConsultReason();
                enqueueSnackbar(t("updated"), {variant: "success"});
            })
            .then(() =>
                setTimeout(() => {
                    closeSnackbar();
                }, 1000)
            );
    };

    const handleConfig = (props: any, event: string) => {
        // @ts-ignore
        state[event] = !state[event];
        setState({...state});
    };

    const editMotif = (props: any) => {
        setEdit(true);
        setSelected(props);
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
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        // Add scroll listener

        let promise = new Promise(function (resolve, reject) {
            document.body.style.overflow = "hidden";
            setTimeout(() => {
                resolve(window.addEventListener("scroll", handleScroll));
            }, 2000);
        });
        promise.then(() => {
            setLoading(false);
            return (document.body.style.overflow = "visible");
        });

        return () => window.removeEventListener("scroll", handleScroll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [httpConsultReasonResponse, displayedItems]);
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
                        onClick={() => {
                            editMotif(null);
                        }}
                        sx={{ml: "auto"}}>
                        {t("add")}
                    </Button>
                </Stack>
            </SubHeader>

            <DesktopContainer>
                <Box sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                    <Otable
                        headers={headCells}
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
            <Backdrop
                sx={{color: "#fff", zIndex: theme.zIndex.drawer + 1}}
                open={loading && isMobile}>
                <CircularProgress color="inherit"/>
            </Backdrop>
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
export default Motif;

Motif.auth = true;

Motif.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
