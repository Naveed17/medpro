import {alpha, styled} from "@mui/material/styles";
import {Stack} from "@mui/material";

const InsuranceStyled = styled(Stack)(({theme}) => ({

    "& .MuiInputBase-root": {
        background: `${theme.palette.grey["A500"]} !important`,
        border:"1px solid #bfbfc1",
        "&:hover": {
            backgroundColor: "none"
        },
    },
    "& .title":{
        fontSize:18,
        color:theme.palette.grey["600"],
        fontWeight:"bold"
    },
    "& .insurance-box":{
        border: `1px dashed ${theme.palette.grey["300"]}`,
        borderRadius:6,
        padding:20,
        margin:10,
        "& .name":{
            fontSize:18,
            color:theme.palette.white.darker,
            fontWeight:"bold"
        },
        "& .title":{
            background: theme.palette.background.default,
            color:theme.palette.primary.main,
            height:"fit-content",
            padding: 6,
            borderRadius: 6,
            fontSize: 12,
            fontWeight: "bold"
        },
        "& .number":{
            fontSize:16,
            color: theme.palette.white.darker,
            fontWeight:"bold"
        },
        "& .expireIn":{
            color: "#B5B5C3",
            fontSize:13
        }
    },
    "&.success-light": {
        backgroundColor: alpha(theme.palette.success.main, 0.3),
        borderRadius: 6,
        width:35,
        "&:hover": {
            backgroundColor: alpha(theme.palette.success.main, 0.6),
        },
        "& svg": {
            "& path": {
                fill: theme.palette.text.primary,
            },
        },
        "&.Mui-disabled": {
            backgroundColor: theme.palette.grey[100]
        }
    },
}));

export default InsuranceStyled;
