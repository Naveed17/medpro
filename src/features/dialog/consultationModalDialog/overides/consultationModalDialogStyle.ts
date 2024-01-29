import { styled } from '@mui/material/styles'
const ConsultationModalDialogStyle = styled('div')(({ theme }) => ({
    minWidth: 568,
    width: '100%',
    [theme.breakpoints.down('lg')]: {
        minWidth: '100%',
    },
    '& > .MuiList-root': {
        maxWidth: '75%',
        margin: '0 auto',
        [theme.breakpoints.down('lg')]: {
            maxWidth: '100%',
        },
        ".MuiListItem-root": {
            flexDirection: 'column',
            alignItems: 'flex-start',
            cursor: 'pointer',
            '.collapse': {
                position: 'absolute',
                right: '0',
                top: 20,

            }
        },
        '.MuiCollapse-root': {
            width: '100%',
        }
    }
}));
export default ConsultationModalDialogStyle;