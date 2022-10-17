import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';
const CIPPatientHistoryNoDataCardStyled = styled(Card)(({ theme }) => ({
    '& .card-header': {
        backgroundColor: theme.palette.text.secondary,
        padding:theme.spacing(2),
        svg:{
            path:{
                fill:theme.palette.grey[0]
            }
        }
    },
    '& .motif-card': {
        height: '100%',
        width:'100%',
        '.MuiCardContent-root': {
            padding: theme.spacing(1),
            '.MuiList-root': {
                padding: 0,
                paddingLeft: theme.spacing(.5),
                '.MuiListItem-root': {
                    fontSize: theme.typography.body2.fontSize,
                    '.MuiListItemIcon-root': {
                        minWidth: theme.spacing(2),
                        svg: {
                            width: theme.spacing(0.75),
                            height: theme.spacing(0.75),
                        },
                    },
                    padding: theme.spacing(0),
                    
                }
            },
        }
    }
}));
export default CIPPatientHistoryNoDataCardStyled;