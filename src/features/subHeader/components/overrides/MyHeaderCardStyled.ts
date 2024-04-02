
import {styled} from "@mui/system";
import {Stack} from "@mui/material";

const MyHeaderCardStyled = styled(Stack)(() => ({
    display: "flex",
    height: "3.125rem",
    padding: "0.375rem 1rem",
    alignItems: "center",
    gap: "0.125rem",
    alignSelf: "stretch",
}));

export default MyHeaderCardStyled;
