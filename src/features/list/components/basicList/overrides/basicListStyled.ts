import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";

const BasicListStyled = styled(Box)(({theme}) => ({
        "& .MuiList-root": {
            width: "100%",
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
            "& .MuiListItem-root ": {
                padding: 0
            },
        },
        svg: {
            path: {
                color: theme.palette.text.primary,
            }
        },
        ".dot": {
            height: 6,
            width: 6,
            backgroundColor: theme.palette.grey["A600"],
            borderRadius: "50%",
            display: "inline-block",
            marginRight: 3
        }
    }))
;

export default BasicListStyled;
