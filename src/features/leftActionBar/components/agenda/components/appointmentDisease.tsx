import {FormControl, TextField} from "@mui/material";
import React, {KeyboardEvent} from "react";
import moment from "moment-timezone";
import _, {debounce} from "lodash";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {leftActionBarSelector, setFilter} from "@features/leftActionBar";
import {useTranslation} from "next-i18next";

function AppointmentDisease() {
    const dispatch = useAppDispatch();

    const {t} = useTranslation('common');
    const {query} = useAppSelector(leftActionBarSelector);

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch(setFilter({disease: event.target.value}));
    }

    const debouncedOnChange = debounce(handleOnChange, 500);

    return (
        <FormControl component="form" fullWidth>
            <TextField
                defaultValue={query?.disease ?? ""}
                onChange={(e) => debouncedOnChange(e)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter" && (e.target as HTMLInputElement).value) {
                        dispatch(setFilter({disease: (e.target as HTMLInputElement).value}));
                    }
                }}
                fullWidth
                placeholder={t("disease-placeholder")}
            />
        </FormControl>
    )
}

export default AppointmentDisease;
