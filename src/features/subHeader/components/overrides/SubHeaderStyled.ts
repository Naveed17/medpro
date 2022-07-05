//component styles
import { styled } from "@mui/system";
import { AppBar } from "@mui/material";

const SubHeaderStyled = styled(AppBar)(({ theme }) => ({
  border: "none",
  borderTop: "1px solid #e0e0e0",

  "& .breadcrumbs": {
    textTransform: "capitalize",
    "& p": {
      fontSize: 15,
    },
  },
  "& .settings-action": {
    marginLeft: "auto",
    "& button": {
      marginLeft: 14,
    },
  },
}));

export default SubHeaderStyled;
