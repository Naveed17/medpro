import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const ConsultationStyled = styled(Box)(({ theme }) => ({
    paddingTop: theme.typography.pxToRem(10),
    marginLeft: theme.typography.pxToRem(-10),
    [theme.breakpoints.down("md")]: {
        marginRight: theme.typography.pxToRem(-16),
    },
    '& .header': {
        paddingBottom: theme.typography.pxToRem(18),
        '& .about': {
            display: 'flex',
            alignItems: 'center',
        },
        '& .contact': {
            paddingTop: theme.typography.pxToRem(30),
        }
    }
}));

export default ConsultationStyled;
