import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';

const PersonalInfoStyled = styled(Box)(({theme}) => ({
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
    "& .grid-border": {
        border: `1px solid ${theme.palette.grey['A100']}`,
        borderRadius: 4,
        "& .MuiInputBase-root": {
            paddingLeft: 12
        }
    },
    "& .datepicker-grid-border": {
        "& .MuiInputBase-root": {
            minHeight: 31
        }
    },
    "& .datepicker-style": {
        "& .MuiInputBase-input": {
            paddingLeft: 0
        }
    },
    "& input": {
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
    },
    "& .MuiOutlinedInput-root button": {
        padding: "5px",
        minHeight: "auto",
        height: "auto",
        minWidth: "auto",
        right: "-0.5rem"
    }
}));

export default PersonalInfoStyled
