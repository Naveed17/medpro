import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
const AddQuoteRequesDialogStyled = styled(Stack)(({ theme }) => ({
    margin: 'auto',
    '.MuiButton-root': {
        svg: {
            width: 28,
            height: 28,
        }
    },
}));
export default AddQuoteRequesDialogStyled;