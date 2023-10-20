import React, {Fragment, KeyboardEvent, useCallback} from "react";
import {
    Typography,
    Box,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    InputLabel, IconButton, Stack, Checkbox,
} from "@mui/material";
import _ from "lodash";
import moment from "moment-timezone";
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import MaleRoundedIcon from '@mui/icons-material/MaleRounded';
import FemaleRoundedIcon from '@mui/icons-material/FemaleRounded';
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider, DatePicker} from "@mui/x-date-pickers";
import {debounce} from "lodash";
import {useAppSelector} from "@lib/redux/hooks";
import {leftActionBarSelector} from "@features/leftActionBar";
import {FormikHelpers, FormikProvider, useFormik} from "formik";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import {Label} from "@features/label";

interface Lab {
    label: string;
    placeholder: string;
}

const Gender: { [key: number]: string } = {
    0: "M",
    1: "F",
    2: "O"
}

function PatientFilter({...props}) {
    const {item, t, keyPrefix = "", OnSearch} = props;

    const {query: filter} = useAppSelector(leftActionBarSelector);

    const formik = useFormik({
        onSubmit<Values>(): void | Promise<any> {
            return undefined;
        },
        initialValues: {
            name: filter?.patient?.name ?? "",
            birthdate: filter?.patient?.birthdate ? moment(filter?.patient?.birthdate, "DD-MM-YYYY").toDate() : null,
            gender: filter?.patient?.gender ?? null,
            hasDouble: filter?.patient?.hasDouble ?? false,
        }
    });

    const {values: queryState, setFieldValue} = formik;

    const onSearchChange = useCallback((value: any) => {
        OnSearch(value);
    }, [OnSearch]);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, lab: Lab) => {
        setFieldValue("name", event.target.value);
        if (event.target.value.length >= 1) {
            onSearchChange({
                query: {
                    ...filter?.patient,
                    ...(queryState.birthdate && {birthdate: moment(queryState.birthdate).format("DD-MM-YYYY")}),
                    [lab.label]: (event.target as HTMLInputElement).value
                },
            });
        } else if (event.target.value.length === 0) {
            const query = _.omit(queryState, [lab.label]);
            const queryGlobal = _.omit(filter?.patient, [lab.label]);
            onSearchChange({
                query: {
                    ...query,
                    ...queryGlobal,
                    ...(query.birthdate && {birthdate: moment(query.birthdate).format("DD-MM-YYYY")})
                }
            });
        }
    }

    const debouncedOnChange = debounce(handleOnChange, 500);

    return (
        <FormikProvider value={formik}>
            <Box component="figure" sx={{m: 0}}>
                {item.hasDouble && <FormControlLabel
                    control={
                        <Checkbox
                            color="warning"
                            size="small"
                            checked={queryState.hasDouble}
                            onChange={event => {
                                setFieldValue("hasDouble", event.target.checked);
                                onSearchChange({
                                    query: {
                                        ...filter?.patient,
                                        ...(queryState.birthdate && {birthdate: moment(queryState.birthdate).format("DD-MM-YYYY")}),
                                        hasDouble: event.target.checked
                                    }
                                });
                            }}
                        />}
                    label={<Label
                        variant="filled"
                        sx={{
                            cursor: "pointer",
                            "& .MuiSvgIcon-root": {
                                width: 14,
                                height: 14,
                                pl: 0,
                                mr: 1
                            }
                        }}
                        color={"warning"}>
                        <WarningRoundedIcon/>
                        <Typography sx={{fontSize: 10}}> {t(item.hasDouble?.heading)}</Typography>
                    </Label>}/>}
                <Typography variant="body2" color="text.secondary">
                    {t(`${keyPrefix}${item.gender?.heading}`)}
                </Typography>
                <FormControl component="fieldset">
                    <RadioGroup
                        row
                        aria-label="gender"
                        onChange={(e) => {
                            setFieldValue("gender", e.target.value)
                            onSearchChange({
                                query: {
                                    ...filter?.patient,
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
                                value={Gender[i]}
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
                                const queryGlobal = _.omit(filter?.patient, "gender");
                                setFieldValue("gender", null)
                                onSearchChange({
                                    query: {
                                        ...query,
                                        ...queryGlobal,
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
                                    <InputLabel shrink sx={{mt: 2}}>
                                        {t(`${keyPrefix}${lab.label}`)}
                                    </InputLabel>
                                    <FormControl
                                        component="form"
                                        fullWidth
                                        onSubmit={e => e.preventDefault()}>
                                        <TextField
                                            defaultValue={queryState.name}
                                            onChange={(e) => debouncedOnChange(e, lab)}
                                            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                                                if (e.key === "Enter") {
                                                    if ((e.target as HTMLInputElement).value) {
                                                        onSearchChange({
                                                            query: {
                                                                ...filter?.patient,
                                                                ...(queryState.birthdate && {birthdate: moment(queryState.birthdate).format("DD-MM-YYYY")}),
                                                                [lab.label]: (e.target as HTMLInputElement).value,
                                                            },
                                                        });
                                                    } else {
                                                        const query = _.omit(queryState, [lab.label]);
                                                        const queryGlobal = _.omit(filter?.patient, [lab.label]);
                                                        onSearchChange({
                                                            query: {
                                                                ...query,
                                                                ...queryGlobal,
                                                                ...(query.birthdate && {birthdate: moment(query.birthdate).format("DD-MM-YYYY")})
                                                            }
                                                        });
                                                    }
                                                }
                                            }}
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
                                    <InputLabel shrink sx={{mt: 2}}>
                                        {t(`${keyPrefix}${lab.label}`)}
                                    </InputLabel>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            value={queryState.birthdate}
                                            inputFormat="dd/MM/yyyy"
                                            onChange={date => {
                                                setFieldValue("birthdate", date);
                                                if (date && date.toString() !== "Invalid Date" && date.getFullYear() > 1000) {
                                                    onSearchChange({
                                                        query: {
                                                            ...filter?.patient,
                                                            birthdate: moment(date).format("DD-MM-YYYY"),
                                                        },
                                                    });
                                                } else {
                                                    const query = _.omit(queryState, "birthdate");
                                                    const queryGlobal = _.omit(filter?.patient, [lab.label]);
                                                    onSearchChange({
                                                        query: {
                                                            ...query,
                                                            ...queryGlobal
                                                        }
                                                    });
                                                }
                                            }}
                                            renderInput={(params) =>
                                                <FormControl component="form" fullWidth onSubmit={e => e.preventDefault()}>
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
        </FormikProvider>
    )
        ;
}

export default PatientFilter;
