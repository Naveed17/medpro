import {styled} from "@mui/material/styles";
import {alpha, Card} from "@mui/material";

const ConsultationPopupActionStyled = styled(Card)(({theme}) => ({
    border: 'none',
    borderRadius: theme.spacing(2),
    // backgroundColor: alpha(theme.palette.warning.main, 0.2),
    boxShadow: theme.customShadows.popup,
    '& .MuiCardContent-root': {
        paddingBottom: theme.spacing(1.5),
        '& .ic-tel svg path': {
            fill: theme.palette.text.primary,
        },
        '& .ic-time svg': {
            width: theme.spacing(1.5),
            height: theme.spacing(1.5),
            '& path': {
                fill: theme.palette.text.primary,
            }
        },
        '& .MuiAvatar-root': {
            margin: "auto"
        },
        '& .MuiList-root': {
            '& .MuiListItem-root': {
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
            }
        },
        '& .MuiButton-root': {
            "& .MuiButton-startIcon": {
                '& .react-svg svg': {
                    width: theme.spacing(2),
                    height: theme.spacing(2),
                }
            },
            [theme.breakpoints.down('sm')]: {
                fontSize: 14,
            }
        },
        "& textarea": {
            borderColor: theme.palette.common.white,
            borderRadius: 6,
            padding: 6,
            width: "80%",
            backgroundColor: theme.palette.grey["A10"]
        }
    }
}))
export default ConsultationPopupActionStyled;
