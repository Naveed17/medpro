import {GetStaticPaths, GetStaticProps} from "next";
import React, {ReactElement, useState} from "react";
import {configSelector, DashLayout, dashLayoutSelector} from "@features/base";
import {SubHeader} from "@features/subHeader";
import {DocToolbar} from "@features/toolbar";
import {Box, Button, Drawer, IconButton, Stack, Toolbar, Typography} from "@mui/material";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {Otable} from "@features/table";
import {useTranslation} from "next-i18next";
import dynamic from "next/dynamic";
import {SubFooter} from "@features/subFooter";
import IconUrl from "@themes/urlIcon";
import {LoadingButton} from "@mui/lab";
import {DocFilter, ocrDocumentSelector, resetOcrData} from "@features/leftActionBar";
import {useLeavePageConfirm} from "@lib/hooks/useLeavePageConfirm";
import {
    appointmentSelector, onResetPatient,
    resetAppointment
} from "@features/tabPanel";
import {instanceAxios, useRequestQueryMutation} from "@lib/axios";
import {useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import {batch} from "react-redux";
import {dehydrate, QueryClient} from "@tanstack/query-core";
import {MobileContainer} from "@themes/mobileContainer";
import {DrawerBottom} from "@features/drawerBottom";
import {Document as DocumentPdf, Page} from "react-pdf";
import {getUrlExtension} from "@lib/hooks/getUrlExtension";
import CloseIcon from "@mui/icons-material/Close";
// table head data
const headCells: readonly HeadCell[] = [
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "header.name",
        sortable: true,
        align: "left"
    },
    {
        id: "value",
        numeric: false,
        disablePadding: true,
        label: "header.value",
        sortable: true,
        align: "left"
    }
]

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function Document() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {trigger: invalidateQueries} = useInvalidateQueries();

    const {t, ready} = useTranslation("docs");
    const ocrData = useAppSelector(ocrDocumentSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {patient} = useAppSelector(appointmentSelector);
    const {direction} = useAppSelector(configSelector);

    const [loading, setLoading] = useState(false);
    const [filterBottom, setFilterBottom] = useState<boolean>(false);
    const [openPreviewDrawer, setOpenPreviewDrawer] = useState<boolean>(false);
    const [preview, setPreview] = useState<any>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);

    const {trigger: triggerOcrEdit} = useRequestQueryMutation("document/ocr/edit");

    const handleAssignOcrDocument = () => {
        setLoading(true);
        const documentUuid = router.query.document ?? null;
        const form = new FormData();
        form.append("type", ocrData.type?.uuid ?? ocrData.type);
        form.append("name", ocrData.name ?? "");
        form.append("patient", ocrData.patient.uuid);
        if (ocrData?.target === "appointment" && ocrData?.appointment) {
            form.append("appointment", ocrData.appointment.uuid);
        }

        medicalEntityHasUser && triggerOcrEdit({
            method: "PUT",
            url: `${urlMedicalEntitySuffix}/ocr/documents/${documentUuid}/${router.locale}`,
            data: form
        }, {
            onSuccess: () => router.push('/dashboard/documents').then(() => medicalEntityHasUser && invalidateQueries([`${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/ocr/documents/${router.locale}`])),
            onSettled: () => setLoading(false)
        });
    }

    const onDocumentLoadSuccess = ({numPages}: {
        numPages: number
    }) => {
        setNumPages(numPages);
    }

    useLeavePageConfirm(() => {
        batch(() => {
            dispatch(onResetPatient());
            dispatch(resetAppointment());
            dispatch(resetOcrData());
        });
    });

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <>
            <SubHeader
                sx={{
                    ".MuiToolbar-root": {
                        flexDirection: {xs: "column", md: "row"},
                        py: {md: 0, xs: 2}
                    }
                }}>
                <DocToolbar
                    showPreview={() => {
                        const url = ocrData.uri?.url
                        const extension = getUrlExtension(url, '?');
                        setPreview({
                            type: extension,
                            url
                        });
                        setTimeout(() => setOpenPreviewDrawer(true));
                    }}/>
            </SubHeader>
            <Box className="container">
                <Otable
                    {...{t}}
                    headers={headCells}
                    rows={ocrData?.data ?? []}
                    total={0}
                    totalPages={1}
                    from={"ocrDocument"}
                    pagination
                />

                <Box pt={8}>
                    <SubFooter>
                        <Stack
                            width={1}
                            spacing={{xs: 1, md: 0}}
                            padding={{xs: 1, md: 0}}
                            direction={{xs: "column", md: "row"}}
                            alignItems="flex-end"
                            justifyContent={"flex-end"}>
                            <LoadingButton
                                {...{loading}}
                                disabled={patient === null || ocrData?.name?.length === 0}
                                loadingPosition={"start"}
                                onClick={handleAssignOcrDocument}
                                color={"primary"}
                                className="btn-action"
                                startIcon={<IconUrl path="add-doc"/>}
                                variant="contained"
                                sx={{".react-svg": {mr: 1}}}>
                                {t("classify-document")}
                            </LoadingButton>
                        </Stack>
                    </SubFooter>
                </Box>

                <Drawer
                    anchor={"right"}
                    open={openPreviewDrawer}
                    sx={{
                        ".MuiToolbar-root": {
                            zIndex: 1
                        },
                        "& .MuiPaper-root": {
                            minWidth: 400
                        },
                        '& .react-pdf__Page': {
                            scale: '0.6',
                            transformOrigin: 'center',
                            width: "30vw"
                        },
                        '& .container__document': {
                            height: '98%',
                            width: '100%',
                            minWidth: 400
                        },
                        '& .container__document .react-pdf__Document': {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            zIndex: 0
                        },
                        '& .container__document .react-pdf__Page': {
                            margin: '-4em 0',
                            boxShadow: (theme) => theme.shadows[5]
                        },
                        '& .container__document .react-pdf__message': {
                            padding: 20,
                            color: 'white'
                        }
                    }}
                    dir={direction}
                    onClose={() => {
                        setOpenPreviewDrawer(false);
                    }}>
                    <Toolbar sx={{bgcolor: (theme) => theme.palette.common.white}}>
                        <Stack sx={{width: "100%"}} direction={"row"} alignItems="center"
                               justifyContent={"space-between"}>
                            <Typography
                                ml={1}
                                fontSize={18}
                                fontWeight={600}
                                variant="body2" color="text.primary">
                                {t("preview-document")}
                            </Typography>
                            <IconButton onClick={() => setOpenPreviewDrawer(false)} disableRipple>
                                <CloseIcon/>
                            </IconButton>
                        </Stack>
                    </Toolbar>
                    {preview && <Box className={'container__document'} height={"100%"} margin={2}>
                        {["png", "jpeg", "jpg"].includes(preview.type) ?
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={preview.url}
                                id="displayFile"
                                height="100%"
                                width="100%"
                                alt={"File"}/> :
                            <DocumentPdf
                                className={'textLayer'}
                                file={preview.url}
                                onLoadSuccess={onDocumentLoadSuccess}
                                loading={t('wait')}>
                                <Page pageNumber={pageNumber}/>
                            </DocumentPdf>}
                    </Box>}
                </Drawer>
                <MobileContainer>
                    <Button
                        startIcon={<IconUrl path="ic-filter"/>}
                        variant="filter"
                        onClick={() => setFilterBottom(true)}
                        sx={{
                            position: "fixed",
                            bottom: 80,
                            transform: "translateX(-50%)",
                            left: "50%",
                            zIndex: 999,

                        }}>
                        {t("filter.title")}
                    </Button>
                </MobileContainer>
                <DrawerBottom
                    handleClose={() => setFilterBottom(false)}
                    open={filterBottom}
                    title={t("filter.title")}>
                    <DocFilter/>
                </DrawerBottom>
            </Box>
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({locale}) => {
    const queryClient = new QueryClient();
    const countries = `/api/public/places/countries/${locale}?nationality=true`;

    await queryClient.prefetchQuery([countries], async () => {
        const {data} = await instanceAxios.request({
            url: countries,
            method: "GET"
        });
        return data
    });
    return {
        props: {
            dehydratedState: dehydrate(queryClient),
            fallback: false,
            ...(await serverSideTranslations(locale as string, ["menu", "common", "docs", "agenda", "patient"])),
        },
    };
}

export const getStaticPaths: GetStaticPaths<{
    slug: string
}> = async () => {
    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: "blocking", //indicates the type of fallback
    };
}

export default Document;

Document.auth = true;

Document.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
}
