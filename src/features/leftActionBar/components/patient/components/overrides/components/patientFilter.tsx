import {Fragment, KeyboardEvent, useState} from "react";
import {
    Typography,
    Box,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    InputLabel, IconButton,
} from "@mui/material";
import {DatePicker} from "@features/datepicker";
import _ from "lodash";
import moment from "moment-timezone";
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import {LocalizationProvider} from "@mui/x-date-pickers";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

interface StateProps {
    name: string;
    fiche_id: string;
    phone: number | string;
    birthdate: Date | null;
    gender: string | null;
}

function PatientFilter({...props}) {
    const {item, t, keyPrefix = "", OnSearch} = props;
    const [queryState, setQueryState] = useState<StateProps>({
        name: "",
        phone: "",
        fiche_id: "",
        birthdate: null,
        gender: null
    });

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
                >
                    {item.gender?.genders.map((g: string, i: number) => (
                        <FormControlLabel
                            sx={{ml: i === 1 ? "5px" : 0}}
                            key={`gender-${i}`}
                            value={++i}
                            control={<Radio/>}
                            label={t(`${keyPrefix}${g}`)}
                        />
                    ))}
                    {queryState.gender &&
                        <IconButton size="small" onClick={() => {
                            const query = _.omit(queryState, "gender");
                            setQueryState({...queryState, gender: null});
                            OnSearch({
                                query: {...query},
                            });
                        }}>
                            <HighlightOffRoundedIcon color={"error"}/>
                        </IconButton>}
                </RadioGroup>
            </FormControl>
            {item.textField?.labels.map(
                (
                    lab: {
                        label: string;
                        placeholder: string;
                    },
                    i: number
                ) => (
                    <Fragment key={`patient-filter-label-${i}`}>
                        {lab.label === "name" || lab.label === "phone" || lab.label === "fiche_id" ? (
                            <>
                                <InputLabel shrink htmlFor={lab.label} sx={{mt: 2}}>
                                    {t(`${keyPrefix}${lab.label}`)}
                                </InputLabel>
                                <TextField
                                    onChange={(e) => {
                                        setQueryState({...queryState, [lab.label]: e.target.value});
                                        if (e.target.value.length >= 3) {
                                            OnSearch({
                                                query: {
                                                    ...queryState,
                                                    ...(queryState.birthdate && {birthdate: moment(queryState.birthdate).format("DD-MM-YYYY")}),
                                                    [lab.label]: (e.target as HTMLInputElement).value
                                                },
                                            });
                                        } else if (e.target.value.length === 0) {
                                            const query = _.omit(queryState, [lab.label]);
                                            OnSearch({
                                                query: {
                                                    ...query,
                                                    ...(query.birthdate && {birthdate: moment(query.birthdate).format("DD-MM-YYYY")})
                                                }
                                            });
                                        }
                                    }}
                                    value={queryState[lab.label]}
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
                                    type={lab.label === "name" || lab.label === "fiche_id" ? "text" : "number"}
                                    fullWidth
                                    placeholder={t(`${keyPrefix}${lab.placeholder}`)}
                                />
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
                                        onChange={(date: Date) => {
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
