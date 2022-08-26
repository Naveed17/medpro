import { Card } from '@mui/material'
import { styled } from '@mui/material/styles'
const CipCardStyled = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.text.primary,
    marginRight: theme.spacing(1),
    ".MuiIconButton-root": {
        color: theme.palette.grey[0]
    }
}));
export default CipCardStyled