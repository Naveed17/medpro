import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
const BalanceSheetDialogStyled = styled(Stack)(({ theme }) => ({
    width: "100%",
    '.btn-add': {
        alignSelf: 'flex-start',
    },
    '.MuiGrid-item': {
        position: 'relative',
        '.MuiDivider-root': {
            right: -20,
            position: "absolute",
            height: "calc(100% + 20px)",
            top: 0
        }
    },
    '.MuiCard-root': {
        backgroundColor: theme.palette.grey['A100'],
        '&:not(:last-child)': {
            marginBottom: theme.spacing(1),
        },
    },
}));
export default BalanceSheetDialogStyled;