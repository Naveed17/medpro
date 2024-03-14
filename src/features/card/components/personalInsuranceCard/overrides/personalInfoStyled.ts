import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';

const PersonalInfoStyled = styled(Box)(({theme}) => ({
    "& .btn-edit": {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 8,
        padding: theme.spacing(.8),
    },
    "& .MuiSelect-select": {
        padding: "0 2rem 0 1rem"
    },
    "& .MuiInputBase-root": {
        background: "no-repeat!important",
        "&:hover": {
            backgroundColor: "none"
        },
    },
    "& fieldset": {
        border: "none!important",
        boxShadow: "none!important"
    },
    "& .MuiPaper-root": {
        paddingTop: 0
    },
    "& .MuiAppBar-root": {
        border: "none",
        borderBottom: "1px solid #E0E0E0",
        height: 46,
        marginBottom: 2,
        "& .MuiTypography-root": {
            fontSize: 14,
            paddingTop: 0
        }
    },
    "& .MuiToolbar-root": {
        float: "right",
        padding: 0
    },
    "& .icon-button": {
        marginLeft: 0
    }
}));

export default PersonalInfoStyled
