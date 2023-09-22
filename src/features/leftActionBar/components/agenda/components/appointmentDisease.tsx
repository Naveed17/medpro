import {Autocomplete, FormControl, Stack, TextField} from "@mui/material";
import React, {useCallback, useState} from "react";
import {debounce} from "lodash";
import {useAppSelector} from "@lib/redux/hooks";
import {leftActionBarSelector} from "@features/leftActionBar";
import CircularProgress from "@mui/material/CircularProgress";
import {useRequestQuery} from "@lib/axios";
import {useRouter} from "next/router";
import MenuItem from "@mui/material/MenuItem";
import {arrayUniqueByKey} from "@lib/hooks";
import {useTranslation} from "next-i18next";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";

function AppointmentDisease({...props}) {
    const {OnSearch} = props;
    const router = useRouter();

    const {t} = useTranslation('common');
    const {query: filter} = useAppSelector(leftActionBarSelector);

    const [localFilter, setLocalFilter] = useState("");
    const [selectedDisease, setSelectedDisease] = useState({title: ""});

    const {data: httpDiseasesResponse, isLoading} = useRequestQuery(localFilter.length > 0 ? {
        method: "GET",
        url: `/api/private/diseases/${router.locale}?name=${localFilter}`
    } : null, ReactQueryNoValidateConfig);

    const handleOnChange = (event: string) => {
        setLocalFilter(event);
    }

    const handleOnSearch = useCallback((value: any) => {
        OnSearch(value);
    }, [OnSearch]);

    const debouncedOnChange = debounce(handleOnChange, 500);
    const diseases = (httpDiseasesResponse as HttpResponse)?.data.map((disease: any) => ({
        title: disease.data.title["@value"]
    })) as any[] ?? [];

    return (
        <FormControl component="form" fullWidth>
            <Autocomplete
                id={"diseases"}
                autoHighlight
                size="small"
                value={selectedDisease}
                onChange={(e, newValue: any) => {
                    e.stopPropagation();
                    setSelectedDisease({title: newValue?.title ?? ""});
                    handleOnSearch({...filter, disease: !newValue ? undefined : newValue.title});
                }}
                filterOptions={(options, params) => {
                    const {inputValue} = params;
                    if (inputValue.length > 0) options.unshift(inputValue)
                    return options
                }}
                noOptionsText={t("noOption")}
                sx={{color: "text.secondary"}}
                options={arrayUniqueByKey("title", diseases)}
                onInputChange={(event, newInputValue) => {
                    debouncedOnChange(newInputValue);
                }}
                getOptionLabel={(option) => option?.title ?? ""}
                renderOption={(props, option, index) => option?.title?.length > 0 && (
                    <Stack key={index + option.title}>
                        <MenuItem
                            {...props}
                            value={option.title}>
                            {option.title}
                        </MenuItem>
                    </Stack>
                )}
                renderInput={params =>
                    <TextField
                        color={"info"}
                        {...params}
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {isLoading ?
                                        <CircularProgress color="inherit"
                                                          size={20}/> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        }}
                        placeholder={"--"}
                        sx={{paddingLeft: 0}}
                        variant="outlined" fullWidth/>}/>
        </FormControl>
    )
}

export default AppointmentDisease;
