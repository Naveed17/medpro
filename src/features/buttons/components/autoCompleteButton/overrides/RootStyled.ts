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
        backgroundColor: theme.palette.common.white,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: 8,
        padding: 10,
        position: 'relative',
        paddingBottom: 48,
        overflowY: 'hidden',
    }
}))

export default RootStyled;
