import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";

const RootStyled = styled(Box)(({theme, ...props}) => ({
    textAlign: "center",
    maxWidth: 360,
    margin: "16px auto 0 auto",
    [theme.breakpoints.down("sm")]: {
        maxWidth: "100%",
    },
    ".main-icon": {
        svg: {
            width: 80,
            height: 80,
            ...((props as any).firstbackgroundonly ? {
                "path:first-of-type": {
                    fill: "#C9C8C8",
                }
            } : {
                path: {
                    fill: "#C9C8C8",
                }
            })
        },
    },
}));

export default RootStyled;
