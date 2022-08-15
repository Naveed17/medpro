
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import React from 'react'
// material
import DropZoneStyle from './overrides/uploadFileStyle'
import {
    Box,
    Typography,
    Stack,
} from '@mui/material';
import Icon from '@themes/urlIcon';


// ----------------------------------------------------------------------



// ----------------------------------------------------------------------


export default function UploadMultiFile({ ...props }) {
    const { styleprops, onDrop, accept, multiple, singleFile, error, sx, ...other } = props;
    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        ...other
    });

    return (
        <Box sx={{ width: '100%', ...sx }}>
            <DropZoneStyle
                {...getRootProps()}
                styleprops={singleFile?.toString()}
                sx={{
                    ...(isDragActive && { opacity: 0.72 }),
                    ...((isDragReject || error) && {
                        color: 'error.main',
                        borderColor: 'error.light',
                        bgcolor: 'error.lighter'
                    })
                }}
            >
                <input {...getInputProps()} />
                {!singleFile ? (
                    <Box sx={{ p: 1, }}>
                        <Typography sx={{ color: 'text.secondary' }}>
                            Click Or Drop Files Upload
                        </Typography>
                    </Box>
                ) : (
                    <Stack alignItems='center'>
                        <Icon path="ic_upload3" />
                        <Typography sx={{ color: 'text.secondary' }}>
                            Drag and drop file here or click
                        </Typography>
                    </Stack>
                )}
            </DropZoneStyle>
        </Box>
    );
}
