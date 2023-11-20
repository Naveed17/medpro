import {Card, styled } from '@mui/material';
const CardStyled = styled(Card)(({ theme }) => ({
    '.btn-cash':{
        backgroundColor: theme.palette.primary.main,
        borderRadius: 6,
        width:40,
        height:40,
        "&:hover":{
            backgroundColor: theme.palette.primary.dark
        }
    },
    ".rdv-date-row":{
        "&.rdv-date-row":{
            marginTop: theme.spacing(-1.5)
        }
    },
    ".labels-group":{
        [theme.breakpoints.down("sm")]:{
         display: "grid",
         gridTemplateColumns:'repeat(2,minmax(0,1fr))',
        },
    '.rest-pay-label':{
        [theme.breakpoints.down("sm")]:{

         gridColumn: "span 2/span 2"
        }
    }
    }
}));

export default CardStyled;