import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
const DrawerBottomStyled = styled(Dialog)(({ theme }) => ({
    top: 64,
    height: "calc(100% - 65px)",
    "& .MuiDialog-paper": {
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        margin: 0,
        "& .MuiPaper-root": {
            boxShadow: "none",
            borderRadius: 0,
        },
        "& header": {
            position: "relative",
            boxShadow: "none",
            backgroundColor: theme.palette.common.white,
            border: "none",
            borderBottom: `1px solid ${theme.palette.divider}`,
            width: 'auto',
            "& .MuiButtonBase-root": {
                position: "absolute",
                right: 0,
            },

            "& .MuiToolbar-root": {
                width: "100%",
                justifyContent: "center",
            },
        },
    },
}));
export default DrawerBottomStyled;