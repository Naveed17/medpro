import { styled } from '@mui/material/styles'
import { Stack } from '@mui/material'
const ConsultationIPToolbarStyled = styled(Stack)(({ theme }) => ({
    '.custom-tab': {
        color: theme.palette.grey[700] + ' !important',
        '&.Mui-selected': {
            color: theme.palette.primary.main + ' !important',
        }
    },
    ".action-button": {
        marginLeft: 'auto',
        alignSelf: 'center',
        backgroundColor: theme.palette.background.paper,
        '& .react-svg': {
            marginRight: theme.spacing(1),
            svg: {
                path: {
                    fill: theme.palette.primary.main
                }
            }
        },
        [theme.breakpoints.down('md')]: {
            position: 'fixed',
            zIndex: 99999,
            bottom: 70,
            right: 20,

        },
    }

}));
export default ConsultationIPToolbarStyled