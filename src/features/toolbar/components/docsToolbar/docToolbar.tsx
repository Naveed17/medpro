import {Button, IconButton, Stack, Typography, useMediaQuery} from "@mui/material";
import {useTranslation} from "next-i18next";
import IconUrl from "@themes/urlIcon";
import React, {useCallback} from "react";
import {MobileContainer} from "@lib/constants";

function DocToolbar({...props}) {
    const {showPreview} = props;
    const isMobile = useMediaQuery(`(max-width:${MobileContainer}px)`);

    const {t} = useTranslation("docs");

    const handleShowPreview = useCallback(() => {
        showPreview();
    }, [showPreview]);

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            width={1}
            alignItems="center">
            <Typography variant="subtitle2" color="text.primary">
                {t("sub-header.sub-title")}
            </Typography>
            {!isMobile ? <Button
                variant={'text-black'}
                onClick={handleShowPreview}
                sx={{
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: '8px',
                    padding: '5px'
                }}>
                <IconUrl path="ic-eye-scan" width={16} height={16}/>
                <Typography ml={1} variant="body2" color="text.primary">
                    {t("preview-document")}
                </Typography>
            </Button> : <IconButton
                onClick={handleShowPreview}
                sx={{
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: "8px",
                    padding: "5px"
                }}>
                < IconUrl path="ic-eye-scan" width={16} height={16}/>
            </IconButton>}

        </Stack>
    )
}

export default DocToolbar
