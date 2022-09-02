import { Card } from '@mui/material'
import { styled } from '@mui/material/styles'
const CipNextAppointCardStyled = styled(Card)(({ theme }) => ({
    border: 'none',
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    '.date-time': {
        '.react-svg svg': {
            width: theme.spacing(1.5),
            path: {
                fill: theme.palette.text.primary
            }
        }
    },
    '.btn-more': {
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    '.btn-more-mobile': {
        display: 'none',
        svg: {
            width: theme.spacing(2),
            height: theme.spacing(2),
            path: {
            }
        },
        [theme.breakpoints.down('md')]: {
            display: 'block'
        }
    }
}));
export default CipNextAppointCardStyled
