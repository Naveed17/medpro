import React, {useState} from "react";
import {
    Typography,
    Box,
    Card,
    TextField,
    Grid,
    Select,
    FormControl,
    MenuItem,
    FormGroup,
    FormControlLabel,
    Switch,
    Button
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {CountryCodeSelect} from "@features/countryCodeSelect";
import {Schedules} from "@features/schedules";
import Schedule from "@interfaces/schedule";
import {useTranslation} from "next-i18next";
import moment from "moment-timezone";

function Cabinet() {

    const [horaires, setHoraires] = useState<Schedule[]>([
        {
            day: moment().isoWeekday(1).format("dddd"),
            hours: [{start: '08:00', end: '14:00'}, {start: '16:00', end: '18:00'}],
            opened: false
        },
        {
            day: moment().isoWeekday(2).format("dddd"),
            hours: [{start: '08:00', end: '14:00'}, {start: '16:00', end: '18:00'}],
            opened: false
        },
        {
            day: moment().isoWeekday(3).format("dddd"),
            hours: null,
            opened: false
        },
        {
            day: moment().isoWeekday(4).format("dddd"),
            hours: [{start: '08:00', end: '14:00'}, null],
            opened: false
        },
        {
            day: moment().isoWeekday(5).format("dddd"),
            hours: [null,{start: '08:00', end: '14:00'}],
            opened: false
        },
        {
            day: moment().isoWeekday(6).format("dddd"),
            hours: null,
            opened: false
        },
        {
            day: moment().isoWeekday(0).format("dddd"),
            hours: [{start: '08:00', end: '14:00'}],
            opened: false
        }
    ])

    const { t, ready } = useTranslation('editProfile', { keyPrefix: "steppers.stepper-3" });
    if (!ready) return (<>loading translations...</>);

    return (
        <Box>
            <Typography variant="h6" color="text.primary">
                {t('title')}
            </Typography>
            <Typography
                variant="body1"
                color="text.primary"
                sx={{textTransform: "uppercase", mt: 2, mb: 1}}
            >
                {t("lieu.title")}
            </Typography>

            <Card sx={{p: 2, border: "1px solid #E4E4E4", boxShadow: "none"}}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        {" "}
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                textAlign: {md: "right", sm: "left"},
                            }}
                        >
                            {t("lieu.establishment")}
                        </Typography>
                    </Grid>
                    <Grid item lg={9} md={9} sm={12} xs={12}>
                        <TextField
                            placeholder="Text"
                            id="name"
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                textAlign: {md: "right", sm: "left"},
                            }}
                        >
                            {t("lieu.address")}
                        </Typography>
                    </Grid>
                    <Grid item lg={9} md={9} sm={12} xs={12}>
                        <TextField
                            placeholder="Text"
                            id="name"
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                textAlign: {md: "right", sm: "left"},
                            }}
                        >
                            {t("lieu.zip_code")}
                        </Typography>
                    </Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <TextField
                            placeholder="Text"
                            id="name"
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                textAlign: {md: "right", sm: "left"},
                            }}
                        >
                            {t("lieu.city")}
                        </Typography>
                    </Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        <FormControl fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                id={"specialty"}
                                size="small"
                                // {...getFieldProps("specialty")}
                                value={"Généraliste"}
                                displayEmpty={true}
                                renderValue={(value: any) =>
                                    value?.length ? (
                                        Array.isArray(value) ? (
                                            value.join(", ")
                                        ) : (
                                            value
                                        )
                                    ) : (
                                        <Box sx={{color: "text.secondary"}}>{value}</Box>
                                    )
                                }
                            >
                                <MenuItem value="Généraliste">Généraliste</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="3">3</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Card>
            <Typography
                variant="body1"
                color="text.primary"
                sx={{textTransform: "uppercase", mt: 2, mb: 1}}
            >
                {t("info.title")}
            </Typography>
            <Card sx={{p: 2, border: "1px solid #E4E4E4", boxShadow: "none"}}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        {" "}
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                textAlign: {md: "right", sm: "left"},
                            }}
                        >
                            {t("info.establishment")}
                        </Typography>
                    </Grid>
                    <Grid item lg={9} md={9} sm={12} xs={12}>
                        <Grid container spacing={2}>
                            <Grid item lg={3} md={3} sm={6} xs={12}>
                                <CountryCodeSelect selected={(v: string) => console.log(v)}/>
                            </Grid>
                            <Grid item lg={6} md={6} sm={8} xs={12}>
                                <TextField
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item lg={3} md={3} sm={8} xs={12}>
                                <FormControl component="fieldset">
                                    <FormGroup aria-label="position" row>
                                        <FormControlLabel
                                            sx={{ml: 0}}
                                            control={<Switch/>}
                                            label={t("info.hide")}
                                            labelPlacement="start"
                                        />
                                    </FormGroup>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Button
                    variant="text"
                    color="primary"
                    size="small"
                    startIcon={<IconUrl path="ic-plus"/>}
                    sx={{
                        ml: "21%",
                        mt: 2,
                        svg: {width: 13, path: {fill: "#0696D6"}},
                    }}
                >
                    {t("info.add")}
                </Button>
            </Card>
            <Typography
                variant="body1"
                color="text.primary"
                sx={{textTransform: "uppercase", mt: 2, mb: 1}}
            >
                {t("info-sup.title")}
            </Typography>
            <Card sx={{p: 2, border: "1px solid #E4E4E4", boxShadow: "none"}}>
                <Grid container spacing={2}>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                        {" "}
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                textAlign: {md: "right", sm: "left"},
                                mt: {md: 1, sm: 0},
                            }}
                        >
                            {t("info-sup.establishment")}
                        </Typography>
                    </Grid>
                    <Grid item lg={9} md={9} sm={12} xs={12}>
                        <TextField
                            placeholder={t("info-sup.typing")}
                            id="name"
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                        />
                    </Grid>
                </Grid>
            </Card>
            <Schedules initData={horaires} />
        </Box>
    )
}

export default Cabinet;
