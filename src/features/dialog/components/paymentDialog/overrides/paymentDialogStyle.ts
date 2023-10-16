import {styled} from '@mui/material/styles'
import {Box} from '@mui/material'

const PaymentDialogStyled = styled(Box)(({theme}) => ({
    '& .MuiDialogContent-root': {
        padding: "24px 40px"
    },
    '.MuiAvatar-root': {
        width: 42,
        height: 42,
    },
    '& .MuiFormGroup-root': {
        border: "none",
        marginTop: theme.spacing(3),
        flexWrap: 'nowrap',
        '.MuiFormControlLabel-root': {
            backgroundColor: theme.palette.primary.lighter,
            position:'relative',
            border: '1px solid transparent',
            padding: theme.spacing(.7, 1),
            borderRadius: theme.spacing(1),
            marginLeft: 0,
            marginBottom: 8,
            '.label-inner': {
                svg: {
                    path: {
                        fill: theme.palette.text.primary

                    }
                },
            
            },
            '&.selected': {
                backgroundColor: 'transparent',
                border: `1px solid ${theme.palette.divider}`
            },
            [theme.breakpoints.down("sm")]:{
                margin:0
            }
        },
        [theme.breakpoints.down("sm")]:{
            display:'grid',
            gap:theme.spacing(1)
        }
    },
    '.tab-panel': {
        border: `1px solid ${theme.palette.divider}`,
        margin: "8px 0",
        borderRadius: 8,
        '.MuiPaper-root': {
            padding: theme.spacing(2)
        }
    },
    '.consultation-card':{
        overflow:'visible',
        ".MuiCardContent-root":{
            '&:last-child':{
                paddingBottom:theme.spacing(2)
            },
            ".btn-collapse":{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: theme.spacing(.7),
                padding: theme.spacing(.2),
                marginLeft:'auto'
            }
        },
        ".data-table":{
            tableLayout:'fixed',
            width:'100%',
            tr:{
            th:{
                fontWeight:400,
                fontSize:12,
                paddingBottom:10,
            },
            td:{
                fontSize:12,
                paddingBottom:8
            
            },
            "&:last-child":{
                td:{
                    paddingBottom:0
                }
            },
        }
        },
        ".btn-print":{
            border:`1px solid ${theme.palette.divider}`,
            color:theme.palette.text.primary,
        }
    }

}));
export default PaymentDialogStyled
