import { styled } from "@mui/material/styles";
import { Paper } from "@mui/material";
const CollapseCardStyled = styled(Paper)(({ theme }) => ({
    transition: "all 1s ease-in-out",
    minWidth: "42px",
    marginLeft: 0,
    overflowY: "auto",
    overflowX: "hidden",
    boxShadow: "none",
}));
export default CollapseCardStyled;