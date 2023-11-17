import {
    Autocomplete,
    Box,
    Card,
    CardContent,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography
} from '@mui/material'
import {useTranslation} from 'next-i18next'
import React, {createRef, useCallback, useRef, useState} from 'react';
import dynamic from "next/dynamic";
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {arrayUniqueByKey} from "@lib/hooks";
import Icon from "@themes/urlIcon";
import {debounce} from "lodash";
import SearchIcon from "@mui/icons-material/Search";

import {LoadingScreen} from "@features/loadingScreen";;

function AddTreatmentDialog({...props}) {
    const {data} = props;
    const router = useRouter();
    const autocompleteTextFieldRef = useRef<HTMLInputElement>(null);

    const [drugsList, setDrugsList] = useState<DrugModel[]>([]);
    const [drug] = useState<string | null>("");
    const [traitments, setTraitments] = useState<DrugModel[]>([]);
    const [anchorElPopover, setAnchorElPopover] = useState<HTMLDivElement | null>(null);

    const textFieldRef = createRef<HTMLDivElement>();
    const openPopover = Boolean(anchorElPopover);

    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})

    const {trigger: triggerDrugsGet} = useRequestQueryMutation("/drugs/get");

    const addTraitment = (event: any, newValue: any) => {
        if (newValue) {
            let selectedDrug = newValue.inputValue ? {
                uuid: '',
                commercial_name: newValue.inputValue,
                isVerified: false
            } : newValue;

            setTraitments([(selectedDrug as DrugModel),...traitments]);
            data.setState([...data.state, {
                uuid: selectedDrug.uuid,
                name: selectedDrug.commercial_name,
                isVerified: selectedDrug.isVerified
            }])
        }
    }

    const debouncedOnChange = debounce(addTraitment, 500);

    const searchInDrug = (value: string) => {
        if (value.length >= 2) {
            triggerDrugsGet({
                method: "GET",
                url: `/api/drugs/${router.locale}?name=${value}`
            }, {
                onSuccess: (cnx: any) => cnx?.data && setDrugsList((cnx.data as HttpResponse)?.data ?? [])
            });
        }
    }
    const handleClickPopover = useCallback(() => {
        setAnchorElPopover(textFieldRef.current);
    }, [textFieldRef]);

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <Stack spacing={1}>
            <Box>
                {drugsList && openPopover ? <Autocomplete
                        size={"small"}
                        value={drug}
                        onInputChange={(event, value) => searchInDrug(value)}
                        onChange={(event, newValue) => {
                            debouncedOnChange(event, newValue);
                            setAnchorElPopover(null);
                        }}
                        filterOptions={(options, params) => {
                            const {inputValue} = params;
                            const filtered = options.filter(option =>
                                [option.commercial_name.toLowerCase()].some(option => option?.includes(inputValue.toLowerCase())));
                            // Suggest the creation of a new value
                            const isExisting = options.some((option) => inputValue.toLowerCase() === option.commercial_name);
                            if (inputValue !== '' && !isExisting) {
                                filtered.push({
                                    inputValue,
                                    commercial_name: `${t('add')} "${inputValue}"`,
                                });
                            }
                            return filtered;
                        }}
                        selectOnFocus
                        clearOnEscape
                        handleHomeEndKeys
                        freeSolo
                        id="sheet-solo-balance"
                        options={arrayUniqueByKey("name", drugsList)}
                        getOptionLabel={(option) => {
                            // Value selected with enter, right from the input
                            if (typeof option === 'string') {
                                return option;
                            }
                            // Add "xxx" option created dynamically
                            if (option.inputValue) {
                                return option.inputValue;
                            }
                            // Regular option
                            return option.commercial_name;
                        }}
                        renderOption={(props, option) => <li {...props}
                                                             key={option.uuid ? option.uuid : "-1"}>{option.commercial_name}</li>}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                autoFocus
                                inputRef={autocompleteTextFieldRef}
                                label={t('placeholder_drug_name')}/>
                        )}
                    /> :
                    <TextField
                        className={"MuiInputBase-input-hidden"}
                        size={"small"}
                        ref={textFieldRef}
                        onClick={handleClickPopover}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <SearchIcon/>
                            </InputAdornment>,
                        }}
                        placeholder={t('placeholder_medical_imagery')}
                        fullWidth/>}
            </Box>

            {traitments.length > 0 && <Typography>{t('traitments')}</Typography>}
            <Stack spacing={1}>
                {
                    traitments.map(traitment => (
                        <Card key={traitment.uuid}>
                            <CardContent style={{padding: 10}}>
                                <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                    <Typography>{traitment.commercial_name}</Typography>
                                    <IconButton size="small" onClick={() => {
                                        setTraitments([...traitments.filter(t => t.uuid !== traitment.uuid)])
                                        data.setState([...data.state.filter((t: {
                                            uuid: string
                                        }) => t.uuid !== traitment.uuid)])
                                    }}>
                                        <Icon path="setting/icdelete"/>
                                    </IconButton>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))
                }
            </Stack>
        </Stack>
    )
}

export default AddTreatmentDialog
