import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
const RootStyled = styled(Dialog)(({ theme }) => ({
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
      // border: "none",

      "& .MuiButtonBase-root": {
        position: "absolute",
        right: 0,
      },

      "& .MuiToolbar-root": {
        width: "100%",
        justifyContent: "center",
        borderBottom: `1px solid ${theme.palette.warning.main}`,
      },
    },
  },
}));
export default RootStyled;
