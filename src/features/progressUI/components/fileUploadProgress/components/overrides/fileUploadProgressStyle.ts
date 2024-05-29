import {Box} from '@mui/material'
import {styled} from '@mui/material/styles'

const FileUploadProgressStyled = styled(Box)(({theme}) => ({
    "& #waveform": {
        cursor: "pointer",
        position: "relative"
    },
    "& .audio-title": {
        position: "absolute",
        zIndex: 11,
        marginLeft: 4,
        marginTop: -4
    },
    "& #time,#duration": {
        position: "absolute",
        zIndex: 11,
        top: "50%",
        marginTop: "-1px",
        transform: "translateY(-50%)",
        fontSize: 11,
        background: " rgba(0, 0, 0, 0.75)",
        padding: 2,
        color: "#ddd"
    },
    "& #time": {
        left: 0
    },
    "& #duration": {
        right: 0
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
