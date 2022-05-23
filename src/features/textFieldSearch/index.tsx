import React from 'react'
// material-ui components
import { TextField, InputAdornment } from '@mui/material'
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import {useTranslation} from "next-i18next";
const SearchField = styled(TextField)(({ theme }) => ({
    borderRadius: 10,
    borderColor: theme.palette.divider,
    "&:hover": {
        border: theme.palette.primary.main,
    },
    "fieldset": {
        borderRadius: 10
    }
}));

function TextFieldSearch(props : any) {
    const { t, ready } = useTranslation('common');
    if (!ready) return (<>loading translations...</>);

    return (
        <>
            <SearchField placeholder={t("search")} size="small"
                         className={`textfield-search ${props.className}`}
                         InputProps={{
                             startAdornment: <InputAdornment position="start">
                                 <SearchIcon />
                             </InputAdornment>,
                         }}
            />
        </>
    )
}
export default TextFieldSearch
