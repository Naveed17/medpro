import {styled} from '@mui/material/styles';

const CustomDragPreviewStyled = styled('div')(({theme, property}): any => ({
    alignItems: "center",
    backgroundColor: "#1967d2",
    borderRadius: "4px",
    boxShadow: "0 12px 24px -6px rgba(0, 0, 0, .25), 0 0 0 1px rgba(0, 0, 0, .08)",
    color: "#fff",
    display: "inline-grid",
    fontSize: "14px",
    gap: "8px",
    "grid-template-columns": "auto auto",
    padding: "4px 8px",
    pointerEvents: "none",
    ".icon, .label": {
        alignItems: "center",
        display: "flex"
    }
}));

export default CustomDragPreviewStyled;
