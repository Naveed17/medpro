import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect, useState} from "react";
import {configSelector, DashLayout, dashLayoutSelector} from "@features/base";
import CircularProgress, {circularProgressClasses} from '@mui/material/CircularProgress';
import {SubHeader} from "@features/subHeader";
import {DocsToolbar} from "@features/toolbar";
import {
    Backdrop,
    Box,
    Button,
    Card,
    CardContent,
    DialogActions,
    Divider,
    Grid,
    LinearProgress,
    MenuItem,
    IconButton,
    SpeedDial,
    SpeedDialAction,
    Stack,
    Typography,
    Zoom,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {alpha} from "@mui/material/styles";
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
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {prepareSearchKeys, useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import {Label} from "@features/label";
import {docTypes, leftActionBarSelector} from "@features/leftActionBar";
import {Pagination} from "@features/pagination";
import {ActionMenu, toggleSideBar} from "@features/menu";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import {Theme} from "@mui/material/styles";
import {MobileContainer as smallScreen} from "@lib/constants";
import SpeedDialIcon from '@mui/material/SpeedDialIcon';

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));
const actions = [
    {
        icon: <IconUrl color={"gray"}
                       path={"add-doc"}/>, name: 'Ajouter un document', label: 'sub-header.add-doc', key: 'add-doc'
    },
];
const DialogAction = ({...props}) => {
    const {isMobile, t, setOpenAddOCRDocDialog, loading} = props;

    return (
        <DialogActions sx={{width: "100%"}}>
            <Stack direction={"row"} justifyContent={"space-between"} sx={{width: "100%"}}>
                <Button variant="text-primary" onClick={() => setOpenAddOCRDocDialog(false)}
                        startIcon={<CloseIcon/>}>
                    {t("cancel", {ns: "common"})}
                </Button>
                <Stack direction={"row"} spacing={1.2}>
                    <LoadingButton
                        onClick={() => setOpenAddOCRDocDialog(false)}
                        sx={{ml: "auto"}}
                        loadingPosition="start"
                        variant="contained"
                        color={"info"}
                        startIcon={<IconUrl path="ic-temps"/>}>
                        {t("dialogs.add-dialog.later")}
                    </LoadingButton>
                    {
                        !isMobile && (
                            <LoadingButton
                                {...{loading}}
                                onClick={() => setOpenAddOCRDocDialog(false)}
                                loadingPosition="start"
                                variant="contained"
                                startIcon={<IconUrl path="add-doc"/>}>
                                {t("dialogs.add-dialog.confirm")}
                            </LoadingButton>
                        )
                    }

                </Stack>
            </Stack>
        </DialogActions>
    )
}

