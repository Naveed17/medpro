import { useState, ReactNode, SyntheticEvent, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { RootStyled } from "@features/customStepper";
import { useTranslation } from "next-i18next";
import { TabPanel } from "@features/tabPanel";

function CustomStepper({ ...props }) {
  const {
    stepperData,
    translationKey,
    prefixKey,
    currentIndex,
    minWidth,
    scroll,
  } = props;
  const [value, setValue] = useState<number>(currentIndex);
  const [last, setLast] = useState<number>(1);

  const handleChange = (event: SyntheticEvent, val: number) => {
    setValue(val);
  };

  useEffect(() => {
    setValue(currentIndex);
  }, [currentIndex]);

  const { t, ready } = useTranslation(translationKey, { keyPrefix: prefixKey });
  if (!ready) return <>loading translations...</>;

  return (
    <>
      <RootStyled
        className={scroll ? "scroll" : ""}
        sx={{ minWidth: { md: minWidth ? minWidth : "100%", xs: "100%" } }}
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
                  t={t}
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
export default CustomStepper;
