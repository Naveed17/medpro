import * as React from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";


function MultiSelect({...props}) {
    const {
        label = 'title',
        multiple = true,
        id,
        data,
        initData,
        placeholder,
        getData,
        helperText,
        limit,
        onChange,
        onDrop,
        onDragOver
    } = props;

    return (
        <Autocomplete
            multiple={multiple}
            id="tags-standard"
            options={data}
            value={initData}
            getOptionLabel={(option) => option[label]}
            isOptionEqualToValue={(option, value) => option[label] === value[label]}
            onChange={(event, value) =>  onChange(event, value)}
            onDrop={(e) => onDrop(id, e)}
            onDragOver={onDragOver}
            renderInput={(params) => (
                <TextField
                    {...params}
                    helperText={helperText}
                    variant="outlined"
                    placeholder={placeholder}
                />
            )}
            renderTags={(value, getTagProps) =>
                value.map((option, index) => (
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
