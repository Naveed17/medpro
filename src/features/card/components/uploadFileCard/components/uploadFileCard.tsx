import {useDropzone} from 'react-dropzone';
import React from 'react'
// material
import UploadFileStyled from './overrides/uploadFileStyled'
import {
    Box,
    Typography,
    Stack,
} from '@mui/material';
import Icon from '@themes/urlIcon';
import {useTranslation} from "next-i18next";
import {LoadingScreen} from "@features/loadingScreen";

// ----------------------------------------------------------------------


// ----------------------------------------------------------------------


export default function UploadFileCard({...props}) {
    const {t, ready} = useTranslation("common");
    const {error, sx, fontSize, ...other} = props;
    const {getRootProps, getInputProps, isDragActive, isDragReject} = useDropzone({
        ...other
    });
    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <Box sx={{width: '100%', ...sx}}>
            <UploadFileStyled
                {...getRootProps()}
                sx={{
                    ...(isDragActive && {opacity: 0.72}),
                    ...((isDragReject || error) && {
                        color: 'error.main',
                        borderColor: 'error.light',
                        bgcolor: 'error.lighter'
                    })
                }}
            >
                <input {...getInputProps()} />
                <Stack spacing={2} direction='row' alignItems='center' sx={{p: 1,}}>
                    <Icon path="ic-upload-3"/>
                    <Box>
                        <Typography variant='subtitle1' fontSize={fontSize} fontWeight={600}>
                            {t('drag_3')}
                        </Typography>
                    </Box>
                </Stack>
            </UploadFileStyled>
        </Box>
    );
}
