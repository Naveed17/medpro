import {styled} from "@mui/material/styles";
import {MenuItem} from "@mui/material";

const RootStyled = styled(MenuItem)(({theme, styleprops}: any) => {
    return {
        borderTop: `${!styleprops ? `1px solid ${theme.palette.grey["A300"]}` : 'none'}`,
        ...(styleprops && {
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 8,
        }),
        backgroundColor: theme.palette.common.white,
        paddingTop: styleprops ? theme.spacing(2.8) : theme.spacing(1.75),
        paddingBottom: styleprops ? theme.spacing(2.8) : theme.spacing(1.75),
        '& .MuiAvatar-root': {
            width: 30,
            height: 30,
        },
        '& .MuiButtonBase-root': {
            backgroundColor: theme.palette.grey["A60"],
            opacity: 0.25,
            color: theme.palette.common.white,
            width: 30,
            height: 30,
            borderRadius: 10,
            '&:hover': {
                backgroundColor: theme.palette.grey["A60"],
            }
        },
        '&:hover': {
            backgroundColor: theme.palette.common.white,
        }
    }
});

export default RootStyled;
