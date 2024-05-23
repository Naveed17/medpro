import React, { ReactElement, useEffect, useState } from "react";
import { configSelector, DashLayout } from "@features/base";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { SubHeader } from "@features/subHeader";
import {
    Box,
    Button,
    DialogActions,
    Drawer,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import dynamic from "next/dynamic";

import { LoadingScreen } from "@features/loadingScreen";

import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useRequestQuery, useRequestQueryMutation } from "@lib/axios";
import { ImportDataMobileCard, NoDataCard } from "@features/card";
import {
    importDataUpdate,
    onOpenPatientDrawer,
    Otable,
    tableActionSelector,
} from "@features/table";
import { Dialog } from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import { LoadingButton } from "@mui/lab";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";
import { useSnackbar } from "notistack";
import IconUrl from "@themes/urlIcon";
import { resetDuplicated } from "@features/duplicateDetected";
import { MobileContainer } from "@themes/mobileContainer";
import { DesktopContainer } from "@themes/desktopConainter";
import { useMedicalEntitySuffix } from "@lib/hooks";
import { ReactQueryNoValidateConfig } from "@lib/axios/useRequestQuery";
import Can from "@features/casl/can";
import { Breadcrumbs } from "@features/breadcrumbs";

const PatientDetail = dynamic(
    () =>
        import("@features/dialog/components/patientDetail/components/patientDetail")
);
const DuplicateDetected = dynamic(
    () => import("@features/duplicateDetected/components/duplicateDetected")
);
const breadcrumbsData = [
    {
        title: "Settings",
        href: "/dashboard/settings"
    },
    {
        title: "Data Exportation",
        href: null
    }

]
const headImportDataCells = [
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "name",
        align: "left",
        sortable: true,
    },
    {
        id: "type",
        numeric: false,
        disablePadding: true,
        label: "type",
        align: "center",
        sortable: true,
    },
    {
        id: "status",
        numeric: false,
        disablePadding: true,
        label: "status",
        align: "center",
        sortable: true,
    },
    {
        id: "source",
        numeric: false,
        disablePadding: true,
        label: "source",
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

const ImportCardData = {
    mainIcon: "ic-upload-3",
    title: "no-data.title",
    description: "no-data.description",
};

function Data() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const { urlMedicalEntitySuffix } = useMedicalEntitySuffix();

    const { tableState } = useAppSelector(tableActionSelector);
    const { direction } = useAppSelector(configSelector);
    const { t, ready, i18n } = useTranslation(["settings", "common"], { keyPrefix: "import-data" });

    const { trigger: triggerDeleteImportData } = useRequestQueryMutation("/import/data/delete");

    const { data: httpImportDataResponse, mutate: mutateImportData } = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/import/data/${router.locale}`
    }, ReactQueryNoValidateConfig);

    const importData = (httpImportDataResponse as HttpResponse)?.data as {
        currentPage: number;
        totalPages: number;
        list: ImportDataModel[];
    };

    const [loading, setLoading] = useState<boolean>(false);
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<string | null>(null);
    const [patientDetailDrawer, setPatientDetailDrawer] = useState<boolean>(false);
    const [duplicateDetectedDialog, setDuplicateDetectedDialog] = useState(false);
    const [errorsDuplication] = useState<
        Array<{
            key: string;
            row: string;
            data: Array<PatientImportModel>;
            fixed: boolean;
        }>
    >([]);
    const [duplicatedData, setDuplicatedData] = useState<any>(null);

    const handleTableEvent = (action: string, uuid: string) => {
        switch (action) {
            case "delete-import":
                setSelectedRow(uuid);
                setDeleteDialog(true);
                break;
        }
    };

    const handleDuplicatedPatient = () => {
        setDuplicateDetectedDialog(false);
        (
            errorsDuplication.find((err) => err.key === duplicatedData.key) as any
        ).fixed = true;
        dispatch(resetDuplicated());
    };

    const handleDeleteImportData = (uuid: string) => {
        setLoading(true);
        triggerDeleteImportData({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/import/data/${uuid}/${router.locale}`
        }, {
            onSuccess: (value) => {
                if ((value?.data as any).status === "success") {
                    setDeleteDialog(false);
                    setSelectedRow(null);
                    mutateImportData();
                    enqueueSnackbar(t(`alert.delete-import`), { variant: "success" });
                }
                setLoading(false);
            }
        });
    };

    const handleExportData = () => {
        setLoading(true);
        const params = new FormData();
        params.append("type", "1");
        params.append("method", "");

        triggerDeleteImportData({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/import/data/${router.locale}`,
            data: params
        }, {
            onSuccess: (value) => {
                if ((value?.data as any).status === "success") {
                    mutateImportData();
                    enqueueSnackbar(t(`alert.export`), { variant: "success" });
                }
                setLoading(false);
            }
        });
    };

    useEffect(() => {
        if (importData) {
            dispatch(
                importDataUpdate({
                    data: importData.list,
                    mutate: mutateImportData,
                })
            );
        }
    }, [dispatch, importData]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        //reload resources from cdn servers
        i18n.reloadResources(i18n.resolvedLanguage, ["settings", "common"]);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready)
        return (
            <LoadingScreen
                button
                text={"loading-error"}
            />
        );

    return (
        <>
            <SubHeader>
                <Stack
                    mt={2}
                    pb={1}
                    direction="row"
                    justifyContent="space-between"
                    width={1}
                    alignItems="center">
                    <Stack spacing={1}>
                        <Breadcrumbs data={breadcrumbsData} />
                        <Typography variant="subtitle1">
                            {t("title")}
                        </Typography>
                    </Stack>
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center">
                        <Can I={"manage"} a={"settings"} field={"settings__data__import"}>
                            {(process.env.NODE_ENV === "development" ||
                                (importData &&
                                    (importData.list.length === 0 ||
                                        (importData.list.length > 0 &&
                                            importData.list[0].status === 3)))) && (
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        onClick={() => {
                                            router.push("/dashboard/settings/data/import");
                                        }}
                                        color="success">
                                        {t("add")}
                                    </Button>
                                )}
                        </Can>

                        <LoadingButton
                            disabled={importData?.list.findIndex(data => data?.type === 1) !== -1}
                            {...{ loading }}
                            loadingPosition={"start"}
                            type="submit"
                            variant="contained"
                            onClick={handleExportData}
                            color="primary">
                            {t("export")}
                        </LoadingButton>
                    </Stack>
                </Stack>
            </SubHeader>
            <Box className="container">
                {importData && importData.list.length === 0 ? (
                    <NoDataCard
                        {...{ t }}
                        ns={"settings"}
                        firstbackgroundonly="true"
                        data={ImportCardData}
                    />
                ) : (
                    <>
                        <DesktopContainer>
                            <Otable
                                {...{
                                    t,
                                    setPatientDetailDrawer,
                                    setDuplicatedData,
                                    setDuplicateDetectedDialog,
                                }}
                                handleEvent={(action: string, uuid: string) =>
                                    handleTableEvent(action, uuid)
                                }
                                headers={headImportDataCells}
                                rows={importData ? importData.list : []}
                                pagination
                                total={importData?.totalPages * 10}
                                totalPages={importData?.totalPages}
                                from={"import_data"}
                            />
                        </DesktopContainer>
                        <MobileContainer>
                            <Stack spacing={2}>
                                {(importData ? importData.list : []).map((item, idx) => (
                                    <React.Fragment key={idx}>
                                        <ImportDataMobileCard
                                            t={t}
                                            data={item}
                                            handleEvent={(action: string, uuid: string) =>
                                                handleTableEvent(action, uuid)
                                            }
                                        />
                                    </React.Fragment>
                                ))}
                            </Stack>
                        </MobileContainer>
                    </>
                )}

                <Dialog
                    color={theme.palette.error.main}
                    contrastText={theme.palette.error.contrastText}
                    dialogClose={() => setDeleteDialog(false)}
                    sx={{
                        direction: direction,
                    }}
                    action={() => {
                        return (
                            <Box sx={{ minHeight: 150 }}>
                                <Typography sx={{ textAlign: "center" }} variant="subtitle1">
                                    {t(`dialogs.reInitDialog.sub-title`)}{" "}
                                </Typography>
                                <Typography sx={{ textAlign: "center" }} margin={2}>
                                    {t(`dialogs.reInitDialog.description`)}
                                </Typography>
                            </Box>
                        );
                    }}
                    open={deleteDialog}
                    title={t(`dialogs.reInitDialog.title`)}
                    actionDialog={
                        <>
                            <Button
                                variant="text-primary"
                                onClick={() => setDeleteDialog(false)}
                                startIcon={<CloseIcon />}>
                                {t(`dialogs.reInitDialog.cancel`)}
                            </Button>
                            <LoadingButton
                                {...{ loading }}
                                onClick={() => handleDeleteImportData(selectedRow as string)}
                                loadingPosition="start"
                                variant="contained"
                                color={"error"}
                                startIcon={<RestartAltIcon />}>
                                {t(`dialogs.reInitDialog.confirm`)}
                            </LoadingButton>
                        </>
                    }
                />

                <Drawer
                    anchor={"right"}
                    open={patientDetailDrawer}
                    dir={direction}
                    onClose={() => {
                        dispatch(onOpenPatientDrawer({ patientId: "" }));
                        setPatientDetailDrawer(false);
                    }}>
                    <PatientDetail
                        {...{ isAddAppointment: false, patientId: tableState.patientId }}
                        onCloseDialog={() => {
                            dispatch(onOpenPatientDrawer({ patientId: "" }));
                            setPatientDetailDrawer(false);
                        }}
                        onAddAppointment={() => console.log("onAddAppointment")}
                    />
                </Drawer>

                <Dialog
                    {...{
                        sx: {
                            minHeight: 340,
                        },
                    }}
                    color={theme.palette.primary.main}
                    contrastText={theme.palette.primary.contrastText}
                    dialogClose={() => {
                        setDuplicateDetectedDialog(false);
                    }}
                    action={() => {
                        return (
                            duplicatedData && <DuplicateDetected data={duplicatedData} />
                        );
                    }}
                    actionDialog={
                        <DialogActions
                            sx={{
                                justifyContent: "space-between",
                                width: "100%",
                                "& .MuiDialogActions-root": {
                                    div: {
                                        width: "100%",
                                    },
                                },
                            }}>
                            <Stack
                                direction={"row"}
                                justifyContent={"space-between"}
                                sx={{ width: "100%" }}>
                                <Button
                                    onClick={() => setDuplicateDetectedDialog(false)}
                                    startIcon={<CloseIcon />}>
                                    {t("dialogs.duplication-dialog.later")}
                                </Button>
                                <Box>
                                    <Button
                                        sx={{ marginRight: 1 }}
                                        color={"inherit"}
                                        startIcon={<CloseIcon />}>
                                        {t("dialogs.duplication-dialog.no-duplicates")}
                                    </Button>
                                    <Button
                                        onClick={handleDuplicatedPatient}
                                        variant="contained"
                                        startIcon={<IconUrl path="ic-dowlaodfile"></IconUrl>}>
                                        {t("dialogs.duplication-dialog.save")}
                                    </Button>
                                </Box>
                            </Stack>
                        </DialogActions>
                    }
                    open={duplicateDetectedDialog}
                    title={t(`dialogs.duplication-dialog.title`)}
                />
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
            "settings"
        ])),
    },
});

export default Data;
Data.auth = true;

Data.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
