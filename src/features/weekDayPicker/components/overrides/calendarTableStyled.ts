import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";

const CalendarTableStyled = styled(Box)(({theme}) => ({
    ".outline": {
        "margin": "0.5rem"
    },
    ".font": {
        "fontSize": "1rem",
        "fontFamily": "Lato, \"Helvetica Neue\", Arial, Helvetica, sans-serif",
        "fontStyle": "normal",
        "fontWeight": "400",
        "textTransform": "capitalize"
    },
    ".btn:not(:disabled)": {
        "cursor": "pointer"
    },
    ".btn": {
        "textAlign": "center",
        "verticalAlign": "middle",
        "userSelect": "none",
        "border": "1px solid transparent",
        "padding": "0.375rem 0.75rem",
        "lineHeight": "1.5",
        "borderRadius": "0.25rem"
    },
    ".primary": {
        "color": "#fff",
        "backgroundColor": "#007bff",
        "borderColor": "#007bff"
    },
    ".primary-box": {
        "borderColor": "#007bff",
        "color": "#007bff"
    },
    ".primary-box tbody>tr:hover": {
        "backgroundColor": "#007bff",
        "color": "#fff"
    },
    ".primary-box span:hover": {
        "backgroundColor": "#007bff",
        "color": "#fff"
    },
    ".green": {
        "color": "#fff",
        "backgroundColor": "#28a745",
        "borderColor": "#28a745"
    },
    ".green-box": {
        "borderColor": "#28a745",
        "color": "#28a745"
    },
    ".red": {
        "color": "#fff",
        "backgroundColor": "#dc3545",
        "borderColor": "#dc3545"
    },
    ".red-box": {
        "borderColor": "#dc3545",
        "color": "#dc3545"
    },
    ".yellow": {
        "color": "#212529",
        "backgroundColor": "#ffc107",
        "borderColor": "#ffc107"
    },
    ".yellow-box": {
        "borderColor": "#ffc107",
        "color": "#ffc107"
    },
    ".info": {
        "color": "#fff",
        "backgroundColor": "#17a2b8",
        "borderColor": "#17a2b8"
    },
    ".info-box": {
        "borderColor": "#17a2b8"
    },
    ".light": {
        "color": "#212529",
        "backgroundColor": "#f8f9fa",
        "borderColor": "#f8f9fa"
    },
    ".light-box": {
        "borderColor": "#f8f9fa"
    },
    ".dark": {
        "color": "#fff",
        "backgroundColor": "#343a40",
        "borderColor": "#343a40"
    },
    ".dark-box": {
        "borderColor": "#343a40"
    },
    ".outline-primary": {
        "color": "#007bff",
        "backgroundColor": "rgb(237,239,245)",
        "backgroundImage": "none",
        "borderColor": "#007bff"
    },
    ".flex": {
        "display": "flex",
        "alignItems": "center"
    },
    ".box": {
        "border": "1px solid",
        "width": "274px",
        "borderRadius": "5px",
        "zIndex": "100",
        "position": "absolute",
        "backgroundColor": "#fff",
        "userSelect": "none"
    },
    ".display": {
        "display": "none"
    },
    ".navbar": {
        "width": "274px",
        "display": "flex",
        "justifyContent": "space-between",
        "borderBottom": "1px solid"
    },
    ".item": {
        "padding": "6px",
        "cursor": "pointer"
    },
    ".arrow": {
        "width": "1em",
        "height": "1em",
        "verticalAlign": "middle",
        "fill": "currentColor",
        "overflow": "hidden"
    },
    ".icon": {
        "width": "1.0634765625em",
        "height": "1em",
        "verticalAlign": "middle",
        "fill": "currentColor",
        "overflow": "hidden",
        "margin": "0 4px"
    },
    ".row": {
        "display": "grid",
        "gridTemplateColumns": "repeat(7, 1fr)",
        "width": "274px",
        "justifyItems": "center",
        "alignItems": "center",
        "cursor": "pointer"
    },
    ".row td": {
        "padding": "8px 5px 8px 5px"
    },
    ".highlighted": {
        "color": "#fff",
        "backgroundColor": "#007bff"
    },
    ".unset-button": {
        "all": "unset"
    },
    ".week-button": {
        "display": "flex",
        "justifyContent": "center",
        "alignItems": "center",
        "padding": "2px",
        "margin": "8px"
    }
}));

export default CalendarTableStyled;
