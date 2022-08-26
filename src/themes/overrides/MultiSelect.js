import * as React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

function MultiSelect({
    data,
    placeholder,
    helperText,
    limit,
    all,
    onChange,
    onDelete,
    value, id, onDrop, onDragOver,
    ...rest
}) {
    const AutocompleteStyled = styled(Autocomplete)(({ theme }) => ({
        '& .MuiChip-root': {
            background: theme.palette.primary.main,
            '.MuiChip-label': {
                color: theme.palette.common.white,
            },
            '.MuiSvgIcon-root': {
                color: theme.palette.common.white,
            }
        },
        "& .MuiFormHelperText-root": {
            textAlign: "right"
        }
    }));

    return (
        <AutocompleteStyled
            multiple
            id="tags-outlined"
            options={data}
            onDrop={(e) => onDrop(id, e)}
            onDragOver={onDragOver}
            getOptionLabel={(option) => option.title}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={value}
            open={limit !== undefined && value.length === 10 ? false : undefined}
            filterSelectedOptions
            onChange={(event, v) => onChange(v)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    readOnly={true}
                    placeholder={value.length < 10 ? placeholder : ''}
                    helperText={helperText}
                />
            )}
        />
    );
}

export default MultiSelect;
