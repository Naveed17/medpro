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
    Collapse,
    Button,
    Paper,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {CountryCodeSelect} from "@features/countryCodeSelect";
import {Schedules} from "@features/schedules";
import Schedule from "@interfaces/schedule";

interface horairesTimePiker {
    start: string
    end: string
}

interface horaires {
    [key: string]: {
        expand: boolean
        hours: horairesTimePiker[]
    }
}


function StepperCabinet() {

    const [horaires, setHoraires] = useState<Schedule[]>([
        {
            day: 'lundi',
            hours: [{start: '08:00', end: '14:00'}, {start: '16:00', end: '18:00'}],
            opened: true
        },
        {
            day: 'mardi',
            hours: [{start: '08:00', end: '14:00'}, {start: '16:00', end: '18:00'}],
            opened: true
        },
        {
            day: 'mercredi',
            hours: null,
            opened: false
        },
        {
            day: 'jeudi',
            hours: [{start: '08:00', end: '14:00'}, null],
            opened: true
        },
        {
            day: 'vendredi',
            hours: [null,{start: '08:00', end: '14:00'}],
            opened: true
        },
        {
            day: 'samedi',
            hours: null,
            opened: false
        },
        {
            day: 'dimanche',
            hours: [{start: '08:00', end: '14:00'}],
            opened: true
        }
    ])

    console.log(horaires);

    return (
        <Box>
            <Typography variant="h6" color="text.primary">
                Cabinet
            </Typography>
            <Typography
                variant="body1"
                color="text.primary"
                sx={{textTransform: "uppercase", mt: 2, mb: 1}}
            >
                Lieu
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
                            Nom de l’etablissement{" "}
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
                            Adresse
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
                            Code postal{" "}
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
                            Ville{" "}
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
                Information pratique
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
                            Nom de l’etablissement{" "}
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
                                            label="Masqué"
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
                    Ajouter un numéro
                </Button>
            </Card>
            <Typography
                variant="body1"
                color="text.primary"
                sx={{textTransform: "uppercase", mt: 2, mb: 1}}
            >
                Information pratique
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
                            Nom de l’etablissement{" "}
                        </Typography>
                    </Grid>
                    <Grid item lg={9} md={9} sm={12} xs={12}>
                        <TextField
                            placeholder="Tapez ici les informations"
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

export default StepperCabinet;
