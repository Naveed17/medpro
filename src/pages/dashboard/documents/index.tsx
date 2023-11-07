import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {configSelector, DashLayout, dashLayoutSelector} from "@features/base";
import {SubHeader} from "@features/subHeader";
import {DocsToolbar} from "@features/toolbar";
import {
    Box,
    Button,
    Card,
    CardContent,
    DialogActions,
    Divider,
    Grid,
    IconButton, LinearProgress,
    Stack,
    Typography,
    useTheme
} from "@mui/material";
import {useTranslation} from "next-i18next";
import dynamic from "next/dynamic";
import {NoDataCard} from "@features/card";
import Icon from "@themes/urlIcon";
import {CardStyled, Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import IconUrl from "@themes/urlIcon";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {InputStyled} from "@features/tabPanel";
import BorderLinearProgress from "@features/dialog/components/ocrDocsDialog/overrides/BorderLinearProgress";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {prepareSearchKeys, useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import {Label} from "@features/label";
import {docTypes, leftActionBarSelector} from "@features/leftActionBar";
import {Pagination} from "@features/pagination";
import {toggleSideBar} from "@features/menu";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function Documents() {
    const router = useRouter();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {t, ready} = useTranslation(["docs", "common"]);
    const {direction} = useAppSelector(configSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {query: filter} = useAppSelector(leftActionBarSelector);

    const [openAddOCRDocDialog, setOpenAddOCRDocDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [localFilter, setLocalFilter] = useState("");

    let page = parseInt((new URL(location.href)).searchParams.get("page") || "1");

    const {
        data: httpOcrDocumentsResponse,
        mutate: mutateOcrDocuments,
        isLoading: isOcrDocumentsLoading
    } = useRequestQuery(medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/ocr/documents/${router.locale}`
    } : null, {
        ...ReactQueryNoValidateConfig,
        ...(medicalEntityHasUser && {variables: {query: `?page=${page}&limit=12${prepareSearchKeys(filter as any)}`}})
    });

    const {trigger: triggerOcrDocUpload} = useRequestQueryMutation("/ocr/document/upload");

    const handleUploadDoc = (file: File) => {
        setLoading(true);
        const form = new FormData();
        form.append("files", file, file.name);
        medicalEntityHasUser && triggerOcrDocUpload({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/ocr/documents/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                mutateOcrDocuments();
            },
            onSettled: () => setLoading(false)
        });
    }

    const handleDeleteDoc = (index: number) => {

    }


    useEffect(() => {
        if (filter?.document?.name || filter?.document?.status) {
            const query = prepareSearchKeys(filter as any);
            setLocalFilter(query);
        } else if (localFilter.length > 0) {
            setLocalFilter("")
        }
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

    const ocrDocs = ((httpOcrDocumentsResponse as HttpResponse)?.data?.list ?? []) as OcrDocument[];
    const totalOcrDocs = ((httpOcrDocumentsResponse as HttpResponse)?.data?.total ?? 0) as number;
    const totalPagesOcrDocs = ((httpOcrDocumentsResponse as HttpResponse)?.data?.totalPages ?? 0) as number;
    const filesInProgress = ocrDocs.filter(doc => doc.status === 0) as OcrDocument[];
    const filesTreated = ocrDocs.filter(doc => doc.status !== 0) as OcrDocument[];

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <>
            <SubHeader
                sx={{
                    ".MuiToolbar-root": {
                        flexDirection: {xs: "column", md: "row"},
                        py: {md: 0, xs: 2},
                    },
                }}>
                <DocsToolbar onUploadOcrDoc={() => setOpenAddOCRDocDialog(true)}/>
            </SubHeader>

            <LinearProgress sx={{
                visibility: isOcrDocumentsLoading || loading ? "visible" : "hidden"
            }} color="warning"/>

            <Box className="container">
                {filesInProgress.length > 0 || filesTreated.length > 0 ?
                    <Stack spacing={2}>
                        <CardStyled>
                            <CardContent sx={{pb: 0}}>
                                <Typography fontSize={14} fontWeight={600}
                                            mb={1}>{t('document-in-progress')}</Typography>
                                <Divider/>
                                <Grid sx={{mt: 0}} container spacing={2}>
                                    {filesInProgress.map((file: OcrDocument, index: number) =>
                                        <Grid key={index} item xs={12} md={4}>
                                            <Card>
                                                <CardContent>
                                                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                                                        <IconUrl path={'ic-doc-upload'}/>
                                                        <Stack alignItems={"start"} spacing={.5} sx={{width: '75%'}}>
                                                            <Typography fontSize={12}
                                                                        fontWeight={400}>{file.title}</Typography>
                                                            <BorderLinearProgress variant="determinate" value={30}/>
                                                        </Stack>
                                                        <IconButton
                                                            onClick={() => handleDeleteDoc(index)}
                                                            disableRipple sx={{p: 0}}>
                                                            <IconUrl path="ic-close-btn" width={40} height={40}/>
                                                        </IconButton>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </Grid>)}
                                    <Grid item xs={12} md={4}>
                                        <Card sx={{
                                            backgroundColor: theme.palette.background.default,
                                            border: `1px dashed ${theme.palette.primary.main}`
                                        }}>
                                            <CardContent>
                                                <label htmlFor="contained-button-file">
                                                    <InputStyled
                                                        id="contained-button-file"
                                                        onChange={(e) => handleUploadDoc((e.target.files as FileList)[0])}
                                                        type="file"
                                                    />
                                                    <Stack sx={{cursor: "pointer"}} direction={"row"}
                                                           alignItems={"center"} spacing={2}>
                                                        <IconUrl path={'ic-upload-square'}/>
                                                        <Stack alignItems={"start"} alignContent={"center"}>
                                                            <Typography fontSize={12}
                                                                        fontWeight={400}>{t('dialogs.add-dialog.upload-title')}</Typography>
                                                            <Typography color={"primary.main"} fontSize={12}
                                                                        fontWeight={500}>{t('dialogs.add-dialog.upload-sub-title')}</Typography>
                                                        </Stack>
                                                    </Stack>
                                                </label>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </CardStyled>
                        {filesTreated.length > 0 && <CardStyled sx={{minHeight: '400px'}}>
                            <CardContent sx={{pb: 0}}>
                                <Typography fontSize={14} fontWeight={600} mb={1}>{t('document-treated')}</Typography>
                                <Divider/>
                                <Grid sx={{mt: 0}} container spacing={2}>
                                    {filesTreated.map((file: OcrDocument, index: number) =>
                                        <Grid
                                            key={index} item xs={12} md={4}
                                            {...(file.status !== 3 && {
                                                onClick: () => router.push({
                                                    pathname: `/dashboard/documents/${file.uuid}`,
                                                    query: {data: JSON.stringify(file)}
                                                }, `/dashboard/documents/${file.uuid}`).then(() => dispatch(toggleSideBar(false)))
                                            })}>
                                            <Card>
                                                <CardContent sx={{cursor: "pointer"}}>
                                                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                                                        <IconUrl path={'ic-doc-upload'}/>
                                                        <Stack alignItems={"start"} spacing={0} sx={{width: '75%'}}>
                                                            <Typography fontSize={12}
                                                                        fontWeight={400}>{file.title}</Typography>
                                                            <Label variant='filled'
                                                                   sx={{
                                                                       "& .MuiSvgIcon-root": {
                                                                           width: 16,
                                                                           height: 16,
                                                                           pl: 0
                                                                       }
                                                                   }}
                                                                   color={docTypes[file?.status]?.classColor}>
                                                                {docTypes[file?.status]?.icon}
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: 10,
                                                                    }}>
                                                                    {t(`doc-status.${docTypes[file.status].label}`)}</Typography>
                                                            </Label>
                                                        </Stack>
                                                        {file.status !== 3 && <IconButton
                                                            disableRipple sx={{p: 0}}>
                                                            <IconUrl path="ic-more" width={30} height={30}/>
                                                        </IconButton>}
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </Grid>)}
                                </Grid>
                                {(!isOcrDocumentsLoading && totalPagesOcrDocs > 1) && <Pagination
                                    sx={{m: ".8rem"}}
                                    pageTotal={12}
                                    count={totalPagesOcrDocs}
                                    total={totalOcrDocs}/>}
                            </CardContent>
                        </CardStyled>}
                    </Stack>
                    : !isOcrDocumentsLoading && <NoDataCard
                    {...{t}}
                    sx={{mt: "8%"}}
                    ns={"docs"}
                    onHandleClick={() => setOpenAddOCRDocDialog(true)}
                    data={{
                        mainIcon: "add-doc",
                        title: "no-data.docs.title",
                        description: "no-data.docs.description",
                        buttons: [{
                            text: "no-data.docs.import",
                            icon: <Icon path={"ic-agenda-+"} width={"18"} height={"18"}/>,
                            variant: "primary",
                            color: "white"
                        }]
                    }}
                />}
            </Box>

            <Dialog
                action={"ocr_docs"}
                {...{
                    direction,
                    sx: {
                        minHeight: 500
                    }
                }}
                data={{
                    t,
                    onDeleteDoc: handleDeleteDoc,
                    onSaveDoc: handleUploadDoc,
                    data: filesInProgress
                }}
                open={openAddOCRDocDialog}
                size={"md"}
                title={t("dialogs.add-dialog.title")}
                dialogClose={() => setOpenAddOCRDocDialog(false)}
                actionDialog={
                    <DialogActions sx={{width: "100%"}}>
                        <Stack direction={"row"} justifyContent={"space-between"} sx={{width: "100%"}}>
                            <Button variant="text-primary" onClick={() => setOpenAddOCRDocDialog(false)}
                                    startIcon={<CloseIcon/>}>
                                {t("cancel", {ns: "common"})}
                            </Button>
                            <Stack direction={"row"} spacing={1.2}>
                                <LoadingButton
                                    sx={{ml: "auto"}}
                                    loadingPosition="start"
                                    variant="contained"
                                    color={"info"}
                                    startIcon={<IconUrl path="ic-temps"/>}>
                                    {t("dialogs.add-dialog.later")}
                                </LoadingButton>
                                <LoadingButton
                                    {...{loading}}
                                    loadingPosition="start"
                                    variant="contained"
                                    startIcon={<IconUrl path="add-doc"/>}>
                                    {t("dialogs.add-dialog.confirm")}
                                </LoadingButton>
                            </Stack>
                        </Stack>
                    </DialogActions>
                }
            />
        </>
    )
}


export const getStaticProps: GetStaticProps = async ({locale}) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'docs', "agenda"]))
    }
})

export default Documents

Documents.auth = true;

Documents.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
