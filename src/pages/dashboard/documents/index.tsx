import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useState} from "react";
import {configSelector, DashLayout} from "@features/base";
import {SubHeader} from "@features/subHeader";
import {DocsToolbar} from "@features/toolbar";
import {Box, Button, DialogActions, Stack} from "@mui/material";
import {useTranslation} from "next-i18next";
import dynamic from "next/dynamic";
import {NoDataCard} from "@features/card";
import Icon from "@themes/urlIcon";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import IconUrl from "@themes/urlIcon";
import {useAppSelector} from "@lib/redux/hooks";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function Documents() {
    const {t, ready} = useTranslation(["docs", "common"]);
    const {direction} = useAppSelector(configSelector);

    const [openAddOCRDocDialog, setOpenAddOCRDocDialog] = useState<boolean>(false);

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
            <Box className="container">
                <NoDataCard
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
                />
            </Box>

            <Dialog
                action={"ocr_docs"}
                {...{
                    direction,
                    sx: {
                        minHeight: 500
                    }
                }}
                open={openAddOCRDocDialog}
                size={"md"}
                title={t("dialogs.add-dialog.title")}
                dialogClose={() => setOpenAddOCRDocDialog(false)}
                actionDialog={
                    <DialogActions sx={{width: "100%"}}>
                        <Stack direction={"row"} justifyContent={"space-between"} sx={{width: "100%"}}>
                            <Button onClick={() => setOpenAddOCRDocDialog(false)} startIcon={<CloseIcon/>}>
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
