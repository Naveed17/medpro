import {Box} from '@mui/material'
import {styled} from '@mui/material/styles'

const FileUploadProgressStyled = styled(Box)(({theme}) => ({
    "#waveform": {
        cursor: "pointer",
        position: "relative"
    },
    " #hover": {
        position: "absolute",
        left: 0,
        top: 0,
        zIndex: 10,
        pointerEvents: "none",
        height: "100%",
        width: 0,
        mixBlendMode: "overlay",
        background: "rgba(255, 255, 255, 0.5)",
        opacity: 0,
        transition: "opacity 0.2s ease"
    },
    "#waveform:hover #hover": {
        opacity: 1
    },
    '& .btn-close': {
        alignSelf: 'center',
        marginLeft: theme.spacing(1),
        backgroundColor: theme.palette.grey['A60'],
        opacity: 0.25,
        color: theme.palette.common.white,
        width: 20,
        height: 20,
        borderRadius: 6,
        '& .MuiSvgIcon-root': {
            fontSize: theme.typography.pxToRem(14),
        },
        '&:hover': {
            backgroundColor: theme.palette.grey['A60'],
        }
    },
    "& .player": {
        border: "1px solid",
        borderRadius: 40,
        padding: 6
    }
}));
export default FileUploadProgressStyled
