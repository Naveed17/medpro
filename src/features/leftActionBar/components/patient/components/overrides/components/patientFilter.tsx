import React, {Fragment, KeyboardEvent, useState} from "react";
import {
    Typography,
    Box,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    InputLabel, IconButton, Stack,
} from "@mui/material";
import _ from "lodash";
import moment from "moment-timezone";
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import MaleRoundedIcon from '@mui/icons-material/MaleRounded';
import FemaleRoundedIcon from '@mui/icons-material/FemaleRounded';
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider, DatePicker} from "@mui/x-date-pickers";
import {debounce} from "lodash";

interface StateProps {
    name: string;
    birthdate: Date | null;
    gender: string | null;
}

interface Lab {
    label: string;
    placeholder: string;
}

function PatientFilter({...props}) {
    const {item, t, keyPrefix = "", OnSearch} = props;
    const [queryState, setQueryState] = useState<StateProps>({
        name: "",
        birthdate: null,
        gender: null
    });

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, lab: Lab) => {
        setQueryState({...queryState, [lab.label]: event.target.value});
        if (event.target.value.length >= 3) {
            OnSearch({
                query: {
                    ...queryState,
                    ...(queryState.birthdate && {birthdate: moment(queryState.birthdate).format("DD-MM-YYYY")}),
                    [lab.label]: (event.target as HTMLInputElement).value
                },
            });
        } else if (event.target.value.length === 0) {
            const query = _.omit(queryState, [lab.label]);
            OnSearch({
                query: {
                    ...query,
                    ...(query.birthdate && {birthdate: moment(query.birthdate).format("DD-MM-YYYY")})
                }
            });
        }
    }

    const debouncedOnChange = debounce(handleOnChange, 500);

    return (
        <Box component="figure" sx={{m: 0}}>
            <Typography variant="body2" color="text.secondary">
                {t(`${keyPrefix}${item.gender?.heading}`)}
            </Typography>
            <FormControl component="fieldset">
                <RadioGroup
                    row
                    aria-label="gender"
                    onChange={(e) => {
                        setQueryState({...queryState, gender: e.target.value});
                        OnSearch({
                            query: {
                                ...queryState,
                                ...(queryState.birthdate && {birthdate: moment(queryState.birthdate).format("DD-MM-YYYY")}),
                                gender: e.target.value
                            }
                        });
                    }}
                    value={queryState.gender}
                    name="row-radio-buttons-group"
                    sx={{
                        ml: .5,
                        "& .MuiRadio-root": {
                            width: 36, height: 36
                        }
                    }}
                >
                    {item.gender?.genders.map((gender: string, i: number) => (
                        <FormControlLabel
                            key={`gender-${i}`}
                            value={++i}
                            control={<Radio/>}
                            label={<Stack direction={"row"} alignItems={"center"} spacing={.5}>
                                {gender === "male" ? <MaleRoundedIcon sx={{width: 16}}/> :
                                    <FemaleRoundedIcon sx={{width: 16}}/>}
                                {t(`${keyPrefix}${gender}`)}
                            </Stack>}
                        />
                    ))}
                    {queryState.gender &&
                        <IconButton size="small" onClick={() => {
                            const query = _.omit(queryState, "gender");
                            setQueryState({...queryState, gender: null});
                            OnSearch({
                                query: {
                                    ...query,
                                    ...(query.birthdate && {birthdate: moment(query.birthdate).format("DD-MM-YYYY")}),
                                },
                            });
                        }}>
                            <HighlightOffRoundedIcon color={"error"}/>
                        </IconButton>}
                </RadioGroup>
            </FormControl>
            {item.textField?.labels.map((lab: Lab, i: number) => (
                    <Fragment key={`patient-filter-label-${i}`}>
                        {lab.label === "name" ? (
                            <>
                                <InputLabel shrink htmlFor={lab.label} sx={{mt: 2}}>
                                    {t(`${keyPrefix}${lab.label}`)}
                                </InputLabel>
                                <FormControl component="form" fullWidth>
                                    <TextField
                                        onChange={(e) => debouncedOnChange(e, lab)}
                                        defaultValue={""}
                                        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                                            if (e.key === "Enter") {
                                                if ((e.target as HTMLInputElement).value) {
                                                    OnSearch({
                                                        query: {
                                                            ...queryState,
                                                            ...(queryState.birthdate && {birthdate: moment(queryState.birthdate).format("DD-MM-YYYY")}),
                                                            [lab.label]: (e.target as HTMLInputElement).value,
                                                        },
                                                    });
                                                } else {
                                                    const query = _.omit(queryState, [lab.label]);
                                                    OnSearch({
                                                        query: {
                                                            ...query,
                                                            ...(query.birthdate && {birthdate: moment(query.birthdate).format("DD-MM-YYYY")})
                                                        }
                                                    });
                                                }
                                            }
                                        }}
                                        type={"text"}
                                        fullWidth
                                        placeholder={t(`${keyPrefix}${lab.placeholder}`)}
                                    />
                                </FormControl>
                            </>
                        ) : (
                            <Box sx={{
                                "& .MuiOutlinedInput-root button": {
                                    padding: "5px",
                                    minHeight: "auto",
                                    height: "auto",
                                    minWidth: "auto"
                                }
                            }}>
                                <InputLabel shrink htmlFor={lab.label} sx={{mt: 2}}>
                                    {t(`${keyPrefix}${lab.label}`)}
                                </InputLabel>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        value={queryState.birthdate}
                                        inputFormat="dd/MM/yyyy"
                                        onChange={(date) => {
                                            setQueryState({
                                                ...queryState,
                                                birthdate: date
                                            });

                                            if (date && date.toString() !== "Invalid Date") {
                                                OnSearch({
                                                    query: {
                                                        ...queryState,
                                                        birthdate: moment(date).format("DD-MM-YYYY"),
                                                    },
                                                });
                                            } else {
                                                const query = _.omit(queryState, "birthdate");
                                                OnSearch({
                                                    query,
                                                });
                                            }
                                        }}
                                        renderInput={(params) =>
                                            <FormControl component="form" fullWidth>
                                                <TextField {...params} fullWidth/>
                                            </FormControl>}
                                    />
                                </LocalizationProvider>
                            </Box>
                        )}
                    </Fragment>
                )
            )}
        </Box>
    );
}

export default PatientFilter;
