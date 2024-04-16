import {styled} from "@mui/material/styles";

const CertifDialogStyled = styled("div")(({theme}) => ({
    '.suggestion': {
        backgroundColor: theme.palette.primary.lighter,
        border: `1px dashed ${theme.palette.divider}`,
        padding: 10,
        borderRadius: 5,
        flexWrap: "wrap"
    },
    '.empty': {
        fontSize: 11,
        textAlign: 'center',
        color: 'grey'
    },
    ".tox .tox-edit-area::before": {
        border: "none"
    }
}));
export default CertifDialogStyled;
