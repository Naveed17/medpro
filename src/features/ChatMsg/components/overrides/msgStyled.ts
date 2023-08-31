import {styled} from "@mui/material/styles";
import {Grid} from "@mui/material";

const radius = 10;

const MsgStyled = styled(Grid)(({theme}) => ({
    marginTop: 0,
    "& .leftRow": {
        textAlign: 'left',
    },
    "& .rightRow": {
        textAlign: 'right',
    },
    "& .msg": {
        padding: 5,
        borderRadius: 4,
        marginBottom: 4,
        display: 'inline-block',
        wordBreak: 'break-word',
        fontFamily:
        // eslint-disable-next-line max-len
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        fontSize: '14px',
    },
    "& .left": {
        borderTopRightRadius: radius,
        borderBottomRightRadius: radius,
        backgroundColor: theme.palette.common.white,
    },
    "& .right": {
        borderTopLeftRadius: radius,
        borderBottomLeftRadius: radius,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        marginLeft: 90
    },
    "& .leftFirst": {
        borderTopLeftRadius: radius,
    },
    "& .leftLast": {
        borderBottomLeftRadius: radius,
    },
    "& .rightFirst": {
        borderTopRightRadius: radius,
    },
    "& .rightLast": {
        borderBottomRightRadius: radius,
    }
}));

export default MsgStyled;
