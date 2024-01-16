import {SubHeader} from "@features/subHeader";
import {
    Box,
    Button, Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Drawer,
    Stack,
    Theme,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import React, {ReactElement, useState} from "react";
import {DesktopContainer} from "@themes/desktopConainter";
import {useTranslation} from "next-i18next";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {configSelector, DashLayout} from "@features/base";
import {LoadingScreen} from "@features/loadingScreen";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useRouter} from "next/router";
import {Otable} from "@features/table";
import {DrugsDrawer} from "@features/drawer";
import {useAppSelector} from "@lib/redux/hooks";
import {useMedicalProfessionalSuffix} from "@lib/hooks";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import Icon from "@themes/urlIcon";
import {useSnackbar} from "notistack";

function Drugs() {
    const theme: Theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const router = useRouter();
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
    const {enqueueSnackbar} = useSnackbar();

    const {t, ready} = useTranslation(["settings", "common"], {keyPrefix: "drugs.config"});
    const {direction} = useAppSelector(configSelector);

    const [edit, setEdit] = useState(false);
    const [selectedDrug, setSelectedDrug] = useState<any>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [loadingRequest, setLoadingRequest] = useState(false);

    const {data: drugsResponse, mutate: mutateDrugs} = useRequestQuery(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/drugs/${router.locale}`
    } : null, {
        ...ReactQueryNoValidateConfig,
        ...(urlMedicalProfessionalSuffix && {variables: {query: !isMobile ? `?page=${router.query.page || 1}&limit=10&withPagination=true&sort=true` : "?sort=true"}})
    });

    const {trigger: deleteDrugsTrigger} = useRequestQueryMutation("/settings/drug/delete");

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
            id: "dci",
            numeric: false,
            disablePadding: true,
            label: "dci",
            align: "center",
            sortable: false,
        },
        {
            id: "form",
            numeric: false,
            disablePadding: true,
            label: "form",
            align: "center",
            sortable: false,
        },
        {
            id: "laboratory",
            numeric: false,
            disablePadding: true,
            label: "laboratory",
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
    const drugs = ((drugsResponse as HttpResponse)?.data ?? []) as DrugModel[];

    const removeDrug = (uuid: string) => {
        setLoadingRequest(true)
        urlMedicalProfessionalSuffix && deleteDrugsTrigger({
            method: "DELETE",
            url: `${urlMedicalProfessionalSuffix}/drugs/${uuid}/${router.locale}`
        }, {
            onSuccess: () => {
                enqueueSnackbar(t("alert.delete"), {variant: "success"});
                setTimeout(() => setOpenDeleteDialog(false));
                mutateDrugs();
            },
            onSettled: () => setLoadingRequest(false)
        });
    }

    const handleTableActions = (data: any) => {
        setSelectedDrug(data?.row);
        switch (data.action) {
            case "DELETE_DRUGS":
                setOpenDeleteDialog(true);
                break;
            case "EDIT_DRUGS":
                setEdit(true);
                break;

        }
    }

    const closeDraw = () => {
        setEdit(false);
    }

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
                        onClick={() => {
                            setSelectedDrug(null);
                            setTimeout(() => setEdit(true));
                        }}
                        variant="contained"
                        color="success"
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
                        {...{t}}
                        headers={headCells}
                        handleEvent={handleTableActions}
                        rows={drugs}
                        from={"drugs"}
                    />
                </Box>
            </DesktopContainer>
            <Drawer anchor={"right"} open={edit} dir={direction} onClose={closeDraw}>
                <DrugsDrawer
                    {...{t, closeDraw}}
                    data={selectedDrug}
                />
            </Drawer>
            <Dialog
                PaperProps={{
                    sx: {
                        width: "100%",
                        m: 1
                    }
                }} maxWidth="sm" open={openDeleteDialog}>
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
                            onClick={() => {
                                setOpenDeleteDialog(false);
                                setTimeout(() => setSelectedDrug(null));
                            }}
                            startIcon={<CloseIcon/>}>
                            {t("dialog.cancel")}
                        </Button>
                        <LoadingButton
                            loading={loadingRequest}
                            loadingPosition={"start"}
                            variant="contained"
                            color="error"
                            onClick={() => removeDrug(selectedDrug?.uuid as string)}
                            startIcon={<Icon path="setting/icdelete" color="white"/>}>
                            {t("dialog.delete.delete")}
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    )
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, [
            "common",
            "menu",
            "settings"
        ])),
    },
});

export default Drugs;

Drugs.auth = true;

Drugs.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
