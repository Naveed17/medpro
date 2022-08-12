import {styled} from "@mui/material/styles";
import {MenuItem} from "@mui/material";

const RootStyled = styled(MenuItem)(({theme, styleProps}: any) => {
    console.log(styleProps);
    return {
        borderTop: `${!styleProps ? '1px solid #E0E0E0' : 'none'}`,
        ...(styleProps && {
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 8,
        }),
        backgroundColor: theme.palette.common.white,
        paddingTop: styleProps ? theme.spacing(2.8) : theme.spacing(1.75),
        paddingBottom: styleProps ? theme.spacing(2.8) : theme.spacing(1.75),
        '& .MuiAvatar-root': {
            width: 30,
            height: 30,
        },
        '& .MuiButtonBase-root': {
            backgroundColor: '#7E7E7E',
            opacity: 0.25,
            color: theme.palette.common.white,
            width: 30,
            height: 30,
            borderRadius: 10,
            '&:hover': {
                backgroundColor: '#7E7E7E',
            }
        },
        '&:hover': {
            backgroundColor: theme.palette.common.white,
        }
    }
});

export default RootStyled;
