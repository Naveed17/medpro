import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";

const PHEIGHT_A4 = "297mm";
const PWIDTH_A5 = "148mm"
const PHEIGHT_A5 = "210mm"
const PWIDTH_A4 = "210mm";
const PageStyled = styled(Box)(({theme}) => ({

"& .item": {
    boxSizing: "border-box",
    border: "1px solid #ccc",
    padding: 10,
    margin: 5,
    width: 200,
    height: 100,
    overflow: "auto"
},
        '& .x':{
            border: "1px solid",
            display: "flex",
            flexWrap: "wrap",
            height: 600,
            width: 300,
            marginBottom: 20
        },
        '& .page': {
            margin: "30px auto",
            marginBottom: 10,
            boxShadow: "0 0 6px #ccc",
            background: "white",
        },
        '& .a4': {
            width: PWIDTH_A4,
            height: PHEIGHT_A4,
            zoom: "70%"
        }, '& .a5': {
            width: PWIDTH_A5,
            height: PHEIGHT_A5,
        }, '& .landscapea4': {
            width: PHEIGHT_A4,
            height: PWIDTH_A4,
            zoom: "60%"
        }, '& .landscapea5': {
            width: PHEIGHT_A5,
            height: PWIDTH_A5,
            zoom: "85%"
        },
        '& .custom': {
            position: "relative",
            width: "fit-content",
            cursor: "pointer"
        },
        '& .content': {
            padding: 10,
            margin: "0 10mm"
        },
        "& .selected": {
            border: `2px dashed ${theme.palette.primary.main}`,
            borderRadius: 5,
        }, "& .notSelected": {
            border: "1px dashed #DDD",
            borderRadius: 5
        },
        "@media print": {
            "& .a5": {
                margin: 0,
                boxShadow: "none",
            },
            "& .a4": {
                margin: 0,
                boxShadow: "none",
                zoom: 1
            }, '& .landscapea4': {
                margin: 0,
                boxShadow: "none",
                zoom: 1
            }, '& .landscapea5': {
                margin: 0,
                boxShadow: "none",
                zoom: 1
            },
        },
        "& .menu": {
            position: "absolute",
            top: 0,
            right: 0,
            background: theme.palette.info.main,
            padding: 10,
            borderTopRightRadius: 5,
            borderBottomLeftRadius: 5,
            borderBottom: "1px dashed #DDD",
            borderLeft: "1px dashed #DDD",
        },
        "& .menuTop": {
            position: "absolute",
            top: -40,
            right: 0,
            background: theme.palette.info.main,
            padding: 10,
            borderTopLeftRadius: 5,
            borderTop: "1px dashed #DDD",
            borderLeft: "1px dashed #DDD"
        }
    }
));

export default PageStyled;
