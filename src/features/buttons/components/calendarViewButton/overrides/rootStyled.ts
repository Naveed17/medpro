import { styled } from '@mui/material/styles';

const RootStyled = styled('div')(({ theme }) => ({
    marginLeft: "auto",
    '& .MuiButton-root': {
        height: "36px",
        paddingLeft: theme.spacing(1.5),
        paddingRight: theme.spacing(1.5),
        backgroundColor: '#F9F9FB',
        borderColor: theme.palette.divider,
        color: theme.palette.text.primary,
        minWidth: 100,
        fontSize: 12,
        '.MuiButton-endIcon>*:nth-of-type(1)': {
            fontSize: 12,
        },
        '& .MuiButton-endIcon': {
            marginLeft: 'auto',
        },
        '&:hover': {
            boxShadow: theme.customShadows.callanderButton,
        }
    }
}));

export default RootStyled;
