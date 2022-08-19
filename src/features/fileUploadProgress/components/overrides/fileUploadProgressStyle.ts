import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
const FileuploadProgressStyled = styled(Box)(({ theme }) => ({
    '& .btn-close': {
        alignSelf: 'flex-end',
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
    }

}));
export default FileuploadProgressStyled