import {
    Autocomplete,
    Box,
    Checkbox,
    FormControl,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import React, {useState} from "react";
import {MuiAutocompleteSelectAll} from "@features/muiAutocompleteSelectAll";

function AutoCompleteMulti({...props}) {
    const {placeholder, data, value = null, onChange} = props;
    const [selected, setSelected] = useState<any>(value);
    const selectedAll = data.length === selected.length;
    const handleSelectAll = (prop: any): void => {
        setSelected(prop);
        onChange(prop);
    };
    return (
        <Box>
            <MuiAutocompleteSelectAll.Provider
                value={{
                    onSelectAll: (selectedAll) =>
                        void handleSelectAll(selectedAll ? [] : data),
                    selectedAll,
                    indeterminate: !!data.length && !selectedAll,
                }}>
                <Autocomplete
                    size={"small"}
                    id={"assurance"}
                    multiple
                    autoHighlight
                    filterSelectedOptions
                    limitTags={3}
                    noOptionsText={""}
                    ListboxComponent={MuiAutocompleteSelectAll.ListBox}
                    value={value ?? []}
                    onChange={(event, value) => onChange(value)}
                    options={data ?? []}
                    getOptionLabel={(option) => (option?.name ? option.name : "")}
                    isOptionEqualToValue={(option: any, value) =>
                        option.name === value.name
                    }
                    renderOption={(params, option, {selected}) => (
                        <MenuItem {...params}>
                            <Checkbox checked={selected}/>
                            {/* <ImageHandler alt={"insurance"} src={option.logoUrl.url} /> */}
                            <Typography sx={{ml: 1}}>{option.name}</Typography>
                        </MenuItem>
                    )}
                    renderInput={(params) => (
                        <TextField
                            color={"info"}
                            {...params}
                            sx={{paddingLeft: 0}}
                            placeholder={placeholder}
                            variant="outlined"
                        />
                    )}
                />
            </MuiAutocompleteSelectAll.Provider>
        </Box>
    );
}

export default AutoCompleteMulti;
