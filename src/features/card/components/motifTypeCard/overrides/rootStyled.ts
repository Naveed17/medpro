import { Card } from "@mui/material";
import { styled } from "@mui/material/styles";

const RootStyled = styled(Card)(({ theme }) => ({
    padding: theme.spacing(1, 2),
    borderLeftWidth: 0,
    position: "relative",
    borderRadius: 6,
    marginBottom: theme.spacing(1),
    "&:before": {
        content: '""',
        height: "100%",
        position: "absolute",
        left: 0,
        top: 0,
    },
    "& .card-main": {
        width: "100%",
        '.MuiListItemIcon-root': {
            minWidth: 30,
            svg: {
                width: 20,
                height: 20,
            }
        },
    },
}));

export default RootStyled;
