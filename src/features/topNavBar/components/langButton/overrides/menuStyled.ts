import {styled} from "@mui/material/styles";
import {Menu} from "@mui/material";

const MenuStyled = styled(Menu)(({ theme }) => ({
    '& .MuiList-root': {
        width: 100,
        paddingTop: 0,
        paddingBottom: 0,
        boxShadow: '0px 5px 12px rgba(0, 0, 0, 0.06)',
        '& .MuiMenuItem-root': {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            paddingTop: theme.spacing(.75),
            paddingBottom: theme.spacing(.75),
            '& .MuiTypography-root': {
                fontSize: 12,
                color: '#7C878E'
            },
            '& .MuiListItemIcon-root': {
                minWidth: '20px',
            },
            '&:not(:last-of-type)': {
                borderBottom: '1px solid #E3EAEF',
            }
        },
        '& svg': {
            fontSize: 13,
        }
    }
}));

export default MenuStyled;
