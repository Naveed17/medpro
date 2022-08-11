import { useState, ReactNode, SyntheticEvent, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { RootStyled } from "@features/customStepper";
import { useTranslation } from "next-i18next";
import { TabPanel } from "@features/tabPanel";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function CustomStepper({ ...props }) {
  const { stepperData, currentIndex, minWidth, scroll, t } = props;
  const [value, setValue] = useState<number>(currentIndex);
  const [last, setLast] = useState<number>(1);

  const handleChange = (event: SyntheticEvent, val: number) => {
    setValue(val);
  };

  useEffect(() => {
    setValue(currentIndex);
  }, [currentIndex]);

  return (
    <>
      <RootStyled
        className={scroll ? "scroll" : ""}
        sx={{
          minWidth: { md: minWidth ? minWidth : "100%", xs: "100%" },
          "& div[role='tabpanel'] > div": {
            p: 0,
            "& .inner-section": {
              height: "calc(100vh - 110px)",
              overflow: "auto",
              p: 3,
            },
            "& .action": {
              px: 2,
              mt: 1,
            },
          },
        }}
      >
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
                  <Box
                    sx={{
                      textTransform: "initial",
                      fontWeight: 400,
                      fontSize: { md: 14, xs: 10 },
                    }}
                  >
                    <b>{i + 1}.</b> {t(`${v.title}`)}
                  </Box>
                }
                {...a11yProps(i)}
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
                  {...props}
                />
              </TabPanel>
            );
          }
        )}
      </RootStyled>
    </>
  );
}

export default CustomStepper;
