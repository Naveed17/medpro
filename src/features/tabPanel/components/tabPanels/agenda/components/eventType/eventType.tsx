import {TextIconRadio} from "@features/buttons";
import {
    Box, Collapse,
    FormControlLabel, Grid,
    LinearProgress, List, ListItemButton, ListItemText,
    MenuItem,
    RadioGroup,
    Select,
    Stack,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import FormControlStyled from "./overrides/FormControlStyled";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {appointmentSelector, setAppointmentType} from "@features/tabPanel";
import {IconsTypes, openDrawer, setStepperIndex} from "@features/calendar";
import {ModelDot} from "@features/modelDot";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

import {dashLayoutSelector} from "@features/base";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";

function EventType({...props}) {
    const {onNext, OnAction, select, defaultType = null} = props;

    const dispatch = useAppDispatch();

    const {type} = useAppSelector(appointmentSelector);
    const {appointmentTypes} = useAppSelector(dashLayoutSelector);
    const {t, ready} = useTranslation("agenda", {keyPrefix: "steppers",});

    const [typeEvent, setTypeEvent] = useState(type);

    const handleTypeChange = (type: string) => {
        setTypeEvent(type);
        dispatch(setAppointmentType(type));
        if (!select) {
            onNextStep();
        }
    };

    const onNextStep = () => {
        dispatch(setStepperIndex(1));
        onNext(1);
    };

    useEffect(() => {
        if (appointmentTypes && defaultType !== null) {
            const type = appointmentTypes[defaultType];
            setTypeEvent(type.uuid);
            dispatch(setAppointmentType(type.uuid));
        }
    }, [appointmentTypes, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <>
            <LinearProgress
                sx={{
                    visibility: !appointmentTypes ? "visible" : "hidden",
                }}
                color="warning"
            />

            <Box className="inner-section type-time-slot" sx={{width: "100%"}}>
                <FormControlStyled
                    sx={{padding: 0}}
                    fullWidth
                    size="small">
                    {!select ? (
                        <RadioGroup
                            aria-labelledby="type-group-label"
                            name="radio-buttons-group">
                            {appointmentTypes?.map((type, index) => (
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
                                        />
                                    }
                                    label=""
                                />
                            ))}
                        </RadioGroup>
                    ) : (
                        <List
                            sx={{width: '100%', p: 0}}
                            component="nav">
                            <ListItemText primary={
                                <Grid container alignItems={"center"}>
                                    <Grid item md={5} xs={12}>
                                        <Typography pr={2} sx={{fontSize: "1rem", fontWeight: "bold"}} color="text.primary">
                                            {t("stepper-0.title")} :
                                        </Typography>
                                    </Grid>
                                    <Grid item md={7} xs={12}>
                                        <Select
                                            id={"duration"}
                                            value={type}
                                            size={"small"}
                                            displayEmpty
                                            sx={{
                                                width: "100%",
                                                "& .MuiSelect-select": {
                                                    display: "flex",
                                                },
                                            }}
                                            onChange={(event) => handleTypeChange(event.target.value as string)}
                                            renderValue={(selected) => {
                                                if (selected.length === 0) {
                                                    return <em>{t("stepper-0.type-placeholder")}</em>;
                                                }

                                                const type = appointmentTypes?.find(
                                                    (itemType) => itemType.uuid === selected
                                                );
                                                return (
                                                    <Stack direction={"row"} alignItems={"center"}>
                                                        <ModelDot
                                                            icon={type && IconsTypes[type.icon]}
                                                            color={type?.color}
                                                            selected={false}
                                                            marginRight={10}></ModelDot>
                                                        <Typography sx={{fontSize: "14px", fontWeight: "bold"}}>
                                                            {type?.name}
                                                        </Typography>
                                                    </Stack>
                                                );
                                            }}>
                                            {appointmentTypes?.map((type) => (
                                                <MenuItem
                                                    sx={{display: "flex"}}
                                                    className="text-inner"
                                                    value={type.uuid}
                                                    key={type.uuid}>
                                                    <ModelDot
                                                        icon={type && IconsTypes[type.icon]}
                                                        color={type?.color}
                                                        selected={false}
                                                        marginRight={10}></ModelDot>
                                                    <Typography sx={{fontSize: "16px"}}>
                                                        {type.name}
                                                    </Typography>
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                </Grid>}/>
                        </List>)}
                </FormControlStyled>
            </Box>

            {!select && (
                <Paper
                    sx={{
                        borderRadius: 0,
                        borderWidth: "0px",
                        textAlign: "right",
                    }}
                    className="action">
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
                                OnAction("close");
                            }
                        }}>
                        {t("finish")}
                    </Button>
                    <Button
                        size="medium"
                        variant="contained"
                        color="primary"
                        disabled={typeEvent === ""}
                        onClick={onNextStep}>
                        {t("next")}
                    </Button>
                </Paper>
            )}
        </>
    );
}

export default EventType;
