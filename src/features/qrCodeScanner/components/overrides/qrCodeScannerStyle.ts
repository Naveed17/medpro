import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
const QrCodeDialogStyled = styled(Box)(({ theme }) => ({
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.spacing(1.5),
    border: `3px solid ${theme.palette.warning.main}`,
    zIndex: 1,

    '& .code-wrapper': {
        "&::before": {
            content: "''",
            position: "absolute",
            height: "calc(100% + 10px)",
            width: "50%",
            backgroundColor: theme.palette.background.paper,
            top: -5,
            left: "25%",
            zIndex: -1,
        },
        "&::after": {
            content: "''",
            position: "absolute",
            height: "50%",
            width: "calc(100% + 10px)",
            backgroundColor: theme.palette.background.paper,
            top: "25%",
            left: -5,
            zIndex: -1,
        }
    }

}));
export default QrCodeDialogStyled;
