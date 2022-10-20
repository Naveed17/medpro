import {TextIconRadio} from "@features/buttons";
import {Box, FormControlLabel, LinearProgress, MenuItem, RadioGroup, Select, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import React, {useState} from "react";
import {useTranslation} from "next-i18next";
import FormControlStyled from "./overrides/FormControlStyled";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {appointmentSelector, setAppointmentType} from "@features/tabPanel";
import {IconsTypes, openDrawer, setStepperIndex} from "@features/calendar";
import {useRequest} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";


function EventType({...props}) {
    const {onNext, OnAction, select} = props;

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
                <FormControlStyled
                    sx={{
                        padding: `16px ${!select ? "16px" : "0"} ${!select ? "32px" : "16px"} ${!select ? "16px" : "0"}`,
                    }}
                    fullWidth size="small">
                    {!select ?
                        <RadioGroup
                            aria-labelledby="type-group-label"
                            defaultValue="female"
                            name="radio-buttons-group">
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
                                            title={type.name}
                                            icon={IconsTypes[type.icon]}
                                        />}
                                    label=""/>)
                            )}
                        </RadioGroup>
                        :
                        <Select
                            id={"duration"}
                            value={type}
                            displayEmpty
                            sx={{
                                "& .MuiSelect-select": {
                                    display: "flex",
                                    svg: {mr: 1}
                                }
                            }}
                            onChange={event => {
                                handleTypeChange(event.target.value as string)
                            }}
                            renderValue={selected => {
                                if (selected.length === 0) {
                                    return <em>{t("stepper-0.type-placeholder")}</em>;
                                }

                                const type = types.find(itemType => itemType.uuid === selected);
                                return (
                                    <Stack direction={"row"}>
                                        <FiberManualRecordIcon
                                            className={'motif-circle'}
                                            sx={{
                                                background: "white",
                                                border: .1,
                                                borderColor: 'divider',
                                                borderRadius: '50%',
                                                p: 0.05,
                                                color: type?.color
                                            }}
                                        />
                                        {type && IconsTypes[type.icon]}
                                        <Typography sx={{fontSize: "16px"}}>{type?.name}</Typography>
                                    </Stack>)
                            }}>
                            {types && types.map((type, index) => (
                                <MenuItem sx={{display: "flex", svg: {mr: 1}}} className="text-inner" value={type.uuid}
                                          key={type.uuid}>
                                    <FiberManualRecordIcon
                                        className={'motif-circle'}
                                        sx={{
                                            background: "white",
                                            border: .1,
                                            borderColor: 'divider',
                                            borderRadius: '50%',
                                            p: 0.05,
                                            color: type.color
                                        }}
                                    />
                                    {IconsTypes[type.icon]}
                                    <Typography sx={{fontSize: "16px"}}>{type.name}</Typography>
                                </MenuItem>)
                            )}
                        </Select>
                    }
                </FormControlStyled>
            </Box>

            {!select && <Paper
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
                    onClick={() => {
                        dispatch(openDrawer({type: "add", open: false}));
                        if (OnAction) {
                            OnAction("close")
                        }
                    }}
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
            </Paper>}
        </>
    )
}

export default EventType;
