import {Stack, styled} from "@mui/material";

const DialogStyled = styled(Stack)(({theme}) => ({
    ".dialog-action": {
        justifyContent: "space-between",
        borderTop: `1px solid ${theme.palette.primary.main}`
    },
    ".role-label": {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 6,
        padding: theme.spacing(1, 2),
        margin: 0,
        ".MuiTypography-root": {
            fontSize: 15,
            fontWeight: 700,
        },
        ".MuiButtonBase-root": {
            padding: 0,
            width: 0,
            height: 0,
            marginRight: theme.spacing(2)
        },
    },
    
    ".role-input-group": {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: theme.spacing(2),
    },
    "& .role-input-container": {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: theme.spacing(1.2),
    },
    "& .role-input-group": {
        width: "100%"
    }
}));
export default DialogStyled;
