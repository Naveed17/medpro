import { styled } from "@mui/material/styles";
import { Card } from "@mui/material";
const DrugListCardStyled = styled(Card)(({ theme }) => ({
    padding: theme.spacing(1),
    border: 'none',
    '&:not(:last-child)': {
        marginBottom: theme.spacing(1),
    },
    backgroundColor: theme.palette.grey['A100'],
    '.MuiList-root': {
        padding: 0,
        '.MuiListItem-root': {
            color: theme.palette.text.secondary,
            fontSize: theme.typography.body2.fontSize,
            '.MuiListItemIcon-root': {
                minWidth: theme.spacing(1),
                svg: {
                    color: theme.palette.text.secondary,
                    width: theme.spacing(0.5),
                },
            },
            padding: theme.spacing(0),
        }
    },
}));
export default DrugListCardStyled;