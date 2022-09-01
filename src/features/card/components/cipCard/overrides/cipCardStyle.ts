import { Card } from '@mui/material'
import { styled } from '@mui/material/styles'
const CipCardStyled = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.text.primary,
    marginRight: "1rem",
    ".MuiIconButton-root": {
        color: theme.palette.grey[0]
    },
    '.label': {
        [theme.breakpoints.down("md")]: {
            display: 'none'
        }
    }
}));
export default CipCardStyled
