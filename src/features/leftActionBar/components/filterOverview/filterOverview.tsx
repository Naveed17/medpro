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

function FilterOverview() {
    const dispatch = useAppDispatch();

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
                case "status":
                    const statusSearch = filter?.status?.split(",") as string[];
                    statusSearch?.splice(statusSearch.findIndex((searchElement: string) => AppointmentStatus[searchElement].key === data.key), 1);
                    queryGlobal = data?.key !== "ONLINE" && (statusSearch?.length > 0 ? statusSearch?.join(",") : undefined);
                    break;
            }
            dispatch(setFilter({[data.parent]: queryGlobal}));
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
                                (filtered: any[], item: any[]) => item[1] ? [...(filtered ?? []), {
                                    parent: filterItem[0],
                                    key: item[0],
                                    value: getLabel(item[0], item[1])
                                }] : (filtered ?? []), []));
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
                {filterData.map((data: any, index: number) => (<Chip
                    size={"small"}
                    key={`filter-${index}`}
                    label={data.value}
                    color="primary"
                    deleteIcon={<CloseIcon/>}
                    onDelete={() => handleDelete(data)}
                />))}
            </Stack>
        </FilterOverviewStyled>)
}

export default FilterOverview;
