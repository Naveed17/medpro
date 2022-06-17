import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
// styled
export const FilterContainer = styled(Box)(({ theme }) => ({
  "& .Video-icon-0": {
    marginRight: "5px",
    "& svg": {
      width: "0.8rem",
      height: "0.8rem",
      "& path": {
        fill: theme.palette.error.main,
      },
    },
  },
  "& .Video-icon-1": {
    marginRight: "5px",
    "& svg": {
      width: "0.8rem",
      height: "0.8rem",
      "& path": {
        fill: theme.palette.primary.main,
      },
    },
  },
}));
