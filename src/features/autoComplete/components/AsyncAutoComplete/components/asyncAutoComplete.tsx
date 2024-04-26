import {Autocomplete, AutocompleteProps, CircularProgress, ListItem, ListItemText, TextField} from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";
import {useRequestQueryMutation} from "@lib/axios";
import {debounce} from "lodash";

function AsyncAutoComplete({...props}) {
    const {url, onChangeData, placeholder, loading = false, ...rest} = props

    const [data, setData] = useState<any[]>([]);
    const [openAutoComplete, setOpenAutoComplete] = useState(false);
    const [loadingReq, setLoadingReq] = useState(false);

    const {trigger: getDataTrigger} = useRequestQueryMutation("/autocomplete/data/get");

    const onChangeInput = useCallback((value: any[]) => {
        onChangeData(value);
    }, [onChangeData]);

    // Setting the logic for the asynchronous function on page reload
    useEffect(() => {
        if (!openAutoComplete) {
            return undefined;
        }

        (async () => {
            setLoadingReq(true);
            getDataTrigger({
                method: "GET",
                url
            }, {
                onSuccess: (result) => {
                    setData((result?.data as HttpResponse)?.data);
                    setLoadingReq(false);
                }
            });
        })();
    }, [openAutoComplete]); // eslint-disable-line react-hooks/exhaustive-deps

    const debouncedOnChange = debounce(onChangeInput, 500);

    return (
        <Autocomplete
            {...rest}
            size={"small"}
            disableClearable
            sx={{
                width: "100%",
                "& .MuiSelect-select": {
                    background: "white",
                }
            }}
            id="profile-select"
            open={openAutoComplete}
            onOpen={() => setOpenAutoComplete(true)}
            onClose={() => setOpenAutoComplete(false)}
            onChange={(e, staff) => {
                e.stopPropagation();
                onChangeInput(staff)
            }}
            options={data}
            renderInput={params =>
                <TextField
                    {...params}
                    {...{placeholder}}
                    color={"info"}
                    sx={{paddingLeft: 0}}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {(loadingReq || loading) ?
                                    <CircularProgress color="inherit" size={20}/> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                    variant="outlined"
                    fullWidth/>}
        />
    )
}

export default AsyncAutoComplete;
