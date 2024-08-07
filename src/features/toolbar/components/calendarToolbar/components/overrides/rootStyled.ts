import {styled} from "@mui/system";

const RootStyled = styled("div")(({theme}) => ({
    display: "flex",
    // width: !useMediaQuery(theme.breakpoints.down("sm")) ? "100%" : "auto",
    // alignItems: "center",
    flexDirection: "column",
    flexGrow: "1",
    // padding: theme.spacing(3, 0),
    "& .Current-date": {
        color: theme.palette.text.primary,
        padding: "0 0 0 5px",
        "& .MuiTypography-root": {
            fontSize: 20,
            fontWeight: 'bold',
            textTransform: "capitalize"
        },
        "& .MuiIconButton-root": {
            padding: 12
        }
    },
    [theme.breakpoints.up("sm")]: {
        flexDirection: "row",
        padding: theme.spacing(1.75, 0),
        justifyContent: "space-between",
    }
}));

export default RootStyled;
