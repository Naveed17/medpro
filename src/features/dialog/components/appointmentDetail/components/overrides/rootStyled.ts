import { styled } from '@mui/material/styles';
import { Paper } from "@mui/material";

const RootStyled = styled(Paper)(({ theme }) => ({
    height: '100%',
    backgroundColor: theme.palette.background.default,
    boxShadow: '-5px 14px 26px rgba(0, 150, 214, 0.37)',
    border: 'none',
    borderRadius: '0px',
    '& .MuiAppBar-root': {
        border: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
        minHeight: '47px',
        '& .MuiToolbar-root': {
            minHeight: '47px',
            justifyContent: 'flex-end',
            '& .MuiIconButton-root': {
                '& .MuiSvgIcon-root': {
                    color: theme.palette.text.primary,
                    fontSize: 16,

                }
            }
        }
    },
    '& .MuiCard-root': {
        border: 'none',
        '& .MuiCardContent-root': {
            padding: theme.spacing(1),
        }
    },
    "& .MuiInputBase-root": {
        alignItems: "flex-start",
        "& fieldset": { border: 0 },
        "&:hover": {
            fieldset: {
                border: "none",
                boxShadow: "none",
            },
        },
        "&.Mui-focused": {
            fieldset: {
                border: "none",
                boxShadow: "none",
                outline: "none",
            },
        },
        '& .MuiInputAdornment-root': {
            marginRight: theme.spacing(-1.5),
        }
    },

}))

export default RootStyled;
