import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";
import {pxToRem} from "@themes/formatFontSize";

const BoxStyled = styled(Box)(({ theme }) => ({
    paddingTop: pxToRem(10),
    '& .header': {
        borderBottom: `1px solid ${theme.palette.divider}`,
        paddingBottom: pxToRem(18),
        '& .about': {
            paddingLeft: pxToRem(15),
            display: 'flex',
            alignItems: 'center',
            '& img': {
                borderRadius: pxToRem(10),
                marginRight: pxToRem(14),
            }
        },
        '& .contact': {
            paddingLeft: pxToRem(33),
            paddingTop: pxToRem(30),
        }
    }
}));

export default BoxStyled;
