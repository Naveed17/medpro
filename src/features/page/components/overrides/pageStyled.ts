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
        '& .x': {
            border: "1px solid",
            display: "flex",
            flexWrap: "wrap",
            height: 600,
            width: 300,
            marginBottom: 20
        },
        '& .page': {
            boxShadow: "0 0 6px #ccc",
            background: "white",
            marginBottom: 10,
            border:"1px solid white"
        },
        '& .a4': {
            width: PWIDTH_A4,
            height: PHEIGHT_A4,
            zoom: "70%"
        },
        '& .a5': {
            width: PWIDTH_A5,
            height: PHEIGHT_A5,
        },
        '& .landscapea4': {
            width: PHEIGHT_A4,
            height: PWIDTH_A4,
            zoom: "60%"
        },
        '& .landscapea5': {
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
            //padding: 10,
            overflow: "hidden",
            margin: "0 10mm"
        },
        "& .selected": {
            border: `2px dashed ${theme.palette.primary.main}`,
            borderRadius: 5,
        },
        "& .notSelected": {
            border: "1px dashed #DDD",
            borderRadius: 5
        },
        "@media print": {
            "& .dropzone": {margin: 0},
            "& .a5": {
                margin: 0,
                boxShadow: "none",
                border: 0,
            },
            "& .a4": {
                margin: 0,
                boxShadow: "none",
                zoom: 1
            },
            '& .landscapea4': {
                margin: 0,
                boxShadow: "none",
                zoom: 1
            },
            '& .landscapea5': {
                margin: 0,
                boxShadow: "none",
                zoom: 1
            },
            "& .notSelected": {
                border: 0
            },
            "& .selected":{border:0},
            "& .menuTop": {
                visibility: "hidden"
            },
            "& .menu": {
                visibility: "hidden"
            }
        },
        "& .menu": {
            position: "absolute",
            top: 5,
            right: 5,
            background: theme.palette.info.main,
            padding: 10,
            borderRadius: 5,
        },
        "& .menuTop": {
            position: "absolute",
            top: -45,
            right: 0,
            padding: 10,
            display: "flex",
            gap: 5
        },
        "& .btnMenu": {
            background: theme.palette.info.main,
            borderRadius: 5,
            width: 30,
            height: 30,
            justifyContent: "center",
            display: "flex",
            alignItems: "center"
        },
        "& .dropzone": {
            width: "fit-content",
            margin: "auto",
        },

        "& .drop-active": {
            borderColor: "#aaa"
        },

        "& .dropTarget": {
            backgroundColor: "#29e",
            borderColor: "#fff",
            borderStyle: "solid"
        },

        "& .drag-drop": {
            height:10,
            widget:10,
        },

        "& .can-drop": {
            color: "#000",
            backgroundColor: "#4e4"
        }
    }
));

export default PageStyled;
