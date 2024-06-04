import {styled} from "@mui/material/styles";

const RootStyled = styled('div')(({ theme }) => ({
    '& .btn-add': {
        borderColor: theme.palette.divider,
        paddingTop: theme.spacing(2.25),
        paddingBottom: theme.spacing(2.25),
        '& svg': {
            fontSize: theme.spacing(4),
        }
    },
    '& .autocomplete-container': {
        position: 'relative',
        overflow: 'hidden',
    },
    ".sms-remind-acc":{
        border:'none',
        ".MuiAccordionSummary-root":{
            border: `1px solid ${theme.palette.divider}`,
            minHeight:40,
            borderRadius:theme.shape.borderRadius,
            ".MuiAccordionSummary-content":{
                marginTop:4,
                marginBottom:4,
                alignItems:'center',
                fontSize:theme.typography.body2.fontSize,
                fontWeight:500  
            },
        },
         ".MuiAccordionDetails-root":{
                border: `1px dashed ${theme.palette.primary.main}`,
                marginTop:theme.spacing(2),
                borderRadius:theme.shape.borderRadius,
                 "& .MuiOutlinedInput-root": {
                    background: theme.palette.grey[50],
                    "&.MuiInputBase-multiline":{
                    background: theme.palette.common.white
                 }}

            },
        "&.Mui-expanded":{
            ".MuiAccordionSummary-root":{
                border: `1px solid transparent`,
                backgroundColor:theme.palette.primary.lighter,
                ".MuiAccordionSummary-content":{
               color:theme.palette.primary.main
            },
                "&:hover":{
                    backgroundColor:theme.palette.primary.lighter
                },
                
            },
            "&.Mui-expanded":{
            marginTop:theme.spacing(2)
        }
        }
    
    }
}))

export default RootStyled;
