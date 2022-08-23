import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
const AddDocumentDialogStyled = styled(Stack)(({ theme }) => ({
    minWidth: 1025,
    width: "100%",
    "@media (max-width: 1024px)": {
        minWidth: 0,
    },
}));
export default AddDocumentDialogStyled;