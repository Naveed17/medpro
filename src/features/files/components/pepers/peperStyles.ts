import {styled} from "@mui/material/styles";

export const PaperStyles = styled("div")(({ theme }) => ({
   "& .page":{
       margin: 20,
       padding: 20,
       backgroundColor:"white",
       pageBreakAfterreak: "always",
       wordWrap: "break-word",
   },

".pageBreak": {
    pageBreakBefore: "always",
    margin:20
},

"& .pageNumber" :{
    textAlign: "center",
    marginTop: 10
}

}))
export default PaperStyles
