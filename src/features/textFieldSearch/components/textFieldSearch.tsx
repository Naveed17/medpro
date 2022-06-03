import React from 'react'
// material-ui components
import { TextField, InputAdornment } from '@mui/material'
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import {useTranslation} from "next-i18next";
import {SearchField} from "@features/textFieldSearch";

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
