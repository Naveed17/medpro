import {TextField, Typography} from "@mui/material";
import QuickAddAppointmentStyled
    from "@features/dialog/components/quickAddAppointment/overrides/quickAddAppointmentStyled";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import React, {useState} from "react";
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {FormikProvider, useFormik} from "formik";
import moment from "moment-timezone";

function VacationDrawer({...props}) {
    const {t} = props;

    const [absenceTypes, setAbsenceTypes] = useState([
        {label: 'dialogs.absence-dialog.vacation.yearly', value: 0},
        {label: 'dialogs.absence-dialog.vacation.sick', value: 1},
        {label: 'dialogs.absence-dialog.vacation.conference', value: 2},
        {label: 'dialogs.absence-dialog.vacation.absence', value: 3}]);

    const formik = useFormik({
        enableReinitialize: false,
        initialValues: {
            type: null,
            startDate: moment().toDate(),
            endDate: moment().toDate(),
            repeat: false
        },
        onSubmit: async (values) => {
            console.log("ok", values);
        },
    });

    const {values, setFieldValue} = formik;

    return (
        <QuickAddAppointmentStyled>
            <FormikProvider value={formik}>
                <Typography variant={"h6"}>{t("dialogs.absence-dialog.title")}</Typography>

                <Grid container spacing={1}>
                    <Grid item md={12} xs={12}>
                        <Typography variant="body1" color="text.primary" mt={3} mb={1}>
                            {t("filter.type")}
                        </Typography>
                        <FormControl fullWidth size="small">
                            <Select
                                labelId="select-duration"
                                id="select-duration"
                                onChange={event => setFieldValue("type", event.target.value)}
                                value={values.type}
                                displayEmpty
                                renderValue={selected => {
                                    if (selected === null) {
                                        return <em>{t("dialogs.absence-dialog.type-placeholder")}</em>;
                                    }
                                    return <>{t(absenceTypes.find(absence => absence.value === selected)?.label)}</>;
                                }}>
                                {absenceTypes?.map((absence) => (
                                    <MenuItem value={absence.value} key={absence.value}>
                                        {t(absence.label)}
                                    </MenuItem>
                                ))}
                            </Select>
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
                                    onChange={event => setFieldValue("startDate", event)}
                                    renderInput={(params) => <TextField size={"small"} {...params} />}
                                    value={values.startDate}/>
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>

                    <Grid item md={12} xs={12}>
                        <Typography variant="body1" color="text.primary" mb={1}>
                            {t("dialogs.absence-dialog.startDate")}
                        </Typography>
                        <FormControl fullWidth size="small">
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    ampmInClock={false}
                                    ampm={false}
                                    label="Basic date time picker"
                                    onChange={event => setFieldValue("endDate", event)}
                                    renderInput={(params) => <TextField size={"small"} {...params} />}
                                    value={values.endDate}/>
                            </LocalizationProvider>
                        </FormControl>
                    </Grid>
                </Grid>
            </FormikProvider>
        </QuickAddAppointmentStyled>
    )
}

export default VacationDrawer;
