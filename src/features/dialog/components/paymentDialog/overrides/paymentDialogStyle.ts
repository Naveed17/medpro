import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
const PaymentDialogStyled = styled(Box)(({ theme }) => ({
    '.MuiAvatar-root': {
        width: 28,
        height: 28,
    },
    '.MuiFormGroup-root': {
        marginTop: theme.spacing(3),

        '.MuiFormControlLabel-root': {
            backgroundColor: theme.palette.primary.lighter,
            border: '1px solid transparent',
            padding: theme.spacing(.7, 1),
            borderRadius: theme.spacing(1),
            marginLeft: 0,
            marginBottom: -1,
            '.label-inner': {
                svg: {
                    path: {
                        fill: theme.palette.text.primary

                    }
                }
            },
            '&.selected': {
                backgroundColor: 'transparent',
                border: `1px solid ${theme.palette.divider}`,
                borderBottomColor: theme.palette.common.white,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
            }
        }
    },
    '.tab-panel': {
        border: `1px solid ${theme.palette.divider}`,
        borderTop: 'none',
        '.MuiPaper-root': {
            padding: theme.spacing(2)
        }
    }

}));
export default PaymentDialogStyled