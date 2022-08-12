import { Card } from '@mui/material';
import { styled } from '@mui/material/styles';
const ConsultationModalStyled = styled(Card)(({ theme }) => ({
    height: '100vh',
    '& .card-header': {
        '.icon-wrapper': {
            borderRadius: '50%',
            border: `1px solid ${theme.palette.divider}`,
            lineHeight: '80%',
            padding: theme.spacing(0.2),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        '.react-svg': {
            marginLeft: 'auto !important',
        },
        '.btn-filter': {
            minWidth: 'auto',
            padding: theme.spacing(1),
            minHeight: 'auto',
            backgroundColor: theme.palette.background.paper,
        }
    },
    '& .MuiCardContent-root': {
        position: 'relative',
        height: '100%',
        '.menu-list': {
            position: 'absolute',
            width: '100%',
            left: 0,
            top: 0
        },
        '.MuiList-root': {
            padding: 0,
            ".MuiMenuItem-root": {
                paddingTop: theme.spacing(1.3),
                paddingBottom: theme.spacing(1.3),
                '&:not(:last-child)': {
                    borderBottom: `1px solid ${theme.palette.divider}`
                },
                '.MuiListItemIcon-root': {
                    minWidth: theme.spacing(3),
                    svg: {
                        width: theme.spacing(2),
                        height: theme.spacing(2),
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: '50%',
                    }
                }
            }
        }
    }
}));
export default ConsultationModalStyled;