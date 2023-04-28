import {Stack} from "@mui/material";
import {styled} from "@mui/material/styles";

const MedicalPrescriptionModelDialogStyled = styled(Stack)(({theme}) => ({
    "& .Mui-checked": {
        svg: {
            path: {
                fill: theme.palette.primary.main
            }
        },
    },
    "& .MuiListItem-root": {
        paddingTop: 0,
        paddingBottom: 0
    },
    "& .ic-add": {
        marginRight: theme.spacing(0.5),
        svg: {
            width: 16,
            height: 16,
            path: {
                fill: theme.palette.primary.main,
            },
        },
    },
}));
export default MedicalPrescriptionModelDialogStyled;
