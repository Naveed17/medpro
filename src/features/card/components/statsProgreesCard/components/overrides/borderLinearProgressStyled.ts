import {styled, LinearProgress, linearProgressClasses, LinearProgressProps} from '@mui/material';

interface ProgressProps extends LinearProgressProps {
    bgcolor?: string;
}

const BorderLinearProgressStyled = styled(LinearProgress)<ProgressProps>(({theme, bgcolor}) => ({
    borderRadius: 5,
    height: 6,
    [`&.${linearProgressClasses.colorPrimary}`]: {
        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
        borderRadius: 5,
        backgroundColor: bgcolor

    },
}));

export default BorderLinearProgressStyled
