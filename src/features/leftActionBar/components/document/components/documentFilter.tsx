import {Checkbox, FormControl, FormControlLabel, InputLabel, Stack, TextField, Typography} from "@mui/material";
import {SidebarCheckboxStyled} from "@features/sidebarCheckbox";
import React, {useCallback} from "react";
import _, {debounce} from "lodash";

import {useAppSelector} from "@lib/redux/hooks";
import {docTypes, leftActionBarSelector} from "@features/leftActionBar";

function DocumentFilter({...props}) {
    const {t, OnSearch} = props;

    const {query: filter} = useAppSelector(leftActionBarSelector);

    const onSearchChange = useCallback((value: any) => {
        OnSearch(value);
    }, [OnSearch]);

    const handleOnChange = (value: string) => {
        onSearchChange({
            document: {
                ...filter?.document,
                name: value.length >= 1 ? value : undefined
            }
        });
    }

    const debouncedOnChange = debounce(handleOnChange, 500);

    return (
        <>
            <InputLabel shrink>
                {t(`filter.name`)}
            </InputLabel>
            <FormControl
                component="form"
                fullWidth
                onSubmit={e => e.preventDefault()}>
                <TextField
                    fullWidth
                    defaultValue={filter?.document?.name ?? ""}
                    onChange={event => {
                        event.stopPropagation();
                        debouncedOnChange(event.target.value);
                    }}
                    placeholder={t(`filter.name-placeholder`)}
                />
            </FormControl>


            <InputLabel shrink sx={{mt: 2}}>
                {t(`filter.status`)}
            </InputLabel>

            {Object.entries(docTypes).map(type => <SidebarCheckboxStyled
                key={type[0]}
                component="label"
                htmlFor={type[0]}
                sx={{
                    "& .MuiSvgIcon-root": {
                        width: 16,
                        height: 16,
                    },
                }}
                styleprops={""}>

                <FormControlLabel
                    control={<Checkbox
                        size="small"
                        checked={filter?.document?.status?.includes(type[0]) ?? false}
                        onChange={(selected) => {
                            if (selected && !filter?.document?.status?.includes(type[0])) {
                                onSearchChange({
                                    document: {
                                        ...filter?.document,
                                        status: type[0] + (filter?.document?.status ? `,${filter?.document?.status}` : "")
                                    }
                                });
                            } else {
                                const sp = filter?.document?.status?.split(",") as string[];
                                sp?.splice(sp.findIndex((searchElement: string) => searchElement === type[0]), 1);
                                onSearchChange({
                                    document: {
                                        ...filter?.document,
                                        status: sp?.length > 0 ? sp?.join(",") : undefined
                                    }
                                });
                            }
                        }}
                        name={type[0]}
                    />} label={
                    <Stack direction={"row"} spacing={1.2} alignItems={"center"}>
                        {type[1].icon}
                        <Typography ml={1}>{t(`doc-status.${type[1].label}`)}</Typography>
                    </Stack>}/>
            </SidebarCheckboxStyled>)}
        </>
    )
}

export default DocumentFilter
