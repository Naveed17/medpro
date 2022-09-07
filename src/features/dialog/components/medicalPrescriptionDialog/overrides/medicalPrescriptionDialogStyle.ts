import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
const MedicalPrescriptionDialogStyled = styled(Stack)(({ theme }) => ({
    minWidth: 892,
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
    "@media (max-width: 1024px)": {
        minWidth: 0,
    },
}));
export default MedicalPrescriptionDialogStyled;