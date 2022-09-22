import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
const RootStyled = styled(Paper)(({ theme }) => ({
    border: 'none',
    padding: theme.spacing(3, 5),
    '.line': {
        borderBottom: `1px dashed ${theme.palette.divider}`
    },
    p: {
        lineHeight: 1,
    }

}));
export default RootStyled