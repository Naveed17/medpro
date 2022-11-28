import {styled} from '@mui/material/styles'
import {Box} from '@mui/material'

const PaymentDialogStyled = styled(Box)(({theme}) => ({
    '& .MuiDialogContent-root': {
        padding: "24px 40px"
    },
    '.MuiAvatar-root': {
        width: 28,
        height: 28,
    },
    '& .MuiFormGroup-root': {
        border: "none",
        marginTop: theme.spacing(3),
        flexWrap: 'nowrap',
        '.MuiFormControlLabel-root': {
            backgroundColor: theme.palette.primary.lighter,
            border: '1px solid transparent',
            padding: theme.spacing(.7, 1),
            borderRadius: theme.spacing(1),
            marginLeft: 0,
            marginBottom: 8,
            '.label-inner': {
                svg: {
                    path: {
                        fill: theme.palette.text.primary

                    }
                }
            },
            '&.selected': {
                backgroundColor: 'transparent',
                border: `1px solid ${theme.palette.divider}`
            }
        }
    },
    '.tab-panel': {
        border: `1px solid ${theme.palette.divider}`,
        margin: "8px 0",
        borderRadius: 8,
        '.MuiPaper-root': {
            padding: theme.spacing(2)
        }
    }

}));
export default PaymentDialogStyled
