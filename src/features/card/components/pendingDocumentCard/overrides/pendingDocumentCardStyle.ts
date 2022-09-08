import { Card } from '@mui/material'
import { styled } from '@mui/material/styles'
const PendingDocumentCardStyled = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.text.primary,
    cursor: 'pointer',
    width: 'fit-content',
    padding: theme.spacing(.85, .9),
    transition: theme.transitions.create("all"),
    ".MuiIconButton-root": {
        color: theme.palette.grey[0],
        svg: {
            width: 20,
            height: 20,
            path: {
                fill: theme.palette.grey[0],
            }
        },
        "&.btn-close": {
            svg: {
                path: {
                    fill: theme.palette.text.primary,
                }
            },
        },

    },
    "&:hover": {
        backgroundColor: theme.palette.primary.main,
        ".btn-close": {
            svg: {
                path: {
                    fill: theme.palette.grey[0],
                }
            },
        },
    }
}));
export default PendingDocumentCardStyled
