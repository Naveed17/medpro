import { styled } from "@mui/material/styles";
import { Menu } from "@mui/material";

const MenuStyled = styled(Menu)(({ theme }) => ({
    '& .MuiList-root': {
        width: 100,
        paddingTop: 0,
        paddingBottom: 0,
        boxShadow: theme.shadows[5],
        '& .MuiMenuItem-root': {
            paddingLeft: theme.spacing(1),
            paddingRight: theme.spacing(1),
            paddingTop: theme.spacing(.75),
            paddingBottom: theme.spacing(.75),
            '& .MuiTypography-root': {
                fontSize: 12,
                color: theme.palette.text.secondary,
                marginRight: 6

            },
            '& .MuiListItemIcon-root': {
                minWidth: '20px',
            },
            '&:not(:last-of-type)': {
                borderBottom: `1px solid ${theme.palette.grey['A100']}`,
            }
        },
        '& svg': {
            fontSize: 13,
        }
    }
}));

export default MenuStyled;
