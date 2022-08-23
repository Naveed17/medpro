import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
const BalanceSheetDialogStyled = styled(Stack)(({ theme }) => ({
    minWidth: 892,
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
    "@media (max-width: 1024px)": {
        minWidth: 0,
    },
}));
export default BalanceSheetDialogStyled;