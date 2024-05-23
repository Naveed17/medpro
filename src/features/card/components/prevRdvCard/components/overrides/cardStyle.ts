import {Timeline} from '@mui/lab';
import {styled} from '@mui/material';
const CardStyled =  styled(Timeline)(({theme}) => ({
    ".MuiTimelineContent-root":{
        border: `1px dashed ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        marginLeft:theme.spacing(1),
        padding:theme.spacing(2),
        ".item-treatment":{
            border: `1px solid ${theme.palette.divider}`,
            flex:1
            
        },
        ".doc-card":{
            border: `1px solid ${theme.palette.divider}`,
            ".MuiCardHeader-root":{
                padding:theme.spacing(1),
            ".MuiAvatar-root":{
                backgroundColor:theme.palette.primary.lighter,
                width:40,
                height:40,
            },
            ".MuiCardHeader-action":{
                alignSelf:'center',
                marginLeft:theme.spacing(3),
                marginRight:theme.spacing(2)
            }
            }
        },
        
    },
    ".MuiTimelineSeparator-root":{
            position:'relative',
            ".MuiTimelineConnector-root":{
                position:'absolute',
                top:24,
                height:'calc(100% - 6px)'
                
            }
        }
   
}));
export default CardStyled;