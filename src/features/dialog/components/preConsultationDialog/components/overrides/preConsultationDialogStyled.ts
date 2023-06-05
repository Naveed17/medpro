import {styled} from "@mui/material/styles";
import {Stack} from "@mui/material";

const PreConsultationDialogStyled = styled(Stack)(() => ({
    "& .MuiAvatarGroup-avatar": {
        width: 24,
        height: 24
    },
    "& .MuiAvatarGroup-avatar:not([type])": {
        color: "black",
        fontSize: 12,
        marginLeft: -6
    }
}));

export default PreConsultationDialogStyled;
