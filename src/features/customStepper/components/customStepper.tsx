import React, { useState, ReactNode, SyntheticEvent, useCallback } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { RootStyled } from "@features/customStepper";
import { TabPanel } from "@features/tabPanel";
import { EventDef } from "@fullcalendar/core/internal";
import { setStepperIndex } from "@features/calendar";
import { useAppDispatch } from "@lib/redux/hooks";
import { CardHeader, IconButton, Theme, Typography, useTheme, Stack } from "@mui/material";
import { CustomIconButton } from "@features/buttons";
import IconUrl from "@themes/urlIcon";

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

function CustomStepper({ ...props }) {
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
        prefixKey,
    } = props;

    const dispatch = useAppDispatch();
    const theme = useTheme()
    const [index, setIndex] = useState<number>(currentIndex);
    const [last, setLast] = useState<number>(1);

    const customActions = useCallback(
        (action: string, event: EventDef) => {
            if (OnCustomAction) {
                OnCustomAction(action, event);
            }
        },
        [OnCustomAction]
    );

    const backAction = useCallback(
        (currentIndex: number) => {
            if (currentIndex > 0) {
                dispatch(setStepperIndex(currentIndex - 1));
                setIndex(currentIndex - 1);
            }
            if (onBackButton) {
                onBackButton(currentIndex);
            }
        }, [onBackButton]); // eslint-disable-line react-hooks/exhaustive-deps

    const tabChange = useCallback(
        (event: SyntheticEvent, currentIndex: number) => {
            setIndex(currentIndex);
            if (OnTabsChange) {
                OnTabsChange(currentIndex);
            }
        },
        [OnTabsChange]
    );

    const submitStepper = useCallback(
        (currentIndex: number) => {
            if (currentIndex < stepperData.length) {
                setIndex(currentIndex);
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
                    minWidth: { md: minWidth ? minWidth : "100%", xs: "100%" },
                    maxWidth: { md: minWidth ? minWidth : "100%", xs: "100%" },
                }}>
                {prefixKey === "add-patient" &&
                    <CardHeader
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                        avatar={
                            <CustomIconButton sx={{ bgcolor: (theme: Theme) => theme.palette.primary.lighter, width: 52, height: 52 }}
                                icon="ic-filled-profile-add"
                                iconProps={{ width: 32, height: 32, color: theme.palette.primary.main }}
                            />
                        }
                        title={
                            <Typography variant="subtitle1" fontSize={18}>
                                {t("add-patient.title")}
                            </Typography>

                        }
                        subheader={<Typography color={"grey.500"} variant="subtitle2">
                            {t("add-patient.subtitle")}
                        </Typography>}
                        action={
                            <IconButton size="small">
                                <IconUrl path="ic-x" />
                            </IconButton>
                        }
                    />
                }
                <Tabs
                    value={index}
                    onChange={tabChange}
                    variant="scrollable"
                    scrollButtons={false}
                    aria-label="scrollable auto tabs"
                    className="stepper-tabs">
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
                                key={i}
                                disabled={v.disabled}
                                iconPosition="start"
                                icon={<Stack className="tab-icon" alignItems="center" justifyContent='center' width={36} height={36} borderRadius={'50%'} border={2} borderColor='transparent' bgcolor={theme.palette.grey[50]}>
                                    <Box className="dot" width={12} height={12} borderRadius={"50%"} bgcolor={theme.palette.grey[500]} />
                                </Stack>}
                                label={
                                    <Box
                                        sx={{
                                            textTransform: "initial",
                                            fontWeight: 400,
                                            fontSize: { md: 14, xs: 10 },
                                        }}>
                                        <b>{i + 1}.</b> {t(`${v.title}`)}
                                    </Box>
                                }
                                className={index > i ? "submitted" : index < i ? "pending" : ""}
                                {...a11yProps(i)}
                            />
                        )
                    )}
                </Tabs>
                {stepperData.map(
                    (
                        v: { key: string; title: string; children: ReactNode },
                        i: number
                    ) => {
                        const Component: any = v.children;
                        return (
                            <TabPanel key={i} value={index} index={i}>
                                <Component
                                    OnAction={customActions}
                                    onNext={submitStepper}
                                    onBack={backAction}
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
