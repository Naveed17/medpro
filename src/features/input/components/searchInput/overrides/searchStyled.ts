import {alpha, styled} from "@mui/material/styles";

const SearchStyled = styled('div')(({theme}) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.white,
    /*'&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },*/
    margin: theme.spacing(2),
    //marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        // marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));
export default SearchStyled;
