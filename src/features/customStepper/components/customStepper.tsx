import React, {useState, ReactNode, SyntheticEvent, useCallback, useEffect} from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {RootStyled} from "@features/customStepper";
import {useIsMountedRef} from "@app/hooks";
import _ from "lodash";
import {TabPanel} from "@features/tabPanel";

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

function CustomStepper({...props}) {
    const {
        stepperData,
        currentIndex = 0,
        minWidth,
        scroll,
        t,
        OnTabsChange = null,
        OnCustomAction = null,
        OnSubmitStepper = null,
        onBackButton = null,
    } = props;
    const [value, setValue] = useState<number>(currentIndex);
    const [last, setLast] = useState<number>(1);
    const [submited, setSubmited] = useState(false);
    const [steppers, setSteppers] = useState();

    useEffect(() => {
        console.log(last, submited)
        if (last !== value) {
            const listItems = stepperData.map((v: { key: string; title: string; children: ReactNode; }, i: number) => {
                const Component: any = v.children;
                return (
                    <TabPanel key={i.toString()} value={Number(value)} index={i}>
                        <Component
                            OnAction={OnCustomAction}
                            onNext={(index: number) => submitStepper(index)}
                            onBack={() => {
                                if (value > 0) {
                                    setValue(value - 1);
                                }
                                if (onBackButton) {
                                    onBackButton(value);
                                }
                            }}
                            {...props}
                        />
                    </TabPanel>
                );
            });
            setSteppers(listItems);
        }
    }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

    const tabChange = useCallback(
        (event: SyntheticEvent, currentIndex: number) => {
            setValue(currentIndex);
            if (OnTabsChange) {
                OnTabsChange(currentIndex);
            }
        },
        [OnTabsChange]
    );

    const submitStepper = useCallback(
        (currentIndex: number) => {
            if (currentIndex < stepperData.length) {
                setValue(currentIndex);
                setLast(last < stepperData.length ? last + 1 : last);
            }
            if (OnSubmitStepper) {
                OnSubmitStepper(currentIndex);
            }
        },
        [OnSubmitStepper, last, stepperData.length]
    );

    return (
        <>
            <RootStyled
                className={scroll ? "scroll" : ""}
                sx={{
                    minWidth: {md: minWidth ? minWidth : "100%", xs: "100%"},
                    maxWidth: {md: minWidth ? minWidth : "100%", xs: "100%"},
                }}
            >
                <Tabs
                    value={value}
                    onChange={OnTabsChange ? tabChange : tabChange}
                    variant="scrollable"
                    scrollButtons={false}
                    aria-label="scrollable auto tabs"
                    className="stepper-tabs"
                >
                    {stepperData.map(
                        (
                            v: {
                                title: string;
                                children: ReactNode;
                                disabled: boolean;
                            },
                            i: number
                        ) => (
                            <Tab
                                key={Math.random()}
                                disabled={v.disabled}
                                label={
                                    <Box
                                        sx={{
                                            textTransform: "initial",
                                            fontWeight: 400,
                                            fontSize: {md: 14, xs: 10},
                                        }}
                                    >
                                        <b>{i + 1}.</b> {t(`${v.title}`)}
                                    </Box>
                                }
                                className={value > i ? "submitted" : value < i ? "pending" : ""}
                                {...a11yProps(i)}
                            />
                        )
                    )}
                </Tabs>
                {steppers}
            </RootStyled>
        </>
    );
}

export default CustomStepper;
