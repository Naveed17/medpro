import {Stack,styled} from '@mui/material';
const RootStyled = styled(Stack)(({theme})=>({
    ".patient-avatar":{
         width: 64,
        height: 64,
        backgroundColor: theme.palette.common.white,
        boxShadow: "0px 0px 0px 4px rgba(6, 150, 214, 0.25)"
    },
    ".MuiAvatarGroup-avatar":{
    "&.assurance-avatar":{
        width:24,
        height:24,
        backgroundColor: theme.palette.common.white,
        border:'none',
        boxShadow:'none',
        margin:0,
        "&:not(:first-of-type)":{
            marginLeft:theme.spacing(.5),
        },
        img:{
            objectFit:"contain"
        }
    },
},
    ".MuiCard-root":{
        border:'none',
        boxShadow:'none',
        overflow:'visible'
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
    },
     "&.medical-rec":{
    ".chart-view":{
        button:{
            backgroundColor:'transparent',
            "&.active":{
                backgroundColor:theme.palette.grey[200]
            }
        }
    },
    ".chart-wrapper":{
        padding:theme.spacing(1),
        border: `1px dashed ${theme.palette.divider}`,
    }
},
"&.info-panel":{
    ".info-card":{
        backgroundColor:'transparent',
        border: `1px dashed ${theme.palette.divider}`,
        ".custom-icon-button":{
            minWidth:32,
            minHeight:32,
            padding:4
        },
        ".assurance-avatar":{
            minWidth:24,
            minHeight:24,
            boxShadow: "0px 0px 0px 3px rgba(6, 150, 214, 0.25)",
            padding:8,
             "&:not(:first-of-type)":{
            marginLeft:theme.spacing(1.5),
            
        },

        }
    }
},
"&.docs-panel":{
    ".doc-card":{
        ".MuiCardMedia-root":{
            height:"min(120px , 120px)",
            padding:theme.spacing(2,4),
            backgroundColor:theme.palette.primary.lighter,
            borderRadius:theme.shape.borderRadius,
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            img:{
            maxWidth: "100%",
            height: "auto"
            }
         },
         ".MuiCardContent-root":{
            paddingLeft:0,
            paddingRight:0,
            paddingTop:8
         }
        
    }
},
"&.payments-panel":{
    ".transactions-card":{
        border: `1px solid ${theme.palette.divider}`,
         ".custom-icon-button": { minWidth: 32, minHeight: 32, backgroundColor: theme.palette.primary.lighter }
        
    }
    

}

   
}));
export default RootStyled