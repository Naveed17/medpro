import {alpha, styled} from "@mui/material/styles";
import {Box} from "@mui/material";

const OcrDocsDialogStyled = styled(Box)(({theme}) => ({
    marginTop: '1Rem',
    '& .MuiGrid-container': {
        margin: 'auto',
        width: '95%',
        borderRadius: 6,
        border: `1px dashed ${theme.palette.grey['A100']}`,
        '& .upload-icon': {
            marginTop: '56%'
        }
    },
    '& .MuiGrid-item': {
        margin: 16,
        height: 365
    },
    '& .upload-trigger': {
        backgroundColor: theme.palette.background.default,
        height: '98%',
        borderRadius: 6,
        cursor: 'pointer',
        border: `1px dashed ${theme.palette.primary.main}`
    },
    '& .alert-card': {
        margin: 16,
        padding: 16,
        borderRadius: 6,
        border: `1px dashed ${theme.palette.grey['B900']}`,
        background: alpha(theme.palette.grey['B900'], 0.2),
        '& .alert-card-description': {
            color: theme.palette.grey['B901']
        },
        [theme.breakpoints.down('md')]:{
            margin:0,
            marginTop:theme.spacing(1.2),
            
        }
    },
    '& .react-pdf__Page': {
        scale: '0.25',
        transformOrigin: 'top',
        width: "30vw"
    },
    '& .container__document': {
        height: '98%',
        borderRadius: 6,
        border: `1px solid ${theme.palette.grey['A100']}`,
        width: '100%'
    },
    '& .container__document .react-pdf__Document': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    '& .container__document .react-pdf__Page': {
        margin: '1em 0',
        boxShadow: theme.shadows[5]
    },
    '& .container__document .react-pdf__message': {
        padding: 20,
        color: 'white'
    },
    '& .btn-list-action': {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 8,
        padding: 6
    },
    '& .document_actions': {
        width: '86%',
        zIndex: 3,
        marginTop: '15rem'
    },
    '& .document_actions_': {
        width: '86%',
        zIndex: 3,
        marginTop: '1rem'
    },
    '& .document_name': {
        paddingLeft: 8,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: 400,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        width: 200
    }
}));

export default OcrDocsDialogStyled;
