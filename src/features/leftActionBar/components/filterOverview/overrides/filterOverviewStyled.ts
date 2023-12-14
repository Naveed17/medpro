import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";

const FilterOverviewStyled = styled(Box)(({theme}) => ({
    "& .MuiTypography-root": {
        color: theme.palette.text.primary,
        fontWeight: 600,
        fontSize: 14,
    },
    "& .filtered-label": {
        margin: 8
    },
    "& .MuiChip-label": {
        fontSize: 12,
        fontWeight: 600
    },
    "& .MuiChip-root": {
        filter: "drop-shadow(10px 10px 10px rgba(0, 0, 0, 0))",
        marginBottom: 6,
        cursor: "pointer",
        "&:active": {
            boxShadow: "none",
            outline: "none",
        }
    },

}))

export default FilterOverviewStyled;
