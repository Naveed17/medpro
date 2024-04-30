import {Stack,styled} from '@mui/material';
import { backIn } from 'framer-motion';
const RootStyled = styled(Stack)(({theme})=>({
    "&.medical-rec":{
    ".patient-avatar":{
         width: 64,
        height: 64,
        backgroundColor: theme.palette.common.white,
        boxShadow: "0px 0px 0px 4px rgba(6, 150, 214, 0.25)"
    },
    ".assurance-avatar":{
        width:24,
        height:24,
        backgroundColor: theme.palette.common.white,
        borderColor:'transparent',
        boxShadow:'none',
        margin:0,
        img:{
            objectFit:"contain"
        }
    },
    ".MuiCard-root":{
        border:'none',
        boxShadow:'none'
    },
    ".alert-primary":{
        backgroundColor:theme.palette.primary.lighter,
        border:'none'
    },
    ".appoint-alert":{
        backgroundColor:theme.palette.common.white,
        border: `1px dashed ${theme.palette.divider}`,
        ".btn-upcoming":{
            backgroundColor:theme.palette.primary.lighter
        },
         ".btn-completed":{
            backgroundColor:theme.palette.success.lighter
        }
    },
    ".btn-dup":{
        color:theme.palette.grey[700],
        svg:{
            path:{
                fill:theme.palette.error.main
            
            }
        }
    },
    ".note-wrapper":{
        backgroundColor:theme.palette.common.white,
        border: `1px dashed ${theme.palette.divider}`,
        paddingTop:theme.spacing(2),
        paddingBottom:theme.spacing(2),
        borderRadius:theme.shape.borderRadius,
        fieldset:{
            border: 'none !important', 
            boxShadow: "none !important" 
        },
        ".MuiOutlinedInput-root": { background: "none" },
        ".MuiFormLabel-root":{
            color: theme.palette.grey[500],
            fontSize: theme.typography.body1.fontSize,
            transform:'translate(14px, -9px) scale(1);'
        }
    },
    ".disease-card":{
        backgroundColor:'transparent',
        border: `1px dashed ${theme.palette.divider}`,
        ".MuiCardHeader-title":{
            fontSize: theme.typography.subtitle2.fontSize,
            fontWeight:600,
            cursor:'pointer'
        }
    }
}

   
}));
export default RootStyled