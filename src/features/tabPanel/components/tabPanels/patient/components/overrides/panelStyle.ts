import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';

const PanelStyled = styled(Box)(({theme}) => ({
    '.files-panel': {
        '.filter': {
            border: 'none',
            padding: theme.spacing(1),
            marginBottom: theme.spacing(1)

        }
    },
    "& .patient-history-card": {
        marginTop: 8
    }
}));
export default PanelStyled
