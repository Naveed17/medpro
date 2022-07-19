import { styled } from "@mui/material/styles";
import { Card } from "@mui/material";
const RootStyled = styled(Card)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  position: "relative",
  borderRadius: 6,
  "&:before": {
    content: '""',
    width: 4,
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
  },
  "& .card-main": {
    width: "100%",
    "& .title": {
      display: "flex",
      alignItems: "center",

      svg: {
        width: 10,
        height: 10,
        marginRight: 8,
        path: {
          fill: theme.palette.error.main,
        },
      },
    },
    "& .time-badge-main": {
      display: "flex",
      marginTop: theme.spacing(1),
      alignItems: "center",
      "& .MuiTypography-body2": {
        display: "flex",
        alignItems: "center",
        svg: {
          marginRight: 5,
        },
        "&.time-main": {
          svg: {
            width: 11,
            height: 14,
            path: {
              fill: theme.palette.text.secondary,
            },
          },
        },
      },
      "& .Lable": {
        marginLeft: 10,
        padding: theme.spacing(0, 1.5),
      },
    },
  },
  "& .action": {
    width: 31,
    display: "flex",
    alignItems: "center",
  },
}));
export default RootStyled;
