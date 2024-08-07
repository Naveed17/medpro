import React, {useState, useEffect, useCallback} from "react";
import {
    Typography,
    Box,
    FormControl,
    Avatar, Autocomplete, TextField,
} from "@mui/material";
import {useRouter} from "next/router";
import _ from "lodash";
import {useIsMountedRef} from "@lib/hooks";
import {useRequestQuery} from "@lib/axios";
import {useCountries} from "@lib/hooks/rest";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useAppSelector} from "@lib/redux/hooks";
import {leftActionBarSelector} from "@features/leftActionBar";

interface StateProps {
    states: string;
    type: string;
}

function PlaceFilter({...props}) {
    const {item, t, keyPrefix = "", OnSearch} = props;
    const router = useRouter();
    const isMounted = useIsMountedRef();
    const {countries} = useCountries();

    const {query: filter} = useAppSelector(leftActionBarSelector);

    const [queryState, setQueryState] = useState<StateProps>({
        states: "",
        type: ""
    });
    const [state, setstate] = useState<{
        country: string;
        states: string[];
    }>({
        country: "",
        states: []
    });

    const {data: httpStatesResponse} = useRequestQuery(state.country.length > 0 ? {
        method: "GET",
        url: `/api/public/places/countries/${state.country}/state/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const {query} = router;
    const {states} = query as { states: string };

    const handleOnSearch = useCallback((value: any) => {
        OnSearch(value);
    }, [OnSearch]);

    const handleChangeCity = (country: CountryModel) => {
        setstate({country: country ? country.uuid : "", states: []});
        if (!country) {
            const query = _.omit(queryState, ["country", "states"]);
            const queryGlobal = _.omit(filter?.patient, ["country", "states"]);
            handleOnSearch({
                query: {
                    ...query,
                    ...queryGlobal
                }
            });
        } else {
            const query = _.omit(queryState, "states");
            const queryGlobal = _.omit(filter?.patient, "states");
            handleOnSearch({
                query: {
                    ...query,
                    ...queryGlobal,
                    country: country.uuid
                }
            });
        }
    }

    const handleStateChange = (statesInput: StateModel[]) => {
        const value = statesInput.map(state => state.uuid);
        setstate({...state, states: value});
        setQueryState({...queryState, states: value.join(",")});
        if (value.length === 0) {
            const query = _.omit(queryState, "states");
            const queryGlobal = _.omit(filter?.patient, "states");
            handleOnSearch({
                query: {
                    ...query,
                    ...queryGlobal,
                    country: state.country
                }
            });
        } else {
            const query = _.omit(queryState, "country");
            const queryGlobal = _.omit(filter?.patient, "country");
            handleOnSearch({
                query: {
                    ...query,
                    ...queryGlobal,
                    states: value.join(",")
                }
            });
        }
    };

    useEffect(() => {
        if (isMounted.current) {
            if (_.has(router.query, "states")) {
                setstate({
                    ...state,
                    states: [...state.states, ...states.split("_")],
                });
            }
        }
    }, [query, isMounted]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (filter?.patient?.hasOwnProperty('country')) {
            setstate({
                country: filter?.patient?.country ?? "",
                states: []
            });
        } else if (filter?.patient?.hasOwnProperty('states')) {
            setstate({
                country: filter?.patient?.states ? state.country : "",
                states: [...(filter?.patient?.states ? [filter.patient.states] : [])]
            });
        }
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

    const statesCountry = (httpStatesResponse as HttpResponse)?.data as any[];

    return (
        <>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                {t(`${keyPrefix}${item.country?.heading}`)}
            </Typography>
            <Autocomplete
                id="country"
                sx={{width: "100%"}}
                size={"small"}
                options={countries ? countries?.filter(country => country.hasState) : []}
                autoHighlight
                value={countries && state.country ? countries.find(country => country.uuid === state.country) : null}
                onChange={(event, country) => handleChangeCity(country as CountryModel)}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => (
                    <Box
                        component="li"
                        {...props}>
                        {option?.code && <Avatar
                            sx={{
                                width: 26,
                                height: 18,
                                borderRadius: 0.4
                            }}
                            alt={"flags"}
                            src={`https://flagcdn.com/${option.code.toLowerCase()}.svg`}
                        />}
                        <Typography sx={{ml: 1}}>{option.name}</Typography>
                    </Box>
                )}
                renderInput={(params) => (
                    <FormControl component="form" fullWidth onSubmit={e => e.preventDefault()}>
                        <TextField
                            {...params}
                            placeholder={t(`${keyPrefix}country-placeholder`)}
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password', // disable autocomplete and autofill
                            }}
                        />
                    </FormControl>
                )}
            />

            <Typography mt={2} variant="body2" color="text.secondary" gutterBottom>
                {t(`${keyPrefix}${item.city?.heading}`)}
            </Typography>
            <Autocomplete
                id="state"
                sx={{width: "100%"}}
                multiple
                disabled={!state.country}
                size={"small"}
                options={statesCountry ? statesCountry : []}
                autoHighlight
                filterSelectedOptions
                value={statesCountry && state.states ? statesCountry.filter(stateCountry => state.states?.includes(stateCountry.uuid)) : []}
                onChange={(event, states) => handleStateChange(states)}
                getOptionLabel={(option) => option.name}
                renderOption={(props, state) => (
                    <Box
                        component="li"
                        {...props}>
                        <Typography sx={{ml: 1}}>{state.name}</Typography>
                    </Box>
                )}
                renderInput={(params) => (
                    <FormControl component="form" fullWidth onSubmit={e => e.preventDefault()}>
                        <TextField
                            {...params}
                            placeholder={t(`${keyPrefix}city-placeholder`)}
                        />
                    </FormControl>
                )}
            />
        </>)
}

export default PlaceFilter;
