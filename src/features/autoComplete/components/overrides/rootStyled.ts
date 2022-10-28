import {styled} from '@mui/material/styles';

const RootStyled = styled('div')(({theme}) => ({
    "& .MuiPaper-root":{
        width: "100%",
        backgroundColor: theme.palette.info.main,
        "& .MuiButtonBase-root":{

        }
    },
    '& .MuiInputBase-root': {
        backgroundColor: `${theme.palette.info.main} !important`,
    },
    '& .MuiList-root': {
        marginLeft: -10,
        marginRight: -10,
        maxHeight: 254,
        overflowY: 'auto'
    }
}));

export default RootStyled;
