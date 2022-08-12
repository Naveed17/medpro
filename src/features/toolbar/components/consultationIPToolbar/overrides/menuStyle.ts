
import { styled } from '@mui/material/styles';

import Menu from '@mui/material/Menu';

const StyledMenu = styled(Menu)(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 4,
        marginTop: theme.spacing(1),
        maxWidth: 220,
        width: '100%',
        backgroundColor: theme.palette.text.primary,
        color:
            theme.palette.mode === 'light' ? theme.palette.grey[0] : theme.palette.grey[300],

        '& .MuiMenu-list': {
            padding: 0,
        },
        '& .MuiMenuItem-root': {
            fontSize: theme.typography.body2.fontSize,
            '&:not(:last-child)': {
                marginBottom: theme.spacing(0.6),
            },
            '& .react-svg': {
                marginRight: theme.spacing(1.5),
                svg: {
                    width: 14,
                    height: 14,
                    path: {
                        fill: theme.palette.grey[0]
                    },

                },
            },
        },
    },
}));
export default StyledMenu;
