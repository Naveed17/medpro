import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
// styled
const FilterRootStyled = styled(Box)(({ theme }) => ({
  "& .appo-type": {
    display: "flex",
    fontSize: theme.typography.body2,
    alignItems: "center",
    cusror: "pointer",
    "& .video-icon-0": {
      marginRight: "5px",
      "& svg": {
        width: "0.8rem",
        height: "0.8rem",
        "& path": {
          fill: theme.palette.error.main,
        },
      },
    },
    "& .appointment-icon-1": {
      marginRight: "5px",
      "& svg": {
        width: "0.8rem",
        height: "0.8rem",
        "& path": {
          fill: theme.palette.primary.main,
        },
      },
    },
  },
}));
export default FilterRootStyled;
