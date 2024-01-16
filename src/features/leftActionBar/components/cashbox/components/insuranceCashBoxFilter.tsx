import React, {useEffect, useState} from "react";
import {Box, Checkbox, FormControl, MenuItem, TextField, Typography} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import {useAppSelector} from "@lib/redux/hooks";
import {cashBoxSelector} from "@features/leftActionBar";
import {MuiAutocompleteSelectAll} from "@features/muiAutocompleteSelectAll";
import {useInsurances} from "@lib/hooks/rest";
import {ImageHandler} from "@features/image";

function InsuranceCashBoxFilter({...props}) {
    const {t, OnSearch} = props;

    const {insurances: insurancesData} = useInsurances();

    const {insurances} = useAppSelector(cashBoxSelector);

    const [queryState, setQueryState] = useState<any>({
        insurances: []
    });

    const selectedAll = queryState.insurances.length === insurancesData?.length;

    const handleInsuranceChange = (insurances: any[]) => {
        setQueryState({
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
                    insurances
                }
            });
        }
    }

    const handleSelectAll = (insurances: any): void => {
        setQueryState(insurances);
        handleInsuranceChange(insurances.insurance);
    }

    useEffect(() => {
        if (insurances) {
            setQueryState({insurances});
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
        </Box>)
}

export default InsuranceCashBoxFilter;
