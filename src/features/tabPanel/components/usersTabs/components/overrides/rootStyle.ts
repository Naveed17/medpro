import { Grid,styled } from "@mui/material";
const RootSyled = styled(Grid)(({ theme }) => ({
    '.motif-list':{
        flexDirection:'column',
        alignItems:'flex-start',
        borderBottom:`1px solid ${theme.palette.divider}`,
        paddingTop:theme.spacing(1.5),
        "&:not(:last-of-type)":{
             marginBottom:theme.spacing(.5),
        },
        cursor:'pointer',
        "&.selected":{
            backgroundColor:theme.palette.info.main,
            border:'none',
            borderRadius:(theme.shape.borderRadius * 2),
            transition:'all .2s ease-in-out',
        },
        ".MuiCollapse-root":{
            cursor:'default',
            width:'100%',
            ".collapse-wrapper":{
            width:'calc(100% + 64px)',

            borderTop:`1px solid ${theme.palette.common.white}`,
            marginLeft:theme.spacing(-2),
            marginRight:theme.spacing(-2),
            marginTop:theme.spacing(2),
            },
            ".permissions-wrapper":{
                display:'grid',
                gridTemplateColumns:'repeat(2, minmax(0, 1fr))',
                gap:theme.spacing(2),
                [theme.breakpoints.down("md")]:{
                    gridTemplateColumns:'repeat(1, minmax(0, 1fr))',
                }
            },

            ".MuiFormControlLabel-root":{
                margin:0,
            }
        },
        ".MuiListItemSecondaryAction-root":{
            transform:"none",
            top:10,

        }
    },
}));

export default RootSyled;
