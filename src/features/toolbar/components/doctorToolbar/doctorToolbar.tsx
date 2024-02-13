import {Button, Checkbox, FormControl, InputAdornment, MenuItem, Stack, TextField, Typography} from "@mui/material";
import React, {KeyboardEvent} from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import moment from "moment-timezone";
import _ from "lodash";
import {MuiAutocompleteSelectAll} from "@features/muiAutocompleteSelectAll";
import {ImageHandler} from "@features/image";
import Autocomplete from "@mui/material/Autocomplete";

function DoctorToolbar({...props}) {
    const {t} = props;

    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            width={1}
            alignItems="center">
            <Typography variant="subtitle2" color="text.primary">
                {t("sub-header.title")}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
                <FormControl>
                    <TextField
                        type={"email"}
                        sx={{minWidth: 200}}
                        className={'search-input'}
                        fullWidth
                        placeholder={t("sub-header.invite-placeholder")}
                    />
                </FormControl>

                <Autocomplete
                    size={"small"}
                    id={""}
                    autoHighlight
                    filterSelectedOptions
                    limitTags={3}
                    noOptionsText={t("sub-header.no-department-placeholder")}
                    options={[]}
                    renderInput={(params) => (
                        <FormControl component="form" fullWidth onSubmit={e => e.preventDefault()}>
                            <TextField color={"info"}
                                       {...params}
                                       sx={{paddingLeft: 0, minWidth: 140}}
                                       placeholder={t("sub-header.department-placeholder")}
                                       variant="outlined"
                            />
                        </FormControl>)}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary">
                    {t("sub-header.invite")}
                </Button>
            </Stack>
        </Stack>
    )
}

export default DoctorToolbar
