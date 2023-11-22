import {styled} from "@mui/material/styles";
import {Stack} from "@mui/material";

const RecondingBoxStyle = styled(Stack)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.25em',
    borderRadius: '0.5em',
    backgroundColor: theme.palette.text.primary,
    minWidth: '260px',
    cursor: 'pointer',
    "& .close-button": {
        marginLeft: 0
    },
    "& .rhap_container": {
        backgroundColor: theme.palette.text.primary,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0
    },
    "& .rhap_controls-section": {
        display: "inline-flex"
    },
    "& .rhap_time": {
        color: "white"
    },
    "& .rhap_progress-filled, .rhap_progress-indicator": {
        backgroundColor: theme.palette.primary.main
    },
    "& .rhap_main-controls": {
        display: "block",
        marginTop: "-0.9rem"
    },
    "& .rhap_main-controls-button": {
        color: theme.palette.primary.main
    },
    "& .MuiSvgIcon-root": {
        pl: 0
    },
    "& .is-paused": {
        backgroundColor: "white"
    },
    '.recording-circle': {
        backgroundColor: 'white',
        width: '0.7em',
        height: '0.7em',
        borderRadius: '50%',
        animation: 'ease pulse 1s infinite',
        marginRight: '0.2em',
        marginLeft: '0.2em'
    },
    '.recording-text': {
        fontSize: '0.75em',
        color: 'white'
    },
    '@keyframes pulse': {
        '0%': {backgroundColor: "white"},
        '50%': {backgroundColor: '#f06c6c'},
        '100%': {backgroundColor: 'white'}
    }
}));
export default RecondingBoxStyle;
