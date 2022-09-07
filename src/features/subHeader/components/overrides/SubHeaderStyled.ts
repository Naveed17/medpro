//component styles
import {styled} from "@mui/system";
import {AppBar} from "@mui/material";

const SubHeaderStyled = styled(AppBar)(({theme}) => ({
    border: "none",
    "& .MuiToolbar-root":{
        display: "block"
    },
    [theme.breakpoints.down('sm')]: {
        ".MuiToolbar-root": {
            borderTop: `1px solid ${theme.palette.grey["A300"]}`,
        },
    },
    "& .breadcrumbs": {
        textTransform: "capitalize",
        "& p": {
            fontSize: 15,
        },
    },
    "& .settings-action": {
        marginLeft: "auto",
        "& button": {
            marginLeft: 14,
        },
    },
}));

export default SubHeaderStyled;
