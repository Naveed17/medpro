import React from 'react'
import { Box, Typography, LinearProgress, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import FileuploadProgressStyled from './overrides/fileUploadProgressStyle';
import Icon from '@themes/urlIcon'
import { useTheme, Theme } from '@mui/material/styles';
export default function FileuploadProgress({ ...props }) {
    const { file, progress, handleRemove, ...rest } = props
    const theme = useTheme() as Theme;
    return (
        <FileuploadProgressStyled
            {...rest}
            sx={{
                width: "100%",
                display: "flex",
                mx: "auto",
                mt: 2,
            }}
        >
            <Icon path="pdf-preview" />
            <Box sx={{ width: "100%", ml: 1 }}>
                <Typography
                    variant="body2"
                    color="text.primary"
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                        textTransform: "uppercase",
                    }}
                >
                    {file.name}
                    <Typography component='span' variant="body2" color="text.secondary">
                        {file && parseInt(file.size) / 1000} KB
                    </Typography>
                </Typography>
                <LinearProgress
                    value={progress}
                    variant="determinate"
                    color="success"
                    sx={{ bgcolor: theme.palette.divider, borderRadius: "4px" }}
                />
            </Box>
            <IconButton className='btn-close' size="small"
                onClick={() => handleRemove(file)}
            >
                <CloseIcon />
            </IconButton>
        </FileuploadProgressStyled >

    )
}
