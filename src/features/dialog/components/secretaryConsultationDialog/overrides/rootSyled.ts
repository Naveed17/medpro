import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
const RootStyled = styled(Stack)(({ theme }) => ({
    overflow: 'hidden',
    width: "100%",
    minWidth: 1028,
    paddingBottom: theme.spacing(2),
    '.MuiInputAdornment-root': {
        alignSelf: 'flex-end'
    },
    "@media (max-width: 1024px)": {
        minWidth: 0,
    },
}));
export default RootStyled;