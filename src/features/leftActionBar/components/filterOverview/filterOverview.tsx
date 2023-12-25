import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {leftActionBarSelector, setFilter} from "@features/leftActionBar";
import {Box, Chip, Stack, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import {LoadingScreen} from "@features/loadingScreen";
import FilterOverviewStyled from "./overrides/filterOverviewStyled";
import CloseIcon from "@mui/icons-material/Close";
import _ from "lodash";
import {dashLayoutSelector} from "@features/base";
import {AppointmentStatus} from "@features/calendar";
import {useCountries, useInsurances} from "@lib/hooks/rest";
import {flattenObject, unflattenObject} from "@lib/hooks";
import {useRequestQuery} from "@lib/axios";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useRouter} from "next/router";

function FilterOverview() {
    const dispatch = useAppDispatch();
    const {insurances: allInsurances} = useInsurances();
    const {countries} = useCountries();
    const router = useRouter();

    const {t, ready} = useTranslation("common");
    const {appointmentTypes} = useAppSelector(dashLayoutSelector);
    const {query: filter} = useAppSelector(leftActionBarSelector);

    const [filterData, setFilterData] = useState<FilterModel[]>([]);

    const handleDelete = (data: FilterModel) => {
        if (filter) {
            let queryGlobal = null;
            switch (data.parent) {
                case "patient":
                    queryGlobal = _.omit((filter as any)[data.parent], [data.key]);
                    break;
                case "type":
                    const sp = filter?.type?.split(",") as string[];
                    sp?.splice(sp.findIndex((searchElement: string) => searchElement === data.key), 1);
                    queryGlobal = sp?.length > 0 ? sp?.join(",") : undefined;
                    break;
                case "patient.insurances":
                    const spInsurances = filter?.patient?.insurances?.split(",") as string[];
                    spInsurances?.splice(spInsurances.findIndex((searchElement: string) => searchElement === data.key), 1);
                    queryGlobal = spInsurances?.length > 0 ? spInsurances?.join(",") : undefined;
                    break;
                case "status":
                    const statusSearch = filter?.status?.split(",") as string[];
                    statusSearch?.splice(statusSearch.findIndex((searchElement: string) => AppointmentStatus[searchElement].key === data.key), 1);
                    queryGlobal = data?.key !== "ONLINE" && (statusSearch?.length > 0 ? statusSearch?.join(",") : undefined);
                    break;
            }
            if (["patient", "type", "status"].includes(data.parent)) {
                dispatch(setFilter({[data.parent]: queryGlobal}));
            } else {
                dispatch(setFilter(unflattenObject({
                    ...flattenObject(filter),
                    [data.parent]: queryGlobal
                })));
            }
        }
    }

    const getLabel = (key: string, value: any) => {
        switch (key) {
            case "gender":
                return value === "M" ? "Male" : "Female";
            case "hasDouble":
                return t("duplication");
            case "rest":
                return t("unpaid");
            case "insurances":
                return allInsurances?.find((insurance: any) => insurance.uuid === value)?.name;
            case "country":
                return countries.find(country => country.uuid === value)?.name;
            case "states":
                return "";
            default:
                return value
        }
    }

    useEffect(() => {
        if (filter) {
            let filters: any[] = [];
            Object.entries(filter).forEach((filterItem) => {
                if (filterItem[1]) {
                    switch (filterItem[0]) {
                        case "patient":
                            filters.push(...Object.entries(filterItem[1]).reduce(
                                (filtered: any[], item: any[]) => item[1] ?
                                    [
                                        ...(filtered ?? []),
                                        ...(typeof item[1] === "string" ?
                                            item[1].split(',').map((patientData: any) => (
                                                {
                                                    parent: `${filterItem[0]}.${item[0]}`,
                                                    key: patientData,
                                                    value: getLabel(item[0], patientData)
                                                }
                                            ))
                                            :
                                            [
                                                {
                                                    parent: filterItem[0],
                                                    key: item[0],
                                                    value: getLabel(item[0], item[1])
                                                }
                                            ])
                                    ]
                                    : (filtered ?? []), []));
                            break;
                        case "type":
                            filters.push(...(filterItem[1] as string).split(',').map(type => ({
                                parent: filterItem[0],
                                key: type,
                                value: appointmentTypes?.find(typeItem => typeItem.uuid === type)?.name ?? ""
                            })));
                            break;
                        case "status":
                            filters.push(...(filterItem[1] as string).split(',').map(status => ({
                                parent: filterItem[0],
                                key: AppointmentStatus[status]?.key,
                                value: AppointmentStatus[status]?.value
                            })));
                            break;
                    }
                }
            });
            setFilterData(filters)
        }
    }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (filterData.length > 0 &&
        <FilterOverviewStyled>
            <Box sx={{display: "flex", alignItems: "center"}}>
                <Typography
                    variant="body1"
                    ml={1}>
                    {t("filter.applied-filters")}
                </Typography>
            </Box>
            <Stack direction="row" flexWrap="wrap" className={"filtered-label"} spacing={1}>
                {filterData.map((data: any, index: number) => data.value?.length > 0 && <Chip
                    size={"small"}
                    key={`filter-${index}`}
                    label={data.value}
                    color="primary"
                    deleteIcon={<CloseIcon/>}
                    onDelete={() => handleDelete(data)}
                />)}
            </Stack>
        </FilterOverviewStyled>)
}

export default FilterOverview;
