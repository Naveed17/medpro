import {styled} from "@mui/material/styles";
import {LinearProgress} from "@mui/material";
import {linearProgressClasses} from "@mui/material/LinearProgress";

const BorderLinearProgress = styled(LinearProgress)(({theme}) => ({
    width: '100%',
    height: 8,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.success.main : theme.palette.success.light
    },
}));

export default BorderLinearProgress;
