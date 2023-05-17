import React from 'react'
// material-ui components
import {InputAdornment} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import {useTranslation} from "next-i18next";
import {SearchField} from "@features/input/components/textFieldSearch";
import {LoadingScreen} from "@features/loadingScreen";

function TextFieldSearch(props: any) {
    const {t, ready} = useTranslation('common');
    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <>
            <SearchField placeholder={t("search")} size="small"
                         className={`textfield-search ${props.className}`}
                         InputProps={{
                             startAdornment: <InputAdornment position="start">
                                 <SearchIcon/>
                             </InputAdornment>,
                         }}
            />
        </>
    )
}

export default TextFieldSearch
