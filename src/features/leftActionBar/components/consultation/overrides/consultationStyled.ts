import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const ConsultationStyled = styled(Box)(({ theme }) => ({
    paddingTop: theme.typography.pxToRem(10),
    '& .header': {
        paddingBottom: theme.typography.pxToRem(18),
        '& .about': {
            display: 'flex',
            alignItems: 'center',
            '& img': {
                borderRadius: theme.typography.pxToRem(10),
                marginRight: theme.typography.pxToRem(14),
            }
        },
        '& .contact': {

            paddingTop: theme.typography.pxToRem(30),
        }
    }
}));

export default ConsultationStyled;
