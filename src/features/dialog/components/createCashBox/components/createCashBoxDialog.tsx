import React from "react";
import {TextField, Typography} from "@mui/material";
import {useAppDispatch} from "@lib/redux/hooks";
import {setDialogPayload} from "@features/dialog";
import {debounce} from "lodash";

function CreateCashboxDialog({...props}) {
    const {t} = props.data;
    const dispatch = useAppDispatch();

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        dispatch(setDialogPayload({cashBoxDialogData: {name: event.target.value}}))
    }

    const debouncedOnChange = debounce(handleOnChange, 1000);

    return (
        <>
            <Typography>{t('name-cashBox')}</Typography>
            <TextField
                fullWidth
                id={"model-name"}
                size="small"
                placeholder={t('name-cashBox-placeholder')}
                onChange={debouncedOnChange}
                sx={{my: 2}}/>
        </>
    )
}

export default CreateCashboxDialog
