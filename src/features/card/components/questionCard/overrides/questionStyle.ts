import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';
const QuestionCardStyled = styled(Card)(({ theme }) => ({
    border: `1px solid ${theme.palette.grey[100]}`,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(5),
    boxShadow: "none",
    "& .MuiCardHeader-root": {
        borderBottom: `1px solid ${theme.palette.divider}`,
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        "& span": { color: theme.palette.secondary.main },
    },
    "& .MuiCardContent-root": {
        background: theme.palette.grey["A800"],
        border: `${0.25}px solid ${theme.palette.divider}`,
        borderTop: 0,
        borderRadius: " 0px 0px 10px 10px",
        '& .nav': {
            padding: 0,
            marginTop: theme.spacing(3),
            display: "flex",
            '& .MuiListItem-root': {
                maxWidth: 277,
                padding: 0
            }
        },
        '& .list': {
            padding: 0,
            marginTop: theme.spacing(3),
            "& .MuiListItem-root": {
                padding: 0,
                flexDirection: "column",
                alignItems: "flex-start",
                '&:not(:first-of-type)': {
                    marginTop: theme.spacing(3)
                }
            },

        }
    }
}));
export default QuestionCardStyled;