function Documents() {
    const router = useRouter();
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const isMobile = useMediaQuery(`(max-width:${smallScreen}px)`);

    const {t, ready} = useTranslation(["docs", "common"]);
    const {direction} = useAppSelector(configSelector);
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {query: filter} = useAppSelector(leftActionBarSelector);

    const [openAddOCRDocDialog, setOpenAddOCRDocDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [localFilter, setLocalFilter] = useState("");
    const [selectedDoc, setSelectedDoc] = useState<OcrDocument | null>(null);
    const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const [openFabAdd, setOpenFabAdd] = useState(false);

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
    const {trigger: triggerRetryDocUpload} = useRequestQueryMutation("/ocr/document/retry");
    const {trigger: triggerDocumentDelete} = useRequestQueryMutation("/documents/delete");

    const handleUploadDoc = (fileList: FileList) => {
        setLoading(true);
        const files: File[] = Array.from(fileList);
        const form = new FormData();
        files.forEach((file: any) => {
            form.append(`files[]`, file, file.name);
        });
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

    const handleRetryUpload = (uuid: string) => {
        setLoading(true);
        const form = new FormData();
        form.append("attribute", "resend");
        form.append("value", "true");
        triggerRetryDocUpload({
            method: "PATCH",
            url: `${urlMedicalEntitySuffix}/ocr/documents/${uuid}/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                mutateOcrDocuments();
            },
            onSettled: () => setLoading(false)
        });
    }

    const handleDeleteDocument = (uuid: string) => {
        setLoading(true);
        medicalEntityHasUser && triggerDocumentDelete({
            method: "DELETE",
            url: `${urlMedicalEntitySuffix}/ocr/documents/${uuid}/${router.locale}`,
        }, {
            onSuccess: () => {
                mutateOcrDocuments();
            },
            onSettled: () => setLoading(false)
        });
    }

    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    const handleOpenFab = () => setOpenFabAdd(true);

    const handleCloseFab = () => setOpenFabAdd(false);

    const handleActionFab = (action: any) => {
        setOpenFabAdd(false);
        switch (action.key) {
            case "add-doc" :
                setOpenAddOCRDocDialog(true);
                setTimeout(() => handleCloseFab());
        }
    }

    const handleCloseMenu = () => {
        setContextMenu(null);
    }

    const OnMenuActions = (action: string) => {
        handleCloseMenu();
        switch (action) {
            case "onDelete":
                handleDeleteDocument(selectedDoc?.uuid as string);
                break;
            case "onRetry":
                handleRetryUpload(selectedDoc?.uuid as string);
                break;
        }
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
                <DocsToolbar {...{isMobile}} onUploadOcrDoc={() => setOpenAddOCRDocDialog(true)}/>
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
                                                        <Box sx={{position: 'relative'}}>
                                                            <CircularProgress
                                                                variant="determinate"
                                                                sx={{
                                                                    color: (theme) =>
                                                                        theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
                                                                }}
                                                                size={40}
                                                                thickness={4}
                                                                value={100}
                                                            />
                                                            <CircularProgress
                                                                variant="indeterminate"
                                                                disableShrink
                                                                sx={{
                                                                    color: (theme) => (theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'),
                                                                    animationDuration: '550ms',
                                                                    position: 'absolute',
                                                                    left: 0,
                                                                    [`& .${circularProgressClasses.circle}`]: {
                                                                        strokeLinecap: 'round',
                                                                    },
                                                                }}
                                                                size={40}
                                                                thickness={4}
                                                            />
                                                        </Box>
                                                        <Stack alignItems={"start"} spacing={.5} sx={{width: '75%'}}>
                                                            <Typography fontSize={12}
                                                                        fontWeight={400}>{file.title}</Typography>
                                                            <Typography
                                                                color={"gray"}
                                                                fontSize={10}
                                                                fontWeight={400}>{t('doc-status.pending')}</Typography>

                                                        </Stack>
                                                        <IconButton
                                                            onClick={() => handleDeleteDocument(file.uuid)}
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
                                                        onChange={(e) => handleUploadDoc(e.target.files as FileList)}
                                                        type="file"
                                                        multiple
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
                                            {...(![3, 2].includes(file.status) && {
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
                                                            <Typography
                                                                className={'ellipsis'}
                                                                width={220}
                                                                fontSize={12}
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
                                                        <IconButton
                                                            onClick={event => {
                                                                event.stopPropagation();
                                                                setSelectedDoc(file);
                                                                setContextMenu(
                                                                    contextMenu === null
                                                                        ? {
                                                                            mouseX: event.clientX + 2,
                                                                            mouseY: event.clientY - 6,
                                                                        } : null,
                                                                );
                                                            }}
                                                            disableRipple sx={{p: 0}}>
                                                            <IconUrl path="ic-more" width={30} height={30}/>
                                                        </IconButton>
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

                {isMobile &&
                    <Zoom
                        in={!loading}
                        timeout={transitionDuration}
                        style={{
                            transitionDelay: `${!loading ? transitionDuration.exit : 0}ms`,
                        }}
                        unmountOnExit>
                        <SpeedDial
                            ariaLabel="SpeedDial tooltip Add"
                            sx={{
                                position: 'fixed',
                                bottom: 20,
                                right: 16
                            }}
                            icon={<SpeedDialIcon/>}
                            onClose={handleCloseFab}
                            onOpen={handleOpenFab}
                            open={openFabAdd}>
                            {actions.map((action) => (
                                <SpeedDialAction
                                    key={action.name}
                                    icon={action.icon}
                                    tooltipTitle={t(`${action.label}`)}
                                    tooltipOpen
                                    onClick={() => handleActionFab(action)}
                                />
                            ))}
                        </SpeedDial>
                    </Zoom>}
                <Backdrop sx={{zIndex: 100, backgroundColor: alpha(theme.palette.common.white, 0.9)}}
                          open={openFabAdd}/>
            </Box>

            <ActionMenu {...{contextMenu, handleClose: handleCloseMenu}}>
                {[
                    {
                        title: "delete-document",
                        icon: <DeleteOutlineRoundedIcon/>,
                        action: "onDelete",
                    },
                    ...(selectedDoc?.status === 3 ? [{
                        title: "retry-ocr",
                        icon: <ReplayRoundedIcon/>,
                        action: "onRetry",
                    }] : [])].map(
                    (v: any, index) => (
                        <MenuItem
                            key={index}
                            className="popover-item"
                            onClick={() => {
                                OnMenuActions(v.action);
                            }}>
                            {v.icon}
                            <Typography fontSize={15} sx={{color: "#fff"}}>
                                {t(`${v.title}`)}
                            </Typography>
                        </MenuItem>
                    )
                )}
            </ActionMenu>

            <Dialog
                action={"remove"}
                direction={direction}
                open={openRemoveDialog}
                data={{
                    title: t('askRemovedoc'),
                    subtitle: t('subtitleRemovedoc'),
                    icon: "/static/icons/ic-text.svg",
                    name1: selectedDoc?.title,
                    name2: selectedDoc?.documentType,
                }}
                color={(theme: Theme) => theme.palette.error.main}
                title={t('removedoc')}
                t={t}
                actionDialog={
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenRemoveDialog(false);
                        }}
                                startIcon={<CloseIcon/>}>{t('cancel')}</Button>
                        <LoadingButton variant="contained"
                                       sx={{backgroundColor: (theme: Theme) => theme.palette.error.main}}
                                       onClick={() => handleDeleteDocument(selectedDoc?.uuid as string)}>{t('remove')}</LoadingButton>
                    </DialogActions>
                }
            />

            <Dialog
                action={"ocr_docs"}
                margin={0}
                {...{
                    direction,
                    sx: {
                        minHeight: 500
                    }
                }}
                data={{
                    t,
                    onDeleteDoc: handleDeleteDocument,
                    onUploadDoc: handleUploadDoc,
                    onRetryDoc: handleRetryUpload,
                    onClose: () => {
                        handleCloseFab();
                        setTimeout(() => setOpenAddOCRDocDialog(false));
                    },
                    data: filesInProgress,
                    isMobile
                }}
                open={openAddOCRDocDialog}
                size={"md"}
                dialogClose={() => setOpenAddOCRDocDialog(false)}
                {...(isMobile ? {
                        fullScreenDialog: true,
                        headerDialog: true,
                        actionDialog: filesInProgress.length > 0 &&
                            <DialogAction {...{t, isMobile, setOpenAddOCRDocDialog, loading}}/>
                    } : {
                        fullScreenDialog: false,
                        headerDialog: null,
                        title: t("dialogs.add-dialog.title"),
                        actionDialog: <DialogAction {...{t, isMobile, setOpenAddOCRDocDialog, loading}}/>
                    }
                )}
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
