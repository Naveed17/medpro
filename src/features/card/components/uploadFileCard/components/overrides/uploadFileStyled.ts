import { styled } from '@mui/material/styles';
const UploadFileStyled = styled('div')(({ theme }) => ({
    outline: 'none',
    display: 'flex',
    textAlign: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.grey["A100"],
    border: `1px dashed ${theme.palette.primary.main}`,
    '&:hover': { opacity: 0.72, cursor: 'pointer' },
    [theme.breakpoints.up('md')]: { textAlign: 'left', flexDirection: 'row' }

}));
export default UploadFileStyled;
