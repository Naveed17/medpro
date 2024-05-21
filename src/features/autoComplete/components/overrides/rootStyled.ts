import {styled} from '@mui/material/styles';

const RootStyled = styled('div')(({theme}) => ({
   '.btn-add-patient':{
    border:`1px solid ${theme.palette.primary.light}`,
    backgroundColor:theme.palette.primary.lighter,
    "&.btn-add-patient":{
    minHeight:35
}
   },
    
    '& .MuiList-root': {
        marginLeft: -10,
        marginRight: -10,
        maxHeight: 320,
        overflowY: 'auto'
    }
}));

export default RootStyled;
