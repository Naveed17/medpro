import {styled} from "@mui/system";

const RootStyled = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    padding: theme.spacing(3, 0),
    [theme.breakpoints.up("sm")]: {
        flexDirection: "row",
        padding: theme.spacing(1.75, 0),
        justifyContent: "space-between",
    },
}));

export default RootStyled;
