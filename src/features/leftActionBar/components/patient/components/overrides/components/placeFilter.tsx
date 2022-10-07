import React, { useState, ChangeEvent, useEffect } from "react";
import {
    Typography,
    Box,
    FormControl,
    FormControlLabel,
    MenuItem,
    Select,
    FormGroup,
    Checkbox,
} from "@mui/material";
import { useRouter } from "next/router";
import _ from "lodash";
import { useIsMountedRef } from "@app/hooks";
import { SelectChangeEvent } from "@mui/material";
import { useRequest } from "@app/axios";
import { SWRNoValidateConfig } from "@app/swr/swrProvider";

function PlaceFilter({ ...props }) {
    const { item, t, keyPrefix = "" } = props;
    const router = useRouter();
    const isMounted = useIsMountedRef();

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
        setstate({ ...state, country: event.target.value });
        router.push({
            query: { ...router.query, city: event.target.value },
        });
    };

    const handleChange = (props: string, e: ChangeEvent<HTMLInputElement>) => {
        let data = state.states;
        if (e.target.checked) {
            data = [...data, props.toLowerCase()];
            setstate({ ...state, states: [...state.states, props.toLowerCase()] });
            router.push({
                query: {
                    ...router.query,
                    states: [...state.states, props.toLowerCase()].join("_"),
                },
            });
        } else {
            const index = data.indexOf(props.toLowerCase());
            data.splice(index, 1);
            if (data.length > 0) {
                const filtered = state.states.filter(
                    (gen: string) => gen !== props.toLowerCase()
                );
                setstate({ ...state, states: filtered });
                router.push({
                    query: { ...router.query, states: filtered.join("_") },
                });
            } else {
                const query = _.omit(router.query, "states");
                router.push({
                    query,
                });
            }
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
                {t(`${keyPrefix}${item.city?.heading}`)}
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
                        return <Typography>{country?.name}</Typography>
                    }}
                >
                    {countries?.map((country) => (
                        <MenuItem
                            key={country.uuid}
                            value={country.uuid}>
                            <Box component="img"
                                src={`https://flagcdn.com/${country.code.toLowerCase()}.svg`} />
                            <Typography sx={{ ml: 1 }}>{country.name}</Typography>
                        </MenuItem>)
                    )}
                </Select>
            </FormControl>

            <FormControl sx={{ mt: 1 }} component="fieldset" variant="standard">
                <FormGroup>
                    {statesCountry?.slice(0, 10).map((c, i) => (
                        <FormControlLabel
                            key={i}
                            control={
                                <Checkbox
                                    size="small"
                                    checked={state.states.includes(c.uuid)}
                                    onChange={(e) => handleChange(c.uuid, e)}
                                    name={c.uuid}
                                />
                            }
                            label={
                                <Typography
                                    sx={{
                                        fontSize: 10,
                                        span: {
                                            ml: 1,
                                            color: (theme) => theme.palette.primary.main,
                                        },
                                    }}
                                >
                                    {c.name}
                                    <span>(6)</span>
                                </Typography>
                            }
                        />
                    ))}
                </FormGroup>
            </FormControl>
        </Box>
    );
}

export default PlaceFilter;
