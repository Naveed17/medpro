import React, { useCallback, useEffect, useState } from "react";
import { RootStyled, setStepperIndex, stepperSelector } from "@features/stepper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useAppDispatch, useAppSelector } from "@lib/redux/hooks";

function CustomStepper({ ...props }) {
    const dispatch = useAppDispatch();
    const { currentStep } = useAppSelector(stepperSelector)
    const {
        stepperData,
        minWidth,
        t,
    } = props;
    const [index, setIndex] = useState<number>(currentStep);
    const tabChange = useCallback(
        (currentIndex: number) => {
            setIndex(currentIndex);
            dispatch(setStepperIndex(currentIndex));
        },
        [index] // eslint-disable-line react-hooks/exhaustive-deps
    );

    useEffect(() => {
        setIndex(currentStep);
    }
        , [currentStep]) // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <>
            <RootStyled
                sx={{
                    minWidth: { md: minWidth ? minWidth : "100%", xs: "100%" },
                    maxWidth: { md: minWidth ? minWidth : "100%", xs: "100%" },
                }}>
                <Stepper activeStep={index} alternativeLabel>
                    {stepperData.map((v: { title: string; }, i: number) => (
                        <Step
                            key={v.title}
                            className={
                                i === index && stepperData.length - 1 === index ? "last-step" :
                                    stepperData.length - 1 < index
                                        ? "Mui-completed"
                                        : i === index
                                            ? "active"
                                            : ""
                            }>
                            <StepLabel
                                {...(index > i && {
                                    onClick: () => tabChange(i),
                                })}>
                                {t(v.title)}
                            </StepLabel>
                        </Step>
                    )
                    )}
                </Stepper>
            </RootStyled>
        </>
    );
}

export default CustomStepper;
