//material-ui
import { Box, List, ListItem, IconButton, Button } from "@mui/material";
// utils
import Icon from "@themes/urlIcon";
import { RootStyled } from "./overrides";
import { useTranslation } from "next-i18next";
export default function PatientDetailsToolbar() {
  const { t, ready } = useTranslation("patient", {
    keyPrefix: "patient-details",
  });
  if (!ready) return <>loading translations...</>;
  return (
    <RootStyled sx={{ minWidth: { md: 726, xs: "100%" } }}>
      <Box className="header">
        <nav>
          <List sx={{ display: "flex" }}>
            <ListItem disablePadding sx={{ marginRight: "20px" }}>
              {/* <IconButton color="primary" edge="start">
                <Icon path={"ic-refrech"} className="refresh" />
              </IconButton> */}
              <Button
                variant="contained"
                color="primary"
                sx={{
                  "&.Mui-disabled": {
                    bgcolor: (theme) => theme.palette.info.main,
                    color: (theme) => theme.palette.text.disabled,
                    svg: {
                      path: { fill: (theme) => theme.palette.text.disabled },
                    },
                  },
                }}
                disabled
                startIcon={<Icon path="ic-edit" />}
              >
                {t("edit")}
              </Button>
            </ListItem>
            <ListItem disablePadding sx={{ marginRight: "20px" }}>
              <IconButton
                color="primary"
                edge="start"
                sx={{ path: { fill: "#000000" } }}
              >
                <Icon path={"ic-refrech"} />
              </IconButton>
            </ListItem>
            <ListItem disablePadding sx={{ marginRight: "20px" }}>
              <IconButton color="primary" edge="start">
                <Icon path={"ic-autre2"} />
              </IconButton>
            </ListItem>
            <ListItem disablePadding>
              <IconButton color="primary" edge="start">
                <Icon path="ic-x" />
              </IconButton>
            </ListItem>
          </List>
        </nav>
      </Box>
    </RootStyled>
  );
}
