import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
const RootStyled = styled(Paper)(({ theme }) => ({
    border: 'none',
    padding: theme.spacing(3, 5),
    '.line': {
        borderBottom: `1.5px dashed ${theme.palette.divider}`
    },
    '.multi-line': {
        display: "grid",
        gridTemplateColumns: "repeat(2,minmax(0,1fr))",
        gridGap: 8,
        gridRowGap: theme.spacing(3.5),
    }

}));
export default RootStyled