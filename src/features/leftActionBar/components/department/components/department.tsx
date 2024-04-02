import {Typography} from "@mui/material";
import {Accordion} from "@features/accordion";
import {useTranslation} from "next-i18next";
import {
    ActionBarState, FilterContainerStyles, FilterOverview, FilterRootStyled, PatientFilter,
    setFilter
} from "@features/leftActionBar";
import React, {useState} from "react";
import {useAppDispatch} from "@lib/redux/hooks";
import {LoadingScreen} from "@features/loadingScreen";
import {setSelectedRows} from "@features/table";
import DepartmentFilter from "@features/leftActionBar/components/department/components/departmentFilter";

function Department() {
    const dispatch = useAppDispatch();

    const {t, ready} = useTranslation("departments", {keyPrefix: "config"});


    const handleFilterChange = (data: any) => {
        window.history.replaceState({
            ...window.history.state,
            as: "/admin/departments?page=1",
            url: "/admin/departments?page=1"
        }, '', "/admin/departments?page=1");
        dispatch(setSelectedRows([]));
        dispatch(setFilter(data));
    }

    const [filterData, setFilterData] = useState([
        {
            heading: {
                id: "departments",
                icon: "ic-departments",
                title: "filter.departments",
            },
            expanded: true,
            children: (
                <DepartmentFilter {...{t}}/>
            ),
        }
    ]);

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <>
            <FilterContainerStyles>
                <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{py: 1.38, pl: "10px", mb: "0.20em"}}
                    gutterBottom>
                    {t(`filter.title`)}
                </Typography>
                <FilterOverview/>
                <Accordion
                    translate={{t, ready}}
                    data={filterData}
                    setData={setFilterData}
                />
            </FilterContainerStyles>
        </>
    );
}

export default Department;
