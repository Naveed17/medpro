import {styled} from "@mui/material/styles";
import {MenuItem} from "@mui/material";

const RootStyled = styled(MenuItem)(({theme, styleprops}: any) => {
    return {
        borderBottom: `${!styleprops ? `1px solid ${theme.palette.grey["A300"]}` : 'none'}`,
        ...(styleprops && {
            border: `1px dashed ${theme.palette.primary.light}`,
            borderRadius: 8,
        }),
        backgroundColor:styleprops ? theme.palette.primary.lighter : theme.palette.common.white,
        ...(styleprops ? {padding:theme.spacing(1.5)} :{padding: theme.spacing(1),paddingLeft:theme.spacing(2)}),
        
        "&.MuiMenuItem-root":{minHeight:56},
        '& .MuiAvatar-root': {
            width: 40,
            height: 40,
            padding:theme.spacing(.5),
            boxShadow: "0px 0px 0px 4px rgba(6, 150, 214, 0.25)",

        },
        '&:hover': {
            backgroundColor: styleprops ? theme.palette.primary.lighter : theme.palette.common.white,
        }
    }
});

export default RootStyled;
