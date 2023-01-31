import React, { useState, ChangeEvent, useEffect } from "react";
import {
    Typography,
    Box,
    FormControl,
    FormControlLabel,
    MenuItem,
    Select,
    FormGroup,
    Checkbox, Stack, OutlinedInput, Chip, InputLabel, Avatar,
} from "@mui/material";
import { useRouter } from "next/router";
import _ from "lodash";
import { useIsMountedRef } from "@app/hooks";
import { SelectChangeEvent } from "@mui/material";
import { useRequest } from "@app/axios";
import { SWRNoValidateConfig } from "@app/swr/swrProvider";
import Image from "next/image";
import moment from "moment-timezone";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

interface StateProps {
    states: string;
    type: string;
}

function PlaceFilter({ ...props }) {
    const { item, t, keyPrefix = "", OnSearch,setOpend } = props;
    const router = useRouter();
    const isMounted = useIsMountedRef();

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

    const { data: httpCountriesResponse } = useRequest({
        method: "GET",
        url: "/api/public/places/countries/" + router.locale
    }, SWRNoValidateConfig);

    const { data: httpStatesResponse } = useRequest(state.country.length > 0 ? {
        method: "GET",
        url: `/api/public/places/countries/${state.country}/state/${router.locale}`
    } : null, SWRNoValidateConfig);

    const { query } = router;
    const { states } = query as { states: string };


    const handleChangeCity = (event: SelectChangeEvent) => {
        setstate({country: event.target.value,states: []});
        setOpend('');
        /*router.push({
            query: {...router.query, city: event.target.value},
        });*/
    };

    const handleStateChange = (event: SelectChangeEvent<string[]>) => {
        const { target: { value } } = event;
        const states = typeof value === 'string' ? value.split(',') : value;
        setstate({ ...state, states });
        setQueryState({ ...queryState, states: value as string });
        if (value.length === 0) {
            const query = _.omit(queryState, "states");
            OnSearch({
                query
            });
        } else {
            OnSearch({
                query: {
                    ...queryState,
                    states: value
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

    const countries = (httpCountriesResponse as HttpResponse)?.data as CountryModel[];
    const statesCountry = (httpStatesResponse as HttpResponse)?.data as any[];


    return (
        <Box component="figure" sx={{ m: 0 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                {t(`${keyPrefix}${item.country?.heading}`)}
            </Typography>
            <FormControl size="small" fullWidth>
                <Select
                    labelId="country-select-label"
                    id={"country"}
                    onChange={handleChangeCity}
                    value={state.country}
                    size="small"
                    displayEmpty
                    sx={{ color: "text.secondary" }}
                    renderValue={(selected: string) => {
                        if (selected?.length === 0) {
                            return <em>{t(`${keyPrefix}country-placeholder`)}</em>;
                        }

                        const country = countries?.find(country => country.uuid === selected);
                        return (
                            <Stack direction={"row"}>
                                {country?.code && <Avatar
                                    sx={{
                                        width: 26,
                                        height: 18,
                                        borderRadius: 0.4,
                                        ml: 0,
                                        mr: ".5rem"
                                    }}
                                    alt="flag"
                                    src={`https://flagcdn.com/${country?.code.toLowerCase()}.svg`}
                                />}
                                <Typography ml={1}>{country?.name}</Typography>
                            </Stack>)
                    }}
                >
                    {countries?.filter(country => country.hasState).map((country) => (
                        <MenuItem
                            key={country.uuid}
                            value={country.uuid}>
                            {country?.code && <Avatar
                                sx={{
                                    width: 26,
                                    height: 18,
                                    borderRadius: 0.4
                                }}
                                alt={"flags"}
                                src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`}
                            />}
                            <Typography sx={{ ml: 1 }}>{country.name}</Typography>
                        </MenuItem>)
                    )}
                </Select>
            </FormControl>

            <Typography mt={2} variant="body2" color="text.secondary" gutterBottom>
                {t(`${keyPrefix}${item.city?.heading}`)}
            </Typography>
            <FormControl size="small" fullWidth>
                <Select
                    labelId="state-select-label"
                    id={"state"}
                    disabled={!state.country}
                    value={state.states}
                    onChange={handleStateChange}
                    multiple
                    size="small"
                    displayEmpty
                    input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                    sx={{ color: "text.secondary" }}
                    renderValue={(selected: string[]) => {
                        if (selected?.length === 0) {
                            return <em>{t(`${keyPrefix}city-placeholder`)}</em>;
                        }

                        return (<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected?.map(value => (
                                <Chip key={value} label={statesCountry?.find(state => state.uuid === value).name} />
                            ))}
                        </Box>)
                    }}
                    MenuProps={MenuProps}
                >
                    {statesCountry?.map((state) => (
                        <MenuItem
                            key={state.uuid}
                            value={state.uuid}>
                            <Typography sx={{ ml: 1 }}>{state.name}</Typography>
                        </MenuItem>)
                    )}
                </Select>
            </FormControl>
        </Box>
    );
}

export default PlaceFilter;
