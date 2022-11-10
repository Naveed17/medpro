import * as React from "react";
//material ui
import { Box, Typography, CardContent, Card } from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
//utils
import Icon from "@themes/urlIcon";
//component style
import TabsStyled from "./overrides/tabsStyle";
export default function SettingsTabs({ ...props }) {
  const { data, getIndex, t } = props;
  const [state, setstate] = React.useState({
    tabIndex: null,
  });
  const theme = useTheme();
  const handleClick = (props: number) => {
    setstate((pre: any) => ({ ...pre, tabIndex: props }));
  };
  React.useEffect(() => {
    getIndex((pre: any) => ({ ...pre, activeTab: state.tabIndex }));
  }, [getIndex, state.tabIndex]);
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        m: -1,
        flexWrap: { lg: "nowrap", xs: "wrap" },
      }}>
      {data?.map((item: any, index: number) => (
        <Box
          sx={{ maxWidth: { lg: 328, xs: "100%" }, width: "100%", p: 1 }}
          key={`tab-${index}`}>
          <TabsStyled
            className={`${state.tabIndex === index ? "active" : ""}`}
            onClick={() => handleClick(index)}
            sx={{
              backgroundColor:
                state.tabIndex === index ? theme.palette.primary.main : "",
              transition: "background-color 0.3s ease-in-out",
            }}>
            <CardContent
              sx={{
                display: "flex",
                pl: item.icon === "ic-hosipital-bed" ? 1 : 0,
              }}>
              <Icon path={item.icon} />
              <Box sx={{ ml: 3 }}>
                <Typography
                  variant="body1"
                  color={
                    state.tabIndex === index ? "common.white" : "common.black"
                  }
                  sx={{
                    fontFamily: "Poppins-SemiBold",
                    mb: 1,
                    mt: "6px",
                  }}>
                  {t(item.label)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ mb: 26, display: "block" }}
                  color={
                    state.tabIndex === index ? "common.white" : "text.secondary"
                  }>
                  {t(item.content)}
                </Typography>
              </Box>
            </CardContent>
          </TabsStyled>
        </Box>
      ))}
    </Box>
  );
}
