import {styled} from "@mui/material/styles";
import {Card} from "@mui/material";

const CardStyled = styled(Card)(({ theme }) => ({
    "& .btn-edit": {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 8,
        padding: theme.spacing(.8),
    },
    '& .MuiList-root': {
        padding: 0,
        '& .MuiListItem-root': {
            padding: theme.spacing(0),

            paddingBottom: theme.spacing(2),
            '&:not(:first-of-type)': {
                paddingTop: theme.spacing(2),
                borderTop: `1px solid ${theme.palette.divider}`,
                color: theme.palette
            },
            '&:last-of-type': {
                borderTop: 'none'
            },
            '& .left-icon': {
                marginTop: theme.spacing(0.5),
            },
            '& .MuiButton-outlined': {
                fontSize: theme.typography.pxToRem(13),
                padding: theme.spacing(0.7, 2),
            }
        }
    }
}));

export default CardStyled;
