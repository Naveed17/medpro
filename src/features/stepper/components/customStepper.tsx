import React, {useState, useCallback, useEffect} from "react";
import {RootStyled, setStepperIndex} from "@features/stepper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import {useAppDispatch} from "@lib/redux/hooks";

function CustomStepper({...props}) {
    const dispatch = useAppDispatch();
    const {
        tabIndex,
        stepperData,
        minWidth,
        t,
    } = props;
    const [index, setIndex] = useState<number>(tabIndex);

    const tabChange = useCallback(
        (currentIndex: number) => {
            setIndex(currentIndex);
            dispatch(setStepperIndex(currentIndex));
        }, [dispatch]);

    useEffect(() => {
        setIndex(tabIndex)
    }, [tabIndex])


    return (
        <>
            <RootStyled
                sx={{
                    minWidth: {md: minWidth ? minWidth : "100%", xs: "100%"},
                    maxWidth: {md: minWidth ? minWidth : "100%", xs: "100%"},
                }}
            >
                <Stepper activeStep={index} alternativeLabel>
                    {stepperData.map(
                        (
                            v: {
                                title: string;
                            },
                            i: number
                        ) => (
                            <Step
                                key={v.title}
                                className={
                                    i === index && stepperData.length - 1 === index ? "last-step" :
                                        i < index
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
