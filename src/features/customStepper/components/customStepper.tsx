import { useState, ReactNode, SyntheticEvent } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { RootStyled } from "@features/customStepper";
interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
interface stateProps {
  step1: object | null;
  step2: object | null;
  step3: object | null;
}

export default function ScrollableTabsButtonAuto({ ...props }) {
  const { stepperData } = props;
  const [value, setValue] = useState<number>(0);
  const [last, setLast] = useState<number>(1);
  const [stepData, setStepData] = useState<stateProps>({
    step1: null,
    step2: null,
    step3: null,
  });
  const handleChange = (event: SyntheticEvent, val: number) => {
    setValue(val);
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
          {stepperData.map(
            (
              v: {
                title: string;
                children: ReactNode;
              },
              i: number
            ) => (
              <Tab
                disabled={i > value && i >= last}
                label={
                  <Box sx={{ textTransform: "initial", fontWeight: 400 }}>
                    <b>{i + 1}.</b> {v.title}
                  </Box>
                }
              />
            )
          )}
        </Tabs>
        {stepperData.map(
          (
            v: {
              title: string;
              children: ReactNode;
            },
            i: number
          ) => {
            const Component: any = v.children;
            return (
              <TabPanel value={value} index={i}>
                <Component
                  onNext={(val: number) => {
                    setValue(val);
                    setLast(last < stepperData.length ? last + 1 : last);
                  }}
                  stepData={(v: any) =>
                    setStepData({ ...stepData, [`step${i + 1}`]: v })
                  }
                  data={stepData[`step${i + 1}`]}
                />
              </TabPanel>
            );
          }
        )}
      </RootStyled>
    </>
  );
}
