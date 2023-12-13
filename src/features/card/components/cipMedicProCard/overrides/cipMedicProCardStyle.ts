import { Card } from '@mui/material'
import { styled, alpha } from '@mui/material/styles'
const CipMedicProCardStyled = styled(Card)(({ theme }) => ({
    padding: theme.spacing(1.5),
    borderRadius:10,
    cursor:'pointer',
    '.btn-amount': {
        backgroundColor: alpha(theme.palette.success.main, 0.1),
        borderColor: theme.palette.divider,
        color: theme.palette.text.primary,
        marginRight: theme.spacing(1),
    },
    '.btn-no-amount': {
        backgroundColor: 'transparent !important',
        borderColor: 'transparent',
        color: theme.palette.text.primary + ' !important',
        marginRight: theme.spacing(1),
    }
}));
export default CipMedicProCardStyled
