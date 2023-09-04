import {Autocomplete, Divider, FormControl, Stack, TextField} from "@mui/material";
import React, {KeyboardEvent, useState} from "react";
import {debounce} from "lodash";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {leftActionBarSelector, setFilter} from "@features/leftActionBar";
import {useTranslation} from "next-i18next";
import CircularProgress from "@mui/material/CircularProgress";
import {useRequest} from "@lib/axios";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import {useRouter} from "next/router";
import MenuItem from "@mui/material/MenuItem";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {arrayUniqueByKey} from "@lib/hooks";

function AppointmentDisease() {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const {query: filter} = useAppSelector(leftActionBarSelector);

    const [localFilter, setLocalFilter] = useState("");
    const [selectedDisease, setSelectedDisease] = useState<string>("");

    const {data: httpDiseasesResponse} = useRequest({
        method: "GET",
        url: `/api/private/diseases/${router.locale}?name=${localFilter}`
    }, SWRNoValidateConfig);

    const handleOnChange = (event: string) => {
        setLocalFilter(event);
    }

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
                    setSelectedDisease(newValue?.title ?? "");
                    dispatch(setFilter({...filter, disease: !newValue ? undefined : newValue.title}));
                }}
                filterOptions={(options, params) => {
                    const {inputValue} = params;
                    if (inputValue.length > 0) options.unshift(inputValue)
                    return options
                }}
                sx={{color: "text.secondary"}}
                options={arrayUniqueByKey("title", diseases)}
                onInputChange={(event, newInputValue) => {
                    debouncedOnChange(newInputValue);
                }}
                renderOption={(props, option, index) => (
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
                                    {!diseases ?
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
