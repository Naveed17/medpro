import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";

const BasicListStyled = styled(Box)(({theme}) => ({
        "& .MuiList-root": {
            width: "100%",
            padding: 0,
            backgroundColor: theme.palette.background.paper,
            "& .MuiListItem-root ": {
                padding: 0
            },
            "& .MuiListItemButton-root": {
                margin: 0
            }
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
        },
        "& .Mui-selected": {
            backgroundColor: "rgba(6, 150 ,214, 0.04)"
        },
        "& .MuiAvatar-root": {
            width: 36,
            height: 36
        },
        "& .MuiListItemAvatar-root": {
            marginTop: 6
        },

    }))
;

export default BasicListStyled;
