import { styled } from "@mui/material/styles";
import { Card } from "@mui/material";
const DetailCardStyled = styled(Card)(({ theme }) => ({
    border: `1px solid ${theme.palette.grey["A900"]}`,
    margin: "0.5rem",
    overflow: "visible",
    padding: theme.spacing(1, 1.5),
    '& .consultation-details': {
        '& .date-container': {
            "& .react-svg": {
                marginTop: theme.spacing(-.5),
                marginRight: 4,
                "& svg": {
                    width: "11px",
                    height: "11px",
                    "& path": { fill: theme.palette.text.secondary },
                },
            },
        },
        '& .time-container': {
            "& .react-svg": {
                marginRight: 4,
                "& svg": {
                    width: "11px",
                    height: "11px",
                    "& path": { fill: theme.palette.text.secondary },
                },
            },
        },
        '& .document-container': {
            "& .react-svg": {
                marginLeft: 4,
                "& svg": {
                    width: 14,
                    height: 14,
                    "& path": { fill: theme.palette.primary.main },
                },
            },
        },
    }
}));
export default DetailCardStyled;
