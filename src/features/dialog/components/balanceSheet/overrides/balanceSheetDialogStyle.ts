import {Stack} from "@mui/material";
import {styled} from "@mui/material/styles";

const BalanceSheetDialogStyled = styled(Stack)(({theme}) => ({
    '.btn-add': {
        alignSelf: 'flex-start',
    },
    '.MuiCard-root': {
        backgroundColor: theme.palette.grey['A100'],
        '&:not(:last-child)': {
            marginBottom: theme.spacing(1),
        },
    },
    ".items-list": {
        background: "#EEF2F6",
        borderRadius: 4,
        maxHeight: 200,
        backgroundColor: '#e3eaef',
        overflowY: 'scroll',
        ".MuiListItemButton-root": {
            paddingTop: theme.spacing(.5),
            paddingBottom: theme.spacing(.5)
        }
    },
    ".items-list::-webkit-scrollbar": {
        display: 'none'
    },
    '.loading-card': {
        border: 'none',
        background: "#EEF2F6",
        p: {
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(2),
            color: '#666D81'
        }
    },
    ".list-container": {
        maxHeight: 360,
        paddingTop: 8,
        paddingBottom: 8,
        overflowY: 'scroll'
    },
    "& .MuiOutlinedInput-root": {
        padding: "0.2rem 0.5rem"
    },
    "& .no-data-card .MuiTypography-body2": {
        paddingTop: 0
    },
    "& .chip-item": {
        backgroundColor: theme.palette.grey["A11"],
        filter: "drop-shadow(10px 10px 10px rgba(0, 0, 0, 0))",
        marginBottom: 6,
        marginLeft: 6,
        cursor: "move",
        "&:active": {
            boxShadow: "none",
            outline: "none",
        },
        "& .MuiChip-deleteIcon": {
            color: theme.palette.text.primary,
        },
    }
}));
export default BalanceSheetDialogStyled;
