import {TextIconRadio} from "@features/buttons";
import DateRangeIcon from "@mui/icons-material/DateRange";
import {Box, FormControlLabel, FormLabel, RadioGroup} from "@mui/material";
import Typography from "@mui/material/Typography";
import React, {useState} from "react";
import {useTranslation} from "next-i18next";
import FormControlStyled from "./overrides/FormControlStyled";
import StaffIcon from "@themes/overrides/icons/staffIcon";
import AbsentIcon from "@themes/overrides/icons/absentIcon";
import DomicileIcon from "@themes/overrides/icons/domicileIcon";
import TelemedicineIcon from "@themes/overrides/icons/telemedicineIcon";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {appointmentSelector, setAppointmentType} from "@features/tabPanel";
import {setStepperIndex} from "@features/calendar";

const types = [
    {
        value: "rdv",
        icon: <DateRangeIcon/>
    }, {
        value: "telemed",
        icon: <TelemedicineIcon/>
    }, {
        value: "domicile",
        icon: <DomicileIcon/>
    }, {
        value: "staff",
        icon: <StaffIcon/>
    }, {
        value: "absence",
        icon: <AbsentIcon/>
    },
]

function EventType() {
    const {type} = useAppSelector(appointmentSelector);
    const dispatch = useAppDispatch();
    const [typeEvent, setTypeEvent] = useState(type);

    const handleTypeChange = (type: string) => {
        setTypeEvent(type)
        dispatch(setAppointmentType(type));
    }

    const {t, ready} = useTranslation("agenda", {
        keyPrefix: "steppers",
    });

    if (!ready) return <>loading translations...</>;

    return (
        <>
            <Box className="inner-section">
                <Typography variant="h6" color="text.primary">
                    {t("stepper-0.title")}
                </Typography>
                <FormControlStyled fullWidth size="small">
                    <FormLabel id="type-group-label">{t("stepper-0.sub-title")}</FormLabel>
                    <RadioGroup
                        aria-labelledby="type-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                    >

                        {types.map((type, index) => (
                            <FormControlLabel
                                key={index}
                                value={type.value}
                                control={
                                    <TextIconRadio
                                        selectedValue={typeEvent}
                                        onChangeValue={(event: string) => handleTypeChange(event)}
                                        title={t(`stepper-0.types.${type.value}`)}
                                        icon={type.icon}
                                    />}
                                label=""/>)
                        )}

                    </RadioGroup>
                </FormControlStyled>
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
                    onClick={() => handleTypeChange("")}
                >
                    {t("back")}
                </Button>
                <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    disabled={typeEvent === ""}
                    onClick={() => dispatch(setStepperIndex(1))}
                >
                    {t("next")}
                </Button>
            </Paper>
        </>

    )
}

export default EventType;
