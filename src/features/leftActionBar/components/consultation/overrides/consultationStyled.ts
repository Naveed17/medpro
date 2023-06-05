import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";

const ConsultationStyled = styled(Box)(({theme}) => ({
    overflowX: "hidden",
    paddingTop: theme.typography.pxToRem(10),
    marginLeft: theme.typography.pxToRem(-18),
    [theme.breakpoints.down("md")]: {
        marginRight: theme.typography.pxToRem(-10),
        marginLeft: theme.typography.pxToRem(-10),
    },
    '& .header': {
        //paddingBottom: theme.typography.pxToRem(18),
        '& .about': {
            display: 'flex',
            alignItems: 'center',
        },
        '& .contact': {
            paddingTop: theme.typography.pxToRem(30),
        }
    },
    ".list-parent": {
        cursor: "pointer",
        borderTop: `1px solid ${theme.palette.divider}`,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(1.5),
        '& .MuiListItemIcon-root': {
            minWidth: 20,
            svg: {
                width: 14,
                height: 14,
            }
        }
    },
    ".more-details-btn": {
        WebkitTextFillColor: theme.palette.primary.main,
        fontSize: 12
    },
    "& .MuiAvatarGroup-avatar": {
        width: 24,
        height: 24
    },
    "& .MuiAvatarGroup-avatar:not([type])": {
        color: "black",
        fontSize: 12,
        marginLeft: -6
    }
}));

export default ConsultationStyled;
