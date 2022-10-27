import { styled } from "@mui/material/styles";
//Component
import { Box } from "@mui/material";
const RootStyled = styled(Box)(({ theme }) => ({
  "& .form-label-main": {
    [theme.breakpoints.down("md")]: {
      display: "block",
      "& .MuiTypography-root": {
        minWidth: "auto",
        width: "auto",
        textAlign: "left",
      },
      fieldset: {
        display: "block",
      },
      "& .name": {
        display: "block",
      },
    },
  },
}));
export default RootStyled