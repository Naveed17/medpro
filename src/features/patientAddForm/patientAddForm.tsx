import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import AddPatientStep1 from "./addPatientStep1";
import AddPatientStep2 from "./addPatientStep2";
import AddPatientStep3 from "./addPatientStep3";
const RootStyled = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  minWidth: 648,
  "& .MuiTabs-root": {
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(0, 0.5),
    "& .MuiTabs-flexContainer": {
      justifyContent: "space-around",
    },

    "& button": {
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(0.5, 1),
        minWidth: "auto",
        fontSize: theme.typography.body2.fontSize,
      },
      "&.Mui-disabled": {
        color: theme.palette.grey[200],
      },
    },
  },
}));
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function ScrollableTabsButtonAuto() {
  const [value, setValue] = React.useState(0);
  const [step, setstep] = React.useState({
    step1: null,
    step2: null,
  });
  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <RootStyled>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons={false}
          aria-label="scrollable auto tabs"
        >
          <Tab
            label={
              <Box sx={{ textTransform: "initial", fontWeight: 400 }}>
                <b>1.</b> Info personnelle
              </Box>
            }
          />
          <Tab
            disabled={step.step1 === null}
            label={
              <Box sx={{ textTransform: "initial", fontWeight: 400 }}>
                <b>2.</b> Info supplémentaires
              </Box>
            }
          />
          <Tab
            disabled={step.step2 === null}
            label={
              <Box sx={{ textTransform: "initial", fontWeight: 400 }}>
                <b>3.</b> Fin
              </Box>
            }
          />
        </Tabs>
        <TabPanel sx={{ height: `calc(100% - 50px)` }} value={value} index={0}>
          <AddPatientStep1
            onNext={handleChange}
            stepData={(v) => setstep({ ...step, step1: v })}
            data={step.step1}
          />
        </TabPanel>
        <TabPanel sx={{ height: `calc(100% - 50px)` }} value={value} index={1}>
          <AddPatientStep2
            onNext={handleChange}
            stepData={(v) => setstep({ ...step, step1: v })}
            data={step.step1}
          />
        </TabPanel>
        <TabPanel sx={{ height: `calc(100% - 50px)` }} value={value} index={2}>
          <AddPatientStep3
            onNext={handleChange}
            stepData={(v) => setstep({ ...step, step1: v })}
            data={step.step1}
          />
        </TabPanel>
      </RootStyled>
    </>
  );
}
