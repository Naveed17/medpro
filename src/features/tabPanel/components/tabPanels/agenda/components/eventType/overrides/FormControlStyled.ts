import {styled} from "@mui/material/styles";
import {FormControl} from "@mui/material";

const FormControlStyled = styled(FormControl)<any>(({theme}) => ({
    "& .MuiFormGroup-root":{
      padding: ".6rem"
    },
    "& .MuiFormLabel-root": {
        fontWeight: 500,
        fontSize: "14px",
        lineHeight: "21px",
        textTransform: "uppercase",
        color: "#1B2746"
    },
    "& .MuiFormControlLabel-root":{
        padding: "8px 0",
        [theme.breakpoints.down("sm")]:{
            marginRight: 0
        }
    }
}));

export default FormControlStyled;
