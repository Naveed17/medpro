import {Card} from "@mui/material";
import {styled} from "@mui/material/styles";

const RootStyled = styled(Card)(({theme}) => ({
    padding: theme.spacing(1, 2),
    borderRadius: 8,
    border: "none",
    marginBottom: theme.spacing(1.4),
    "&:before": {
        content: '""',
        height: "82px",
        position: "absolute",
        left: "1rem",
        borderTopLeftRadius : 4,
        borderBottomLeftRadius : 4,
        width: 4
    },
    "& .card-main": {
        width: "100%",
        "& .title": {
            display: "flex",
            alignItems: "center",
            svg: {
                width: 10,
                height: 10,
                marginRight: 8,
                path: {
                    fill: theme.palette.error.main,
                },
            },
        },
        "& .time-badge-main": {
            display: "flex",
            marginTop: theme.spacing(1),
            alignItems: "center",
            "& .MuiTypography-root": {
                display: "flex",
                alignItems: "center",
                svg: {
                    fontSize: 20,
                    marginRight: 5,
                    path: {
                        fill: theme.palette.text.secondary,
                    },
                },
            },
            "& .label": {
                marginLeft: 10,
                padding: theme.spacing(0, 1.5),
            },
        },
    },
    "& .action": {
        width: 31,
        display: "flex",
        alignItems: "center",
    },
}));

export default RootStyled;
