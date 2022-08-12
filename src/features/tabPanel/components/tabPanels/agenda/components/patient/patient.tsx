import Typography from "@mui/material/Typography";
import React from "react";
import {useTranslation} from "next-i18next";
import {LoadingScreen} from "@features/loadingScreen";
import {Box} from "@mui/material";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {setStepperIndex} from "@features/calendar";
import {useAppDispatch} from "@app/redux/hooks";
import {AutoCompleteButton} from "@features/buttons";

function Patient(){
    const dispatch = useAppDispatch();
    const {t, ready} = useTranslation("agenda", {
        keyPrefix: "steppers",
    });
    if (!ready) return (<LoadingScreen/>);

    return(
        <div>
            <Box className="inner-section">
                <Typography variant="h6" color="text.primary">
                    {t("stepper-2.title")}
                </Typography>
                <Typography variant="body1" color="text.primary" mt={3} mb={1}>
                    {t("stepper-2.sub-title")}
                </Typography>

                <AutoCompleteButton />
            </Box>
            <Paper
                sx={{
                    borderRadius: 0,
                    borderWidth: "0px",
                    textAlign: "right",
                }}
                className="action"
            >
                <Button
                    size="medium"
                    variant="text-primary"
                    color="primary"
                    sx={{
                        mr: 1,
                    }}
                    onClick={() => dispatch(setStepperIndex(1))}
                >
                    {t("back")}
                </Button>
                <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    onClick={() => dispatch(setStepperIndex(2))}
                >
                    {t("next")}
                </Button>
            </Paper>
        </div>
    )
}

export default Patient;
