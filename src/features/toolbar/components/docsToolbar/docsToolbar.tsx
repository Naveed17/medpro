import {Button, Stack, Typography} from "@mui/material";
import {useTranslation} from "next-i18next";
import IconUrl from "@themes/urlIcon";
import {useCallback} from "react";

function DocsToolbar({...props}) {
    const {onUploadOcrDoc,isMobile} = props;
    const {t} = useTranslation("docs");

    const handleUploadOcrDoc = useCallback(() => {
        onUploadOcrDoc();
    }, [onUploadOcrDoc]);

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            width={1}
            alignItems="center">
            <Typography variant="subtitle2" color="text.primary">
                {t("sub-header.title")}
            </Typography>
            {
                !isMobile &&(
                <Button
                variant="contained"
                onClick={() => handleUploadOcrDoc()}
                color="success"
                sx={{ml: "auto"}}
                startIcon={<IconUrl path={"add-doc"}/>}>
                {t("sub-header.add-doc")}
            </Button>
                )
            }
            
        </Stack>
    )
}

export default DocsToolbar
