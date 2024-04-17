import React, {useRef} from "react";
import {FormControl, InputAdornment, InputLabel, TextField} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterRootStyled from "../../patient/components/overrides/filterRootStyled";

function DepartmentFilter({...props}) {
    const {t} = props;
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <FilterRootStyled>
            <InputLabel shrink sx={{mt: 2}}>
                {t(`filter.search`)}
            </InputLabel>
            <FormControl
                component="form"
                fullWidth
                onSubmit={e => e.preventDefault()}>
                <TextField
                    className={'search-input'}
                    {...{inputRef}}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchRoundedIcon color={"white"}/>
                            </InputAdornment>
                        ),
                    }}
                    fullWidth
                    placeholder={t(`filter.search-input`)}
                />
            </FormControl>
        </FilterRootStyled>
    )
}

export default DepartmentFilter;
