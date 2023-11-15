import {Card} from '@mui/material';
import {styled} from '@mui/material/styles';

const PanelStyled = styled(Card)(({theme}) => ({
    border:'none',
    '.btn-del':{
        border:`1px solid ${theme.palette.divider}`,
        borderRadius:6,
        padding:4,
    },
    ".payment-table":{
         width:'100%',
        borderCollapse:'separate',
        borderSpacing:theme.spacing(0,1),
        th:{
            fontWeight:400,
            fontSize:12,
        },
        tbody:{
            tr:{
             "&.payment-table-row":{   
            position:'relative',
            "&:before":{
                content: 'url(/static/icons/bill-list.svg)',
                display:'flex',
                justifyContent:'center',
                alignItems:'center',
                paddingTop:5,
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: theme.palette.divider,
                position:'absolute',
                left:-50,
                border:`1px solid ${theme.palette.divider}`
            },
        td:{
            fontSize:12,
            padding:theme.spacing(.8),
            borderTop:`1px solid ${theme.palette.divider}`,
            borderBottom:`1px solid ${theme.palette.divider}`,
            
              "&:first-of-type": {
                borderLeft: `1px solid ${theme.palette.divider}`,
                borderTopLeftRadius:6,
                borderBottomLeftRadius:6,
              },
              "&:last-of-type": {
                borderRight: `1px solid ${theme.palette.divider}`,
                borderTopRightRadius:6,
                borderBottomRightRadius:6,

              },
            
            },
            "&.row-collapse":{
             "&:before":{
                content: 'url(/static/icons/bill-list-sec.svg)',
                backgroundColor:theme.palette.common.white,
                
             },
             td:{
              "&:first-of-type": {
                borderBottomLeftRadius:0,
              },
              "&:last-of-type": {
                borderBottomRightRadius:0,
              }
             }  
            }
        },
        ".collapse-wrapper":{
            position:"relative",
            "&:before":{
                content:'""',
                position:'absolute',
                height:'calc(100% - 28px)',
                border:`1px dashed ${theme.palette.divider}`,
                left:-34,
                top:-6,
            },
        ".means-wrapper":{
            padding:theme.spacing(2),
            backgroundColor:theme.palette.background.default,
            borderTopLeftRadius:0,
            borderTopRightRadius:0,
            borderTop:'none'
            

        },
        '.consultation-card':{
            position:'relative',
            overflow:'visible',
            "&:before":{
                content:'""',
                position:'absolute',
                width:10,
                height:10,
                borderRadius:'50%',
                backgroundColor:theme.palette.divider,
                left:-39,
                top:20,
            },
            ".MuiCardContent-root":{
                "&:last-child":{
                    padding:theme.spacing(2)
                }
            }
        }
    }
    }
    }
    }
}));
export default PanelStyled
