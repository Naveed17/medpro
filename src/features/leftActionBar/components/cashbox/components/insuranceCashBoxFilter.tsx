import React, {useEffect, useState} from "react";
import {Box, Checkbox, FormControl, FormControlLabel, MenuItem, TextField, Typography} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import {useAppSelector} from "@lib/redux/hooks";
import {cashBoxSelector} from "@features/leftActionBar";
import {MuiAutocompleteSelectAll} from "@features/muiAutocompleteSelectAll";
import {useInsurances} from "@lib/hooks/rest";
import {ImageHandler} from "@features/image";
import Switch from "@mui/material/Switch";

function InsuranceCashBoxFilter({...props}) {
    const {t, OnSearch} = props;

    const {insurances: insurancesData} = useInsurances();

    const {insurances} = useAppSelector(cashBoxSelector);

    const [queryState, setQueryState] = useState<any>({
        hasNoInsurance: false,
        insurances: []
    });

    const selectedAll = queryState.insurances.length === insurancesData?.length;

    const handleInsuranceChange = (insurances: any[]) => {
        setQueryState({
            ...queryState,
            ...(insurances.length > 0 && {hasNoInsurance: false}),
            insurances
        });

        if (insurances.length === 0) {
            OnSearch({
                query: {
                    ...queryState,
                    insurances: null
                }
            });
        } else {
            OnSearch({
                query: {
                    ...queryState,
                    hasNoInsurance: false,
                    insurances
                }
            });
        }
    }

    const handleSelectAll = (insurances: any): void => {
        setQueryState({...queryState, insurances});
        handleInsuranceChange(insurances.insurance);
    }

    useEffect(() => {
        if (insurances) {
            setQueryState({...queryState, insurances});
        }
    }, [insurances]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Box>
            <MuiAutocompleteSelectAll.Provider
                value={{
                    onSelectAll: (selectedAll) => void handleSelectAll({insurance: selectedAll ? [] : insurancesData}),
                    selectedAll,
                    indeterminate: !!queryState.insurances.length && !selectedAll,
                }}>
                <Autocomplete
                    size={"small"}
                    id={"assurance"}
                    multiple
                    autoHighlight
                    disabled={queryState.hasNoInsurance}
                    filterSelectedOptions
                    limitTags={3}
                    noOptionsText={"Aucune assurance"}
                    ListboxComponent={MuiAutocompleteSelectAll.ListBox}
                    value={queryState.insurances?.length > 0 ? queryState.insurances : []}
                    onChange={(event, value) => handleInsuranceChange(value)}
                    options={insurancesData ?? []}
                    getOptionLabel={option => option?.name ? option.name : ""}
                    isOptionEqualToValue={(option: any, value) => option.name === value.name}
                    renderOption={(params, option, {selected}) => (
                        <MenuItem
                            {...params}>
                            <Checkbox checked={selected}/>
                            <ImageHandler
                                alt={"insurance"}
                                src={option.logoUrl.url}
                            />
                            <Typography
                                sx={{ml: 1}}>{option.name}</Typography>
                        </MenuItem>)}
                    renderInput={(params) => (
                        <FormControl component="form" fullWidth>
                            <TextField color={"info"}
                                       {...params}
                                       sx={{paddingLeft: 0}}
                                       placeholder={t("assurance-placeholder")}
                                       variant="outlined"
                            />
                        </FormControl>)}
                />
            </MuiAutocompleteSelectAll.Provider>
            <>
                <Typography variant="body2" color="text.secondary" mt={1}>
                    {t("is_not_insured_patient")}
                </Typography>

                <FormControlLabel
                    sx={{
                        ml: .2,
                        my: 1,
                        '& .MuiSwitch-thumb': {
                            boxShadow: theme => theme.customShadows.filterButton,
                            width: 16,
                            height: 16,
                        }
                    }}
                    control={
                        <Switch
                            color="warning"
                            size="small"
                            checked={queryState.hasNoInsurance}
                            onChange={event => {
                                setQueryState({...queryState, hasNoInsurance: event.target.checked});
                                OnSearch({
                                    query: {
                                        ...queryState,
                                        ...(event.target.checked && {insurances: null}),
                                        hasNoInsurance: event.target.checked
                                    }
                                });
                            }}
                        />}
                    label={<Typography sx={{fontSize: 12}}> {t(`is_not_insured`)}</Typography>}/>
            </>
        </Box>)
}

export default InsuranceCashBoxFilter;
