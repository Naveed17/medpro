import {Box, styled} from "@mui/system";

const BoxStyled = styled(Box)(({theme}) => ({
    minHeight: 150,
    [theme.breakpoints.down('sm')]: {
        "& .header-section": {
            textAlign: "center"
        },
        "& .time-slot-container": {
            width: " 90%",
            marginBottom: "1rem"
        },
        "& .week-days": {
            overflowX: "scroll",
            overflowY: "hidden",
            whiteSpace: "nowrap"
        }
    }
}));

export default BoxStyled;
