//material-ui
import { Box, List, ListItem, IconButton, Button } from "@mui/material";
// utils
import Icon from "@themes/urlIcon";
import { RootStyled } from "./overrides";
import { useTranslation } from "next-i18next";
function PatientDetailsToolbar({ ...props }) {
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
              <Button
                variant="contained"
                color="primary"
                // sx={{
                //   "&.Mui-disabled": {
                //     bgcolor: (theme) => theme.palette.grey["A500"],
                //     color: (theme) => theme.palette.grey["A0"],
                //   },
                //   "svg path": {
                //     fill: (theme) => theme.palette.grey["A0"],
                //   },
                // }}
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
                sx={{ path: { fill: (theme) => theme.palette.common.black } }}
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
              <IconButton
                onClick={() => props.onClose()}
                color="primary"
                edge="start"
              >
                <Icon path="ic-x" />
              </IconButton>
            </ListItem>
          </List>
        </nav>
      </Box>
    </RootStyled>
  );
}
export default PatientDetailsToolbar;
