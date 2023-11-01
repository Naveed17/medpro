import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
import {configSelector, DashLayout} from "@features/base";
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
    IconButton,
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
import {useAppSelector} from "@lib/redux/hooks";
import {InputStyled} from "@features/tabPanel";
import BorderLinearProgress from "@features/dialog/components/ocrDocsDialog/overrides/BorderLinearProgress";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function Documents() {
    const theme = useTheme();

    const {t, ready} = useTranslation(["docs", "common"]);
    const {direction} = useAppSelector(configSelector);

    const [filesInProgress, setFilesInProgress] = useState<File[]>([]);
    const [openAddOCRDocDialog, setOpenAddOCRDocDialog] = useState<boolean>(false);

    const handleDeleteDoc = (index: number) => {
        setFilesInProgress([...filesInProgress.slice(0, index), ...filesInProgress.slice(index + 1)]);
    }

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);
    console.log("filesInProgress", filesInProgress);
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
            <Box className="container">
                {filesInProgress.length > 0 ?
                    <Stack spacing={2}>
                        <CardStyled>
                            <CardContent sx={{pb: 0}}>
                                <Typography fontSize={14} fontWeight={600} mb={1}>Documents en cours de
                                    traitement</Typography>
                                <Divider/>
                                <Grid sx={{mt: 0}} container spacing={2}>
                                    {filesInProgress.map((file: File, index: number) =>
                                        <Grid key={index} item xs={12} md={4}>
                                            <Card>
                                                <CardContent>
                                                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                                                        <IconUrl path={'ic-doc-upload'}/>
                                                        <Stack alignItems={"start"} spacing={.5} sx={{width: '75%'}}>
                                                            <Typography fontSize={12}
                                                                        fontWeight={400}>{file.name}</Typography>
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
                                                        onChange={(e) => setFilesInProgress([...filesInProgress, (e.target.files as FileList)[0]])}
                                                        type="file"
                                                    />
                                                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
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
                        <CardStyled sx={{minHeight: '400px'}}>
                            <CardContent sx={{pb: 0}}>
                                <Typography fontSize={14} fontWeight={600} mb={1}>Documents Traiter</Typography>
                                <Divider/>
                            </CardContent>
                        </CardStyled>
                    </Stack>
                    : <NoDataCard
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
                    handleDeleteDoc,
                    files: filesInProgress,
                    setFiles: setFilesInProgress
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
        ...(await serverSideTranslations(locale as string, ['common', 'menu', 'docs']))
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
