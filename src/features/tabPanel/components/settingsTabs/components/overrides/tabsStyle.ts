import { useTheme, styled } from "@mui/material/styles";
import Card from '@mui/material/Card'
const TabsStyled = styled(Card)(({ theme }) => ({
    cursor: "pointer",
    borderRadius: 10,
    height: 139,
    paddingLeft: 13,
    paddingRight: 8,
    marginBottom: 20,
    svg: {
      width: 37,
      height: 37,
    },
    "&.active": {
      svg: {
        path: {
          fill: theme.palette.common.white,
        },
      },
    },
  }));
  export default TabsStyled