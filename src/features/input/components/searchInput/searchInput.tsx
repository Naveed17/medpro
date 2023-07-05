import React from 'react'
// material-ui components
import SearchIcon from '@mui/icons-material/Search';
import SearchStyled from "./overrides/searchStyled";
import SearchIconWrapper from "./overrides/searchIconWrapper";
import StyledInputBase from "./overrides/styledInputBase";

function SearchInput({...props}) {
    return (
        <SearchStyled>
            <SearchIconWrapper>
                <SearchIcon/>
            </SearchIconWrapper>
            <StyledInputBase
                {...props}
                placeholder="Commencez à taper pour rechercher…"
                inputProps={{'aria-label': 'search'}}
            />
        </SearchStyled>
    )
}

export default SearchInput;
