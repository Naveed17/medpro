import React, {ReactElement, useState} from "react";
import {configSelector, DashLayout} from "@features/base";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {SubHeader} from "@features/subHeader";
import {Box, Button, Stack, Typography, useTheme} from "@mui/material";
import {LoadingScreen} from "@features/loadingScreen";
import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRequest, useRequestMutation} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {NoDataCard} from "@features/card";
import {Otable} from "@features/table";
import {ImportCardData} from "./import";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {useAppSelector} from "@app/redux/hooks";
import {useSnackbar} from "notistack";

const headImportDataCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: "name",
        align: 'left',
        sortable: true,
    }, {
        id: 'source',
        numeric: false,
        disablePadding: true,
        label: "source",
        align: 'center',
        sortable: true,
    },
    {
        id: 'action',
        numeric: false,
        disablePadding: false,
        label: 'action',
        align: 'right',
        sortable: false
    },
];

function Data() {
    const router = useRouter();
    const {data: session} = useSession();
    const {enqueueSnackbar} = useSnackbar();
    const theme = useTheme();

    const {direction} = useAppSelector(configSelector);
    const {t, ready} = useTranslation(["settings", "common"], {keyPrefix: "import-data"});

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {trigger: triggerDeleteImportData} = useRequestMutation(null, "/import/data/delete");

    const {data: httpImportDataResponse, mutate: mutateImportData} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/import/data/${router.locale}?page=1&limit=10`,
        headers: {
            Authorization: `Bearer ${session?.accessToken}`
        },
    }, SWRNoValidateConfig);

    const importData = (httpImportDataResponse as HttpResponse)?.data as ImportDataModel[];

    const [loading, setLoading] = useState<boolean>(false);
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<string | null>(null);

    const handleTableEvent = (action: string, uuid: string) => {
        switch (action) {
            case "delete-import":
                setSelectedRow(uuid);
                setDeleteDialog(true);
                break;
        }
    }

    const handleDeleteImportData = (uuid: string) => {
        setLoading(true);
        triggerDeleteImportData({
            method: "DELETE",
            url: `/api/medical-entity/${medical_entity.uuid}/import/data/${uuid}/${router.locale}`,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(value => {
            if ((value?.data as any).status === 'success') {
                setDeleteDialog(false);
                setSelectedRow(null);
                enqueueSnackbar(t(`alert.delete-import`), {variant: "success"});
            }
            setLoading(false);
        })
    }

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <>
            <SubHeader>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    width={1}
                    alignItems="center">
                    <Typography>{t("path")}</Typography>

                    <Button
                        type="submit"
                        variant="contained"
                        onClick={() => {
                            router.push('/dashboard/settings/data/import');
                        }}
                        color="success"
                    >
                        {t("add")}
                    </Button>
                </Stack>
            </SubHeader>
            <Box className="container">
                <Typography
                    textTransform="uppercase"
                    fontWeight={600}
                    marginBottom={2}
                    gutterBottom>
                    {t("history")}
                </Typography>

                {(importData && importData.length === 0) ?
                    <NoDataCard {...{t}} firstbackgroundonly="true" data={ImportCardData}/>
                    :
                    <Otable
                        {...{t}}
                        handleEvent={(action: string, uuid: string) =>
                            handleTableEvent(action, uuid)
                        }
                        headers={headImportDataCells}
                        isItemSelected
                        rows={importData ? importData : []}
                        from={"import_data"}/>
                }

                <Dialog
                    color={theme.palette.error.main}
                    contrastText={theme.palette.error.contrastText}
                    dialogClose={() => setDeleteDialog(false)}
                    sx={{
                        direction: direction
                    }}
                    action={() => {
                        return (
                            <Box sx={{minHeight: 150}}>
                                <Typography sx={{textAlign: "center"}}
                                            variant="subtitle1">{t(`dialogs.reInitDialog.sub-title`)} </Typography>
                                <Typography sx={{textAlign: "center"}}
                                            margin={2}>{t(`dialogs.reInitDialog.description`)}</Typography>
                            </Box>)
                    }}
                    open={deleteDialog}
                    title={t(`dialogs.reInitDialog.title`)}
                    actionDialog={
                        <>
                            <Button
                                variant="text-primary"
                                onClick={() => setDeleteDialog(false)}
                                startIcon={<CloseIcon/>}
                            >
                                {t(`dialogs.reInitDialog.cancel`)}
                            </Button>
                            <LoadingButton
                                {...{loading}}
                                onClick={() => handleDeleteImportData(selectedRow as string)}
                                loadingPosition="start"
                                variant="contained"
                                color={"error"}
                                startIcon={<RestartAltIcon/>}
                            >
                                {t(`dialogs.reInitDialog.confirm`)}
                            </LoadingButton>
                        </>
                    }
                />
            </Box>
        </>
    )
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

export default Data;
Data.auth = true;

Data.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
