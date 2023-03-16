import React, {useEffect, useState} from "react";
import {useRequest} from "@app/axios";
import {SWRNoValidateConfig} from "@app/swr/swrProvider";
import {useRouter} from "next/router";
import {Autocomplete, Avatar, Box, FormControl, MenuItem, TextField, Typography} from "@mui/material";
import _ from "lodash";
import {useAppSelector} from "@app/redux/hooks";
import {leftActionBarSelector} from "@features/leftActionBar";

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

    const handleInsuranceChange = (insurances: any[]) => {
        setQueryState({
            insurance: insurances
        });

        if (insurances.length === 0) {
            const query = _.omit(queryState, "insurance");
            OnSearch({
                query: {
                    ...query
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
            <Autocomplete
                size={"small"}
                id={"assurance"}
                multiple
                autoHighlight
                filterSelectedOptions
                value={queryState.insurance ? queryState.insurance : []}
                onChange={(event, value) => handleInsuranceChange(value)}
                options={insurancesData ? insurancesData : []}
                getOptionLabel={option => option?.name ? option.name : ""}
                isOptionEqualToValue={(option: any, value) => option.name === value.name}
                renderOption={(params, option) => (
                    <MenuItem
                        {...params}>
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
        </Box>)
}

export default InsuranceFilter;
