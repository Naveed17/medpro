import {styled} from "@mui/material/styles";

const InsuranceStyled = styled("div")(({theme}) => ({

    "& .MuiInputBase-root": {
        background: "#F9F9FB !important",
        border:"1px solid grey",
        "&:hover": {
            backgroundColor: "none"
        },
    },
}));

export default InsuranceStyled;
