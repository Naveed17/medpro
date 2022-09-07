import { Card } from '@mui/material'
import { styled } from '@mui/material/styles'
const PendingDocumentCardStyled = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.text.primary,
    width: 'fit-content',
    padding: 2,
    ".MuiIconButton-root": {
        color: theme.palette.grey[0],
        svg: {
            width: 20,
            height: 20,
            path: {
                fill: theme.palette.grey[0],
            }
        }
    },
    '.label': {
        [theme.breakpoints.down("md")]: {
            display: 'none'
        }
    }
}));
export default PendingDocumentCardStyled
