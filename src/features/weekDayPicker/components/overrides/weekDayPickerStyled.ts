import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";

const WeekDayPickerStyled = styled(Box)(({theme}) => ({
    "& .header": {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: theme.spacing(1),
        "& .arrow-back": {
            marginRight: theme.spacing(1),
        },
    },
    "& .week-days": {
        padding: theme.spacing(1.2),
        display: " grid",
        gridTemplateColumns: "auto auto auto auto auto auto auto",
        overflow: "hidden",
        overflowX: "scroll",
        "& .day": {
            padding: theme.spacing(1.3, 0),
            cursor: "pointer",
            transition: "all 0.6s ease",
            borderRadius: "27px",
            margin: theme.spacing(0, 1),
            width: 36,
            textAlign: "center",
        },
    },
}));

export default WeekDayPickerStyled;
