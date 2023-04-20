import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {DashLayout} from "@features/base";
import {
    Button,
    Box,
    Drawer,
    useMediaQuery,
    Stack,
    Toolbar,
    useTheme,
    Theme,
    IconButton,
} from "@mui/material";
import {RootStyled} from "@features/toolbar";
import {useRouter} from "next/router";
import {configSelector} from "@features/base";
import {SubHeader} from "@features/subHeader";
import {useAppSelector} from "@app/redux/hooks";
import {Otable} from "@features/table";
import {PfTemplateDetail} from "@features/pfTemplateDetail";
import {useRequest, useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import AddIcon from "@mui/icons-material/Add";
import {LoadingScreen} from "@features/loadingScreen";
import {MobileContainer} from "@themes/mobileContainer";
import {DesktopContainer} from "@themes/desktopConainter";
import {FileTemplateMobileCard} from "@features/card";
import {useSnackbar} from "notistack";
import CloseIcon from "@mui/icons-material/Close";

function PatientFileTemplates() {
    const {data: session} = useSession();
    const theme: Theme = useTheme();

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const {data: user} = session as Session;
    const isMobile = useMediaQuery("(max-width:669px)");
    const {direction} = useAppSelector(configSelector);
    const router = useRouter();
    const [state, setState] = useState({
        active: true,
    });
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

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {
        data: modalsHttpResponse,
        error,
        mutate,
    } = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/modals?page=${router.query.page || 1}&limit=10&withPagination=true`,
        headers: {Authorization: `Bearer ${session?.accessToken}`},
    });

    const {trigger} = useRequestMutation(
        null,
        "/settings/patient-file-template"
    );

    useEffect(() => {
        if (modalsHttpResponse !== undefined) {
            setRows((modalsHttpResponse as HttpResponse).data);
        }
    }, [modalsHttpResponse]);

    const handleChange = (props: ModalModel, event: string, value: string) => {
        props.isEnabled = !props.isEnabled;
        setState({...state});
        const form = new FormData();
        form.append("enabled", props.isEnabled.toString());
        trigger(
            {
                method: "PATCH",
                url:
                    "/api/medical-entity/" +
                    medical_entity.uuid +
                    "/modals/" +
                    props.uuid +
                    "/activity",
                data: form,
                headers: {
                    ContentType: "application/x-www-form-urlencoded",
                    Authorization: `Bearer ${session?.accessToken}`,
                },
            },
            {revalidate: true, populateCache: true}
        )
            .then((r) => enqueueSnackbar("updated", {variant: "success"}))
            .finally(() => closeSnackbar());
    };

    const handleEdit = (props: ModalModel, event: string, value: string) => {
        setOpen(true);
        setAction(event);
        setData(props);
    };

    const closeDraw = () => {
        setOpen(false);
    };

    const {t, ready} = useTranslation("settings", {
        keyPrefix: "templates.config",
    });
    if (!ready)
        return (
            <LoadingScreen
                error
                button={"loading-error-404-reset"}
                text={"loading-error"}
            />
        );

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t("path")}</p>
                </RootStyled>

                <Button
                    type="submit"
                    variant="contained"
                    onClick={() => {
                        setOpen(true);
                        setData(null);
                        setAction("add");
                    }}
                    color="success">
                    {!isMobile ? t("add") : <AddIcon/>}
                </Button>
            </SubHeader>
            <Box
                bgcolor={theme.palette.background.default}
                sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                <DesktopContainer>
                    <Otable
                        headers={headCells}
                        rows={rows}
                        state={state}
                        from={"template"}
                        t={t}
                        edit={handleEdit}
                        handleConfig={null}
                        handleChange={handleChange}
                        total={(modalsHttpResponse as HttpResponse)?.data?.total}
                        totalPages={(modalsHttpResponse as HttpResponse)?.data?.totalPages}
                        pagination
                    />
                </DesktopContainer>
                <MobileContainer>
                    <Stack spacing={1}>
                        {rows?.map((row, idx) => (
                            <React.Fragment key={idx}>
                                <FileTemplateMobileCard
                                    data={row}
                                    edit={handleEdit}
                                    handleConfig={null}
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
                        <Toolbar sx={{bgcolor: theme.palette.common.white}}>
                            <Stack alignItems="flex-end" width={1}>
                                <IconButton onClick={closeDraw} disableRipple>
                                    <CloseIcon/>
                                </IconButton>
                            </Stack>
                        </Toolbar>
                    )}

                    <PfTemplateDetail
                        action={action}
                        mutate={mutate}
                        closeDraw={closeDraw}
                        data={data}></PfTemplateDetail>
                </Drawer>
            </Box>
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
export default PatientFileTemplates;

PatientFileTemplates.auth = true;

PatientFileTemplates.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
