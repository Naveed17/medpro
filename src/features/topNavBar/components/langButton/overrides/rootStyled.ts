import {styled} from "@mui/material/styles";

const RootStyled = styled('div')(({theme}) => ({
    '& .MuiButton-root': {
        minWidth: 80,
        marginLeft: theme.spacing(1.5),
        paddingLeft: theme.spacing(1.5),
        paddingRight: theme.spacing(1.5),
        height: theme.spacing(5),
        // backgroundColor: 'transparent',
        borderColor: 'transparent',
        color: theme.palette.text.primary,
        fontSize: 12,
        '.MuiButton-startIcon .react-svg svg': {
            width: 10,
        },
        '.MuiButton-endIcon>*:nth-of-type(1)': {
            fontSize: 12,
        },
        '& .MuiButton-endIcon': {
            marginLeft: 'auto',
        },
        '&:hover': {
            border: `1px solid ${theme.palette.grey["A100"]}`,
            boxShadow: theme.shadows[4],
            background: theme.palette.info.main,
        }
    }
}));

export default RootStyled;
