import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
const AddDocumentDialogStyled = styled(Stack)(({ theme }) => ({
    //maxWidth: 1025,
    //width: "100%",
    margin: 'auto',
    '.MuiButton-root': {
        svg: {
            width: 28,
            height: 28,
        }
    },
    "& .micro":{
        border: "2px solid",
        borderRadius: 40,
        padding:10
    }
}));
export default AddDocumentDialogStyled;
