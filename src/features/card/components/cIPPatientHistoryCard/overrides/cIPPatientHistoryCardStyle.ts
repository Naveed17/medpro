import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';
const CIPPatientHistoryCardStyled = styled(Card)(({ theme }) => ({
    '& .card-header': {
        '& .react-svg': {
            marginRight: theme.spacing(1),
        }
    },
    '& .MuiList-root': {
        display: 'inline-flex',
        flexDirection: 'column',
        '& .MuiListItem-root': {
            display: "inline-flex",
            width: "max-content",
            cursor: "pointer",
            "& .MuiListItemIcon-root": {
                minWidth: theme.spacing(2),
                svg: {
                    width: 10,
                    height: 10,
                    path: {
                        fill: theme.palette.primary.main
                    }
                }
            },
            "& .MuiListItemText-root": {
                span: {
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                }
            }
        }
    }
}));
export default CIPPatientHistoryCardStyled;