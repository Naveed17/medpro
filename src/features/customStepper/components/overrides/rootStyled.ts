import { styled } from "@mui/material/styles";

const RootStyled = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  minWidth: 648,
  "& .MuiTabs-root": {
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(0, 0.5),
    "& .MuiTabs-flexContainer": {
      justifyContent: "space-around",
    },
    button: {
      borderBottom: "2px solid #7C878E",
      borderRadius: 0,
      transition: "all 0.3s ease-in-out",
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(0.5, 1),
        minWidth: "auto",
        fontSize: theme.typography.body2.fontSize,
      },
      "&.Mui-disabled": {
        opacity: 0.3,
        borderBottomWidth: 1,
      },
      "&.Mui-selected": {
        borderBottom: "2px solid transparent",
      },
    },
  },
  '& div[role="tabpanel"]': {
    // height: `calc(100vh - 55px)`,
    overflow: "auto",
  },
}));
export default RootStyled;
