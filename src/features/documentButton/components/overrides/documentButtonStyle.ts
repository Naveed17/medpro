import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
const DocumentButtonStyled = styled(Button)(({ theme }) => ({
    color: "unset",
    flexDirection: "column",
    border: `1px solid ${theme.palette.grey[300]}`,
    maxWidth: "120px",
    width: "100%",
    minHeight: "77px",
    [theme.breakpoints.down("md")]: {
        maxWidth: "50%",
    },
    "& .BaseBadge-root": {
        position: "static",
        "& .MuiBadge-badge": {
            top: 15,
            right: 15,
        },
    },
    "& p": {
        marginTop: 10,
    },
    "&:hover": {
        backgroundColor: theme.palette.info.lighter,
        border: `1px solid #E3EAEF`,
        boxShadow: theme.customShadows.documentButton,
    },
    "&:active, &:focus": {
        backgroundColor: theme.palette.primary.main,
        border: `1px solid transparent`,
        color: theme.palette.grey[0],
        '& .react-svg': {
            svg: {
                path: {
                    fill: theme.palette.grey[0]
                }
            }
        }
    },
}));
export default DocumentButtonStyled;