import {styled} from '@mui/material/styles';

const DropZoneStyle = styled('div')(({theme, property}): any => {
    const multi = {
        outline: 'none',
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: theme.spacing(3.2, 1),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.grey['A700'],
        border: `1px dashed ${theme.palette.grey['A600']}`,
        '&:hover': {opacity: 0.72, cursor: 'pointer'},
        [theme.breakpoints.up('md')]: {textAlign: 'left', flexDirection: 'row'}
    }
    const single = {
        padding: theme.spacing(2, 1),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.common.white,
        border: `2px solid ${theme.palette.grey['A600']}`,
        '& svg path': {fill: theme.palette.grey['A600']},
        '&:hover': {opacity: 0.72, cursor: 'pointer'},
    }
    return Boolean(property) ? multi : single;
});
export default DropZoneStyle;