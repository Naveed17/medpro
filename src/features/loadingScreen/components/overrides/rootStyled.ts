import {styled} from "@mui/material/styles";

const RootStyled = styled("div")(({theme}) => ({
    width: "100%",
    height: "100%",
    position: "fixed",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "center",
    top: 0,
    left: 0,
    zIndex: 9998,
    backgroundColor: theme.palette.background.default,
    "& .MuiTypography-root": {
        whiteSpace: "break-spaces"
    },
    "& .loading-text": {
        fontWeight: 100,
        fontFamily: "sans-serif, 'Poppins'",
        fontSize: 18,
        width: 350
    }
}));

export default RootStyled;
