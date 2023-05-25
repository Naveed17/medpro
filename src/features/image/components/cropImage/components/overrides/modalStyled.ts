import {styled} from "@mui/material/styles";
import {Dialog} from "@mui/material";
import {pxToRem} from "@themes/formatFontSize";

const ModalStyled = styled(Dialog)(({ theme }) => ({
    zIndex: 1200,
    '& .MuiPaper-root': {
        maxWidth: "842px",
        width: '100%',
    },
    "& .modal-header": {
        backgroundColor: theme.palette.primary.main,
        padding: pxToRem(16) + " " + pxToRem(36),
        "& h6": {
            fontWeight: theme.typography.fontWeightMedium,
            color: theme.palette.common.white,
        },
    },
    '& .modal-body': {
        height: '100%',
        maxWidth: "75%",
        width: '100%',
        margin: "auto",
        padding: pxToRem(16) + " " + pxToRem(24),
        minHeight: pxToRem(415),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        position: 'relative',
    },
    '& .modal-actions': {
        padding: pxToRem(10) + " " + pxToRem(33),
        borderTop: `1px solid ${theme.palette.primary.main}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
    }
}));

export default ModalStyled;
