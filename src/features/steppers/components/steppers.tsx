import { Box, Tabs, Tab, Fab } from "@mui/material";
import IconUrl from "@themes/urlIcon";
import { TabPanel } from "@features/tabPanel";
import { useTranslation } from "next-i18next";
import React from "react";
import { Document, Info } from "@features/steppers";
import { Actes } from "@features/steppers";
import { Cabinet } from "@features/steppers/components/cabinet";
import { Theme } from "@mui/material/styles";
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

type stepper = {
  currentStepper: number
}

function Steppers({ currentStepper }: stepper) {
  const { t, ready } = useTranslation('editProfile', { keyPrefix: "steppers" });
  if (!ready) return (<>loading translations...</>);

  return (
    <Box sx={{ width: "100%", py: 3 }}>
      <Box sx={{ maxWidth: { xs: 555, sm: "100%" } }}>
        <Tabs
          value={currentStepper}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="scrollable auto tabs example"
          sx={{
            minHeight: 30,
            button: {
              px: 0,
              flexDirection: "inherit",
              minWidth: "auto",
              mr: 3,
              minHeight: 27,
              py: 0,
              borderRadius: 0,
              borderBottom: `2px solid ${(theme: Theme) => theme.palette.grey["A400"]}`,
              b: {
                mr: 1,
              },
              "&.Mui-selected": {
                color: "primary.main",
              },
              "&.Mui-disabled": {
                opacity: 0.3,
                color: "text.primary",
              },
            },
            "& .MuiTabs-indicator": {
              bottom: "3px ",
            },
          }}
        >
          {[1, 2, 3, 4].map((item, index) => (
            <Tab
              key={`simple-tab-${index}`}
              {...(index > currentStepper && { disabled: true })}
              label={
                <>
                  <b>{++index}.</b> {t(`tabs.tab-${index}`)}
                </>
              }
              {...a11yProps(index)}
            />)
          )}
        </Tabs>
      </Box>
      <Box sx={{ "& div[role] > div": { px: 0 } }}>
        <TabPanel value={currentStepper} index={0}>
          <Info />
          <Fab
            sx={{
              bgcolor: "common.white",
              boxShadow: theme => theme.customShadows.fab1,
              position: "fixed",
              bottom: "1rem",
              right: "1rem",
            }}
          >
            <IconUrl path="question-mark" />
          </Fab>
        </TabPanel>
        <TabPanel value={currentStepper} index={1}>
          <Document />
        </TabPanel>
        <TabPanel value={currentStepper} index={2}>
          <Actes />
          <Fab
            sx={{
              bgcolor: "common.white",
              boxShadow: theme => theme.customShadows.fab1,
              position: "fixed",
              bottom: "1rem",
              right: "1rem",
            }}
          >
            <IconUrl path="question-mark" />
          </Fab>
        </TabPanel>
        <TabPanel value={currentStepper} index={3}>
          <Cabinet />
          <Fab
            sx={{
              bgcolor: "common.white",
              boxShadow: theme => theme.customShadows.fab1,
              position: "fixed",
              bottom: "1rem",
              right: "1rem",
            }}
          >
            <IconUrl path="question-mark" />
          </Fab>
        </TabPanel>
      </Box>
    </Box>
  );
}

export default Steppers;
