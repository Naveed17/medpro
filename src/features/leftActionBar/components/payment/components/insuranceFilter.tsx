import React, {useEffect, useState} from "react";
import {useRequest} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useRouter} from "next/router";
import {Avatar, Box, Checkbox, FormControl, MenuItem, TextField, Typography} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import {useAppSelector} from "@app/redux/hooks";
import {leftActionBarSelector} from "@features/leftActionBar";
import {MuiAutocompleteSelectAll} from "@features/muiAutocompleteSelectAll";


function InsuranceFilter({...props}) {
    const {t, OnSearch} = props;

    const router = useRouter();

    const {query: filterData} = useAppSelector(leftActionBarSelector);

    const {data: httpInsuranceResponse} = useRequest({
        method: "GET",
        url: "/api/public/insurances/" + router.locale,
    }, SWRNoValidateConfig);

    const insurancesData = (httpInsuranceResponse as HttpResponse)?.data as InsuranceModel[];

    const [queryState, setQueryState] = useState<any>({
        insurance: []
    });

    const selectedAll = queryState.insurance.length === insurancesData?.length;

    const handleInsuranceChange = (insurances: any[]) => {
        setQueryState({
            insurance: insurances
        });

        if (insurances.length === 0) {
            OnSearch({
                query: {
                    ...queryState,
                    insurance: null
                }
            });
        } else {
            OnSearch({
                query: {
                    ...queryState,
                    insurance: insurances.map(insurance => insurance.uuid)
                }
            });
        }
    }

    useEffect(() => {
        if (filterData?.payment && filterData?.payment?.insurance) {
            setQueryState({
                insurance: insurancesData.filter(insurance => filterData?.payment?.insurance?.includes(insurance.uuid))
            });
        }
    }, [filterData]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Box>
            <MuiAutocompleteSelectAll.Provider
                value={{
                    onSelectAll: (selectedAll) => void setQueryState({insurance: selectedAll ? [] : insurancesData}),
                    selectedAll,
                    indeterminate: !!queryState.insurance.length && !selectedAll,
                }}
            >
                <Autocomplete
                    size={"small"}
                    id={"assurance"}
                    multiple
                    autoHighlight
                    filterSelectedOptions
                    limitTags={3}
                    noOptionsText={"Aucune assurance"}
                    ListboxComponent={MuiAutocompleteSelectAll.ListBox}
                    value={queryState.insurance ? queryState.insurance : []}
                    onChange={(event, value) => handleInsuranceChange(value)}
                    options={insurancesData ? insurancesData : []}
                    getOptionLabel={option => option?.name ? option.name : ""}
                    isOptionEqualToValue={(option: any, value) => option.name === value.name}
                    renderOption={(params, option, { selected }) => (
                        <MenuItem
                            {...params}>
                            <Checkbox checked={selected} />
                            <Avatar
                                sx={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: 0.4
                                }}
                                alt={"insurance"}
                                src={option.logoUrl}
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

export default InsuranceFilter;
