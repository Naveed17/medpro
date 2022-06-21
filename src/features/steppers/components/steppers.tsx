import {Box, Tabs, Tab, Fab} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {TabPanel} from "@features/tabPanel";
import {StepperInfo} from "@features/steppers";


function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Steppers({index}: {index: number}) {

  return (
      <Box sx={{ width: "100%", py: 3 }}>
        <Box sx={{ maxWidth: { xs: 555, sm: "100%" } }}>
          <Tabs
              value={index}
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
                  borderBottom: "2px solid #7C878E",
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
            <Tab
                label={
                  <>
                    <b>1.</b> Informations personnelles
                  </>
                }
                {...a11yProps(0)}
            />
            <Tab
                disabled={index < 1}
                label={
                  <>
                    <b>2.</b> Joindre document
                  </>
                }
                {...a11yProps(1)}
            />
            <Tab
                disabled={index < 2}
                label={
                  <>
                    <b>3.</b> Actes
                  </>
                }
                {...a11yProps(2)}
            />
            <Tab
                disabled={index < 3}
                label={
                  <>
                    <b>4.</b> Cabinet
                  </>
                }
                {...a11yProps(3)}
            />
          </Tabs>
        </Box>
        <Box sx={{ "& div[role] > div": { px: 0 } }}>
          <TabPanel value={index} index={0}>
             <StepperInfo />
            <Fab
                sx={{
                  bgcolor: "common.white",
                  boxShadow: "0px 2px 20px rgba(156, 155, 155, 0.46);",
                  position: "fixed",
                  bottom: "1rem",
                  right: "1rem",
                }}
            >
              <IconUrl path="question-mark" />
            </Fab>
          </TabPanel>
          <TabPanel value={index} index={1}>
            {/*<Step2 />*/}
          </TabPanel>
          <TabPanel value={index} index={2}>
            {/*<Step3 />*/}
            <Fab
                sx={{
                  bgcolor: "common.white",
                  boxShadow: "0px 2px 20px rgba(156, 155, 155, 0.46);",
                  position: "fixed",
                  bottom: "1rem",
                  right: "1rem",
                }}
            >
              <IconUrl path="question-mark" />
            </Fab>
          </TabPanel>
          <TabPanel value={index} index={3}>
            {/*<Step4 />*/}
            <Fab
                sx={{
                  bgcolor: "common.white",
                  boxShadow: "0px 2px 20px rgba(156, 155, 155, 0.46);",
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
