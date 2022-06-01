import React from 'react'
import { Box, Typography, LinearProgress, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles'
import IconUrl from "../urlIcon";
const RootStyle = styled(Box)(({ theme }) => ({
    '& .btn-close': {
        alignSelf: 'flex-end',
        marginLeft: theme.spacing(1),
        backgroundColor: '#7E7E7E',
        opacity: 0.25,
        color: theme.palette.common.white,
        width: 20,
        height: 20,
        borderRadius: 6,
        '& .MuiSvgIcon-root': {
            fontSize: theme.typography.pxToRem(14),
        },
        '&:hover': {
            backgroundColor: '#7E7E7E',
        }
    }

}))
function FileuploadProgress({ ...props }) {
    const {file, progress, handleRemove, ...rest} = props
    return (
        <RootStyle
            {...rest}
            sx={{
                width: "100%",
                display: "flex",
                mx: "auto",
                mt: 2,
            }}
        >
            <IconUrl path="pdf-preview"/>
            <Box sx={{width: "100%", ml: 1}}>
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                    textTransform: "uppercase",
                }}>
                    <Typography
                        variant="body2"
                        color="text.primary">
                        {file.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {file && parseInt(file.size / 1000)} KB
                    </Typography>
                </Box>

                <LinearProgress
                    value={progress}
                    variant="determinate"
                    color="success"
                    sx={{bgcolor: "#DDDDDD", borderRadius: "4px"}}
                />
            </Box>
            <IconButton className='btn-close' size="small"
                        onClick={() => handleRemove(file)}
            >
                <CloseIcon/>
            </IconButton>
        </RootStyle>

    )
}
export default FileuploadProgress;
