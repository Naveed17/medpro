import { useTheme, styled } from "@mui/material/styles";
import Card from '@mui/material/Card'
const TabsStyled = styled(Card)(({ theme }) => ({
  cursor: "pointer",
  borderRadius: 10,
  height: 139,
  paddingLeft: 13,
  paddingRight: 8,
  marginBottom: 20,
  transition: "background-color 0.3s ease-in-out",
  [theme.breakpoints.down("md")]: {
      height: 'auto',
      marginBottom: 0,
  },

  svg: {
      width: 37,
      height: 37,
      path: {
          fill: theme.palette.primary.main,
      },
      rect: {
          fill: theme.palette.primary.main,
      }
  },
  "&.active": {
      svg: {
          path: {
              fill: theme.palette.common.white,
          },
          rect: {
              fill: theme.palette.common.white,
          }
      },
  },
  '& .heading': {
      fontFamily: "Poppins",
      marginBottom: theme.spacing(1),
      marginTop: '6px',
      [theme.breakpoints.down("md")]: {
          fontWeight: 700,
      },

  },
  '& .MuiTypography-caption': {
      [theme.breakpoints.down('md')]: {
          display: 'none'
      }
  },
  '& .MuiCardContent-root': {
      [theme.breakpoints.down("md")]: {
          alignItems: 'center',
      },
  }
  }));
  export default TabsStyled