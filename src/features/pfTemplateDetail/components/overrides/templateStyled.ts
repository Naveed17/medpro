import {styled} from "@mui/material/styles";

const TemplateStyled = styled("div")(({theme}) => ({
    position:'relative',
    display: "inline-flex",
    flexWrap: "wrap",
    columnGap: 0,
    rowGap: 0,
    [theme.breakpoints.down("md")]:{
        width:"100%",
    },
    [theme.breakpoints.between("sm", "md")]:{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))',
        gap:20,
    },
    "& > .portraitA4":{
         [theme.breakpoints.down("md")]:{
            width:'100%',
            marginRight:'0 !important',
            marginBottom:150,
            
        },
        [theme.breakpoints.between("sm", "md")]:{
            height:'calc(100% - 200px)',
            marginBottom:0,
        },
    },
    "& .container": {
        padding: 5,
        position: "relative",
         ".portraitA4":{
        [theme.breakpoints.down("md")]:{
            width:'100%',
            marginLeft:'0 !important',
           
        },
      
    },
      [theme.breakpoints.down("md")]:{
            width:'100%',
            padding:0,
           
        },
    },
    "& .heading": {
        display: "inline-block",
        marginLeft: 6,
        padding: "2px 4px",
        borderRadius: 2,
        backgroundColor: theme.palette.primary.main,
        color: "#fff",
        textTransform: "uppercase",
        fontSize: 12,
        width: "fit-content",
        height: "fit-content",
        lineHeight: 1,
        letterSpacing: .3,
        fontWeight: 600
    },
    "& .doc-title": {
        fontSize: 10
    },
    "& .portraitA4": {
        zoom: "18%",
        '&:hover': {
            boxShadow: "0 8px 36px rgba(152,180,234,.19), 0 11px 33px rgba(122,152,210,.12)"
        }
    },
    "& .edit-btn": {
        position: "absolute",
        left: '50%',
        top: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 999
    },
    "& .title-content": {
        position: 'absolute',
        bottom: 13,
        left: 10,
        width: "85%",
        justifyContent: 'space-between',
        alignItems: "center"
    },
    "& .title": {
        fontSize: 10,
        overflow: "hidden",
        display: "-webkit-box",
        maxWidth: 110,
        //"-webkit-line-clamp": "1",
        //"-webkit-box-orient": "vertical"
    },
    "& .color-content": {
        width: 15,
        height: 15,
        borderRadius: 8
    },
    ".portraitA4.MuiBox-root":{
        [theme.breakpoints.down("md")]:{
            width:'100%',
            marginRight:'0 !important',
            marginBottom:150,
            
        },
        [theme.breakpoints.between("sm", "md")]:{
            height:'calc(100% - 200px)',
            marginBottom:0,
        },
    }
}));

export default TemplateStyled;
