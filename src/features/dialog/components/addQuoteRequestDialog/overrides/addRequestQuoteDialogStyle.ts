import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
const AddQuoteRequesDialogStyled = styled(Stack)(({ theme }) => ({
    //maxWidth: 1025,
    //width: "100%",
    margin: 'auto',
    '.MuiButton-root': {
        svg: {
            width: 28,
            height: 28,
        }
    },
}));
export default AddQuoteRequesDialogStyled;