import {Stack, TextField, Typography} from "@mui/material";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import React from "react";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {FormikProvider, useFormik} from "formik";
import moment from "moment-timezone";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {setVacationData, vacationDrawerSelector} from "@features/drawer";
import {NoDataCard} from "@features/card";

function VacationDrawer({...props}) {
    const {t} = props;
    const dispatch = useAppDispatch();

    const {endDate, startDate, title} = useAppSelector(vacationDrawerSelector);

    const formik = useFormik({
        enableReinitialize: false,
        initialValues: {
            title: title,
            startDate: startDate ? startDate : moment().toDate(),
            endDate: endDate ? endDate : moment().toDate(),
            repeat: false
        },
        onSubmit: async (values) => {
            console.log("ok", values);
        },
    });

    const {values, setFieldValue} = formik;

    return (
        <Stack spacing={3}
               sx={{
                   height: '100vh',
                   width: 600,
                   "& .MuiOutlinedInput-root button": {
                       padding: "5px",
                       minHeight: "auto",
                       height: "auto",
                       minWidth: "auto"
                   }
               }}>
            <Stack sx={{
                padding: (theme) => theme.spacing(3),
                background: (theme) => theme.palette.common.white,
            }}>
                <FormikProvider value={formik}>
                    <Typography variant={"h6"}>{t("dialogs.absence-dialog.title")}</Typography>

                    <Grid container spacing={1}>
                        <Grid item md={12} xs={12}>
                            <Typography variant="body1" color="text.primary" mt={3} mb={1}>
                                {t("dialogs.absence-dialog.description")}
                            </Typography>
                            <FormControl fullWidth size="small">
                                <TextField
                                    value={values.title}
                                    fullWidth
                                    onChange={(e) => {
                                        setFieldValue("title", e.target.value);
                                        dispatch(setVacationData({"title": e.target.value}));
                                    }}
                                    placeholder={t("dialogs.absence-dialog.type-placeholder")} variant="outlined"/>
                            </FormControl>
                        </Grid>

                        <Grid item md={12} xs={12}>
                            <Typography variant="body1" color="text.primary" mt={3} mb={1}>
                                {t("dialogs.absence-dialog.startDate")}
                            </Typography>
                            <FormControl fullWidth size="small">
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateTimePicker
                                        ampmInClock={false}
                                        ampm={false}
                                        label="Basic date time picker"
                                        onChange={event => {
                                            setFieldValue("startDate", event);
                                            dispatch(setVacationData({"startDate": event}));
                                        }}
                                        renderInput={(params) => <TextField size={"small"} {...params} />}
                                        value={values.startDate}/>
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>

                        <Grid item md={12} xs={12}>
                            <Typography variant="body1" color="text.primary" mb={1}>
                                {t("dialogs.absence-dialog.endDate")}
                            </Typography>
                            <FormControl fullWidth size="small">
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateTimePicker
                                        ampmInClock={false}
                                        ampm={false}
                                        label="Basic date time picker"
                                        onChange={event => {
                                            setFieldValue("endDate", event);
                                            dispatch(setVacationData({"endDate": event}));
                                        }}
                                        renderInput={(params) => <TextField size={"small"} {...params} />}
                                        value={values.endDate}/>
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                    </Grid>
                </FormikProvider>
            </Stack>
            <Stack
                sx={{
                    paddingLeft: (theme) => theme.spacing(3),
                }}>
                <Typography
                    sx={{fontSize: "1rem", fontWeight: "bold"}}>{t("dialogs.absence-dialog.sub-title")}</Typography>

                <NoDataCard
                    {...{t}}
                    data={{
                        mainIcon: "ic-agenda-+",
                        title: "table.no-data.vacation.title",
                        description: "table.no-data.vacation.sub-title"
                    }}/>
            </Stack>
        </Stack>


    )
}

export default VacationDrawer;
