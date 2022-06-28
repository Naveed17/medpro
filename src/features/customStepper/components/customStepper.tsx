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
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function ScrollableTabsButtonAuto({ ...props }) {
  const { stepperData } = props;
  const [value, setValue] = useState<number>(0);
  const [last, setLast] = useState<number>(1);
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
                key={Math.random()}
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
              <TabPanel key={Math.random()} value={value} index={i}>
                <Component
                  onNext={(val: number) => {
                    setValue(val);
                    setLast(last < stepperData.length ? last + 1 : last);
                  }}
                />
              </TabPanel>
            );
          }
        )}
      </RootStyled>
    </>
  );
}
