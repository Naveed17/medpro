import { styled } from "@mui/material/styles";
import { Paper } from "@mui/material";
const CollapseCardStyled = styled(Paper)(({ theme }) => ({
    transition: "all 1s ease-in-out",
    minWidth: "42px",
    marginLeft: 0,
    overflowY: "auto",
    overflowX: "hidden",
    boxShadow: "none",
    '& .label': {
        color: theme.palette.text.primary,
        svg: {
            marginRight: 1,
            width: 14,
            height: 14,
            path: {
                fill: theme.palette.text.primary,
            },
        },
    }
}));
export default CollapseCardStyled;