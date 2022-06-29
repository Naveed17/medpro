import {Typography} from "@mui/material";
import {styled} from "@mui/material/styles";

const LabelStyled = styled(Typography)(({ theme }) => ({
    ...theme.typography.body1,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
}));

export default LabelStyled;
