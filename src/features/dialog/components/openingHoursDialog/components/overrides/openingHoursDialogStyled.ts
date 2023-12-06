import {Stack, styled} from "@mui/material";

const OpeningHoursDialogStyled = styled(Stack)(({theme}) => ({
    "& .MuiOutlinedInput-root button": {
        padding: "5px",
        minHeight: "auto",
        height: "auto",
        minWidth: "auto"
    },
    "& .PrivatePickersMonth-root.Mui-selected": {
        fontSize: '1rem'
    }
}))

export default OpeningHoursDialogStyled
