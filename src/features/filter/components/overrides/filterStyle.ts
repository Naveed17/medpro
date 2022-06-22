import Dialog from "@mui/material/Dialog";
import { styled, Theme } from "@mui/material/styles";
const FilterStyled = styled(Dialog)(({ theme }: Theme) => ({
    top: 64,
    height: "calc(100% - 65px)",
    "& .MuiDialog-paper": {
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        "& .MuiPaper-root": {
            boxShadow: "none",
            borderRadius: 0,
        },
        "& header": {
            position: "relative",
            boxShadow: "none !important",
            backgroundColor: theme.palette.common.white,
            border: "none",
            borderBottom: `1px solid ${theme.palette.divider}`,
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
export default FilterStyled;