import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
const BalanceSheetDialogStyled = styled(Stack)(({ theme }) => ({
    maxWidth: 892,
    width: "100%",
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
        background: "EEF2F6",
        borderRadius: 4,
        maxHeight: 200,
        overflowY: 'scroll',
        ".MuiListItemButton-root": {
            paddingTop: theme.spacing(.5),
            paddingBottom: theme.spacing(.5)
        }
    },
    '.loading-card': {
        border: 'none',
        background: "EEF2F6",
        p: {
            paddingTop: theme.spacing(4),
            paddingBottom: theme.spacing(2),
            color: 'EEF2F6'
        }
    },
    ".list-container": {
        maxHeight: 300,
        paddingTop: 8,
        paddingBottom: 8,
        overflowY: 'scroll'
    },


}));
export default BalanceSheetDialogStyled;