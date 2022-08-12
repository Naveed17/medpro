import {styled} from '@mui/material/styles';

const RootStyled = styled('div')(({theme}) => ({
    '& .MuiInputBase-root': {
        backgroundColor: '#F8FAFC !important',
    },
    '& .MuiList-root': {
        marginLeft: -10,
        marginRight: -10,
        maxHeight: 300,
        overflowY: 'auto'
    }
}));

export default RootStyled;
