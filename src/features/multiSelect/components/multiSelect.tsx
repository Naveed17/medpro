import * as React from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";

function MultiSelect({...props}) {
    const {
        label = 'title',
        multiple = true,
        id,
        freeSolo,
        data,
        initData,
        placeholder,
        getData,
        helperText,
        limit,
        onChange,
        onDrop,
        onDragOver,
        onInputChange,
        filterOptions,
        ...rest
    } = props;

    return (
        <Autocomplete
            {...rest}
            {...{filterOptions, onDragOver, onInputChange}}
            {...(freeSolo && freeSolo)}
            multiple={multiple}
            id="tags-standard"
            options={data}
            value={initData}
            getOptionLabel={(option: any) => {
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                    return option.inputValue;
                }
                // Regular option
                return option[label];
            }}
            isOptionEqualToValue={(option: any, value: any) => option[label] === value[label]}
            onChange={(event, value) =>  onChange(event, value, id)}
            onDrop={(e) => onDrop(id, e)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    helperText={helperText}
                    variant="outlined"
                    placeholder={placeholder}
                />
            )}
            renderTags={(value, getTagProps) =>
                value.map((option: any, index) => (
                    // eslint-disable-next-line react/jsx-key
                    <Chip
                        variant="contained"
                        color="primary"
                        label={option[label]}
                        {...getTagProps({ index })}
                    />
                ))
            }
            sx={{ "& .MuiFormHelperText-root": { textAlign: "right" } }}
        />
    );
}

export default MultiSelect;
