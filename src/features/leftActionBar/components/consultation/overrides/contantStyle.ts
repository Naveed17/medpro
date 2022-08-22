import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';
const ContentStyled = styled(Card)(({ theme }) => ({
    marginBottom: theme.typography.pxToRem(10),
    '.MuiCardContent-root': {
        padding: theme.spacing(0, 1),
        '.MuiList-root': {
            padding: 0,
            width: '100%',
            '.MuiListItem-root': {
                paddingLeft: 0,
                paddingRight: 0,
                '.MuiListItemIcon-root': {
                    minWidth: 10,
                    svg: {
                        width: theme.typography.pxToRem(5),
                        height: theme.typography.pxToRem(5),
                        fill: theme.palette.text.secondary,
                    }
                }
            }
        }
    }
}));
export default ContentStyled;