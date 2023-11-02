import {FilterContainerStyles} from "@features/leftActionBar";
import {
    Autocomplete,
    Box,
    Divider,
    FormControl, FormControlLabel,
    InputLabel, Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import React, {useState} from "react";
import {useTranslation} from "next-i18next";
import dynamic from "next/dynamic";
import {AutoCompleteButton} from "@features/buttons";
import moment from "moment-timezone";
import MenuItem from "@mui/material/MenuItem";
import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function Document() {
    const router = useRouter();

    const {t, ready} = useTranslation("docs");

    const [name, setName] = useState("");
    const [type, setType] = useState(null);
    const [appointment, setAppointment] = useState<any>(null);
    const [target, setTarget] = useState<string | null>(null);
    const [date, setDate] = useState(moment().toDate());

    const {data: httpTypeResponse} = useRequestQuery({
        method: "GET",
        url: `/api/private/document/types/${router.locale}`
    }, {variables: {query: "?is_active=0"}});

    const handleSearchChange = (search: string) => {

    }

    const handleOnClick = () => {

    }

    const handlePatientSearch = () => {

    }

    const types = ((httpTypeResponse as HttpResponse)?.data ?? []) as any[];

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <>
            <FilterContainerStyles>
                <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{py: 1.48, pl: "10px", mb: "0.21em"}}
                    gutterBottom>
                    {t(`filter.title`)}
                </Typography>
                <Divider/>
                <Box m={2.5}>
                    <Typography mb={1} color={"text.primary"} fontSize={14} fontWeight={400}>Patient
                        Suggérés</Typography>

                    <AutoCompleteButton
                        onSearchChange={handleSearchChange}
                        OnClickAction={handleOnClick}
                        OnOpenSelect={handlePatientSearch}
                        translation={t}
                        loading={false}
                        data={[]}/>

                    <InputLabel shrink sx={{mt: 2}}>
                        {t(`Nom du document`)}
                    </InputLabel>
                    <FormControl
                        component="form"
                        fullWidth
                        onSubmit={e => e.preventDefault()}>
                        <TextField
                            fullWidth
                            value={name}
                            onChange={event => setName(event.target.value)}
                            placeholder={t(`Tapez le nom du document`)}
                        />
                    </FormControl>

                    <InputLabel shrink sx={{mt: 2}}>
                        {t(`Type de document`)}
                    </InputLabel>
                    <FormControl
                        component="form"
                        fullWidth
                        onSubmit={e => e.preventDefault()}>
                        <Autocomplete
                            id={"select-doc-type"}
                            autoHighlight
                            disableClearable
                            size="small"
                            value={type}
                            onChange={(e, newValue: any[]) => {
                                e.stopPropagation();
                            }}
                            sx={{color: "text.secondary"}}
                            options={types}
                            getOptionLabel={option => option?.name ? option.name : ""}
                            isOptionEqualToValue={(option: any, value) => option.name === value.name}
                            renderOption={(props, option) => (
                                <Stack key={option.uuid}>
                                    <MenuItem
                                        {...props}
                                        value={option.uuid}>
                                        {option.name}
                                    </MenuItem>
                                </Stack>
                            )}
                            renderInput={params =>
                                <TextField
                                    color={"info"}
                                    {...params}
                                    placeholder={t("Séléctionnez le type")}
                                    sx={{paddingLeft: 0}}
                                    variant="outlined" fullWidth/>}/>
                    </FormControl>

                    <InputLabel shrink sx={{mt: 2}}>
                        {t(`Destination`)}
                    </InputLabel>
                    <RadioGroup
                        row
                        aria-label="gender"
                        onChange={(e) => {
                            setTarget(e.target.value);
                        }}
                        value={target}
                        name="row-radio-buttons-group"
                        sx={{
                            ml: .5,
                            "& .MuiRadio-root": {
                                width: 36, height: 36
                            }
                        }}>
                        <FormControlLabel
                            value={'dir'}
                            control={<Radio/>}
                            label={<Stack direction={"row"} alignItems={"center"} spacing={.5}>
                                {t(`Dossier patient`)}
                            </Stack>}
                        />
                        <FormControlLabel
                            value={'appointment'}
                            control={<Radio/>}
                            label={<Stack direction={"row"} alignItems={"center"} spacing={.5}>
                                {t(`Consultation`)}
                            </Stack>}
                        />
                    </RadioGroup>

                    {target === 'appointment' && <FormControl
                        component="form"
                        fullWidth
                        onSubmit={e => e.preventDefault()}>
                        <Autocomplete
                            id={"select-doc-appointment"}
                            autoHighlight
                            disableClearable
                            size="small"
                            value={appointment}
                            onChange={(e, newValue: any[]) => {
                                e.stopPropagation();
                            }}
                            sx={{color: "text.secondary"}}
                            options={[]}
                            getOptionLabel={option => option?.name ? option.name : ""}
                            isOptionEqualToValue={(option: any, value) => option.name === value.name}
                            renderOption={(props, option) => (
                                <Stack key={option.uuid}>
                                    <MenuItem
                                        {...props}
                                        value={option.uuid}>
                                        {option.name}
                                    </MenuItem>
                                </Stack>
                            )}
                            renderInput={params =>
                                <TextField
                                    color={"info"}
                                    {...params}
                                    placeholder={t("Séléctionnez la consultation")}
                                    sx={{paddingLeft: 0}}
                                    variant="outlined" fullWidth/>}/>
                    </FormControl>}

                    <InputLabel shrink sx={{mt: 2}}>
                        {t(`Date du document`)}
                    </InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            value={date}
                            inputFormat="dd/MM/yyyy"
                            onChange={date => {

                            }}
                            renderInput={(params) =>
                                <FormControl
                                    sx={{
                                        "& .MuiOutlinedInput-root button": {
                                            padding: "5px",
                                            minHeight: "auto",
                                            height: "auto",
                                            minWidth: "auto",
                                        }
                                    }} component="form" fullWidth onSubmit={e => e.preventDefault()}>
                                    <TextField {...params} fullWidth/>
                                </FormControl>}
                        />
                    </LocalizationProvider>
                </Box>
            </FilterContainerStyles>
        </>
    )
}

export default Document;
