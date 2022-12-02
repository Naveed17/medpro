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
        maxHeight: 300,
        paddingTop: 8,
        paddingBottom: 8,
        overflowY: 'scroll'
    },
    "& .MuiOutlinedInput-root": {
        padding: "0.2rem 0.5rem"
    }


}));
export default BalanceSheetDialogStyled;
