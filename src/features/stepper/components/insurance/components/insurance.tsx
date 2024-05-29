import {AnimatePresence, motion} from "framer-motion";
import React from "react";
import {stepperSelector} from "@features/stepper";
import {useAppSelector} from "@lib/redux/hooks";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import StepStyled from "./overrides/stepStyled";

function Insurance({...props}) {
    const {currentStep} = useAppSelector(stepperSelector);
    return (
        <StepStyled>
            <motion.div
                key="insurance"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.5}}>
                <AnimatePresence mode="wait">
                    {currentStep === 0 && <Step1 {...props} />}
                    {currentStep === 1 && <Step2 {...props} />}
                    {currentStep === 2 && <Step3 {...props} />}
                </AnimatePresence>
            </motion.div>
        </StepStyled>
    );
}

export default Insurance;
