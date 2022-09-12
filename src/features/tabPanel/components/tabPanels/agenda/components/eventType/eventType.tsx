import {TextIconRadio} from "@features/buttons";
import DateRangeIcon from "@mui/icons-material/DateRange";
import {Box, FormControlLabel, FormLabel, LinearProgress, RadioGroup} from "@mui/material";
import Typography from "@mui/material/Typography";
import React, {useState} from "react";
import {useTranslation} from "next-i18next";
import FormControlStyled from "./overrides/FormControlStyled";
import DomicileIcon from "@themes/overrides/icons/domicileIcon";
import TelemedicineIcon from "@themes/overrides/icons/telemedicineIcon";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {appointmentSelector, resetAppointment, setAppointmentType} from "@features/tabPanel";
import {openDrawer, setStepperIndex} from "@features/calendar";
import {useRequest} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import StaffIcon from "@themes/overrides/icons/staffIcon";
import AbsentIcon from "@themes/overrides/icons/absentIcon";

const IconsTypes: any = {
    'ic-consultation': <DateRangeIcon/>,
    'ic-teleconsultation': <TelemedicineIcon/>,
    'ic-control': <DomicileIcon/>,
    'ic-clinique': <StaffIcon/>,
    'ic-at-home': <AbsentIcon/>,
    'ic-medical-representative': <AbsentIcon/>,
    'ic-staff-meeting': <AbsentIcon/>,
    'ic-absence': <AbsentIcon/>,
    'ic-personal': <AbsentIcon/>
}

function EventType({...props}) {
    const {onNext} = props;

    const router = useRouter();
    const dispatch = useAppDispatch();
    const {data: session} = useSession();

    const {type} = useAppSelector(appointmentSelector);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpAppointmentTypesResponse, error: errorHttpAppointmentTypes} = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/appointments/types/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const types = (httpAppointmentTypesResponse as HttpResponse)?.data as AppointmentTypeModel[];
    const [typeEvent, setTypeEvent] = useState(type);

    const handleTypeChange = (type: string) => {
        setTypeEvent(type);
        dispatch(setAppointmentType(type));
    }

    const {t, ready} = useTranslation("agenda", {
        keyPrefix: "steppers",
    });

    if (!ready) return <>loading translations...</>;

    const onNextStep = () => {
        dispatch(setStepperIndex(1));
        onNext(1);
    }

    return (
        <>
            <LinearProgress sx={{
                visibility: !httpAppointmentTypesResponse ? "visible" : "hidden"
            }} color="warning"/>
            <Box className="inner-section">
                <Typography variant="h6" color="text.primary">
                    {t("stepper-0.title")}
                </Typography>
                <FormControlStyled fullWidth size="small">
                    {/*<FormLabel id="type-group-label">{t("stepper-0.sub-title")}</FormLabel>*/}
                    <RadioGroup
                        aria-labelledby="type-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                    >
                        {types && types.map((type, index) => (
                            <FormControlLabel
                                key={index}
                                value={type.uuid}
                                control={
                                    <TextIconRadio
                                        item={type}
                                        color={type.color}
                                        selectedValue={typeEvent}
                                        onChangeValue={(event: string) => handleTypeChange(event)}
                                        title={t(`stepper-0.types.${type.icon.replace("ic-", "")}`)}
                                        icon={IconsTypes[type.icon]}
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
                    onClick={() => dispatch(openDrawer({type: "add", open: false}))}
                >
                    {t("finish")}
                </Button>
                <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    disabled={typeEvent === ""}
                    onClick={onNextStep}
                >
                    {t("next")}
                </Button>
            </Paper>
        </>
    )
}

export default EventType;
