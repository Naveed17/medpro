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
    '.MuiFormControl-root': {
        height: '100%',
        justifyContent: 'center',
        '.MuiRadio-root': {
            width: 24,
            height: 24,
            padding: 0,
            '.react-svg': {
                '& > div': {
                    lineHeight: 0,
                    svg: {
                        width: 19,
                        height: 19,
                    }
                }
            }
        },
    },
    "@media (max-width: 1024px)": {
        minWidth: 0,
    },
}));
export default MedicalPrescriptionDialogStyled;