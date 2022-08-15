import { styled, Theme } from '@mui/material/styles';
const DropZoneStyle = styled('div')(({ theme, styleprops }): { theme: Theme, styleprops: string } => {
    const multi = {
        outline: 'none',
        display: 'flex',
        textAlign: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: theme.spacing(3.2, 1),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        border: `1px dashed ${theme.palette.grey[500]}`,
        '&:hover': { opacity: 0.72, cursor: 'pointer' },
        [theme.breakpoints.up('md')]: { textAlign: 'left', flexDirection: 'row' }
    }
    const single = {
        padding: theme.spacing(2, 1),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.common.white,
        border: `2px solid #BDBDBD`,
        '& svg path': { fill: '#BDBDBD' },
        '&:hover': { opacity: 0.72, cursor: 'pointer' },
    }
    return Boolean(styleprops) ? single : multi;
});
export default DropZoneStyle;