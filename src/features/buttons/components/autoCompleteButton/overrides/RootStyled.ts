import {styled} from "@mui/material/styles";

const RootStyled = styled('div')(({ theme }) => ({
    '& .btn-add': {
        borderColor: theme.palette.divider,
        paddingTop: theme.spacing(2.25),
        paddingBottom: theme.spacing(2.25),
        '& svg': {
            fontSize: theme.spacing(4),
        }
    },
    '& .autocomplete-container': {
        position: 'relative',
        overflow: 'hidden',
    }
}))

export default RootStyled;
