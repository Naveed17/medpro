import { styled, List } from "@mui/material";
const StyledList = styled(List)(({ theme }) => ({
  padding: 0,
  ".MuiListItem-root": {
    flexDirection: "column",
    alignItems: "flex-start",
    //border: `1px solid ${theme.palette.divider}`,
    borderRadius: "5px",
    "&:not(:last-child)": {
      marginBottom: "10px",
    },
    "&.collapse-row": {
      "&::before": {
        top: "-17px",
        width: "18px",
        left: "-18px",
      },
    },
  },
}));
export default StyledList;
