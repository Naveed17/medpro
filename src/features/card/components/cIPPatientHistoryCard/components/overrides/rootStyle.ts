import { styled } from '@mui/material/styles';
const RootStled = styled('div')(({ theme }) => ({
    '& .motif-card': {
        height: '100%',
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
                    listStyle: "disc",
                }
            },
        }
    }
}));
export default RootStled;