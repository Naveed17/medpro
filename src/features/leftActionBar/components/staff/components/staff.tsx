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

function Staff() {
    const dispatch = useAppDispatch();

    const {t, ready} = useTranslation("staff");


    const handleFilterChange = (data: any) => {
        window.history.replaceState({
            ...window.history.state,
            as: "/admin/staff?page=1",
            url: "/admin/staff?page=1"
        }, '', "/admin/staff?page=1");
        dispatch(setSelectedRows([]));
        dispatch(setFilter(data));
    }

    const [dataPatient, setDataPatient] = useState([
        {
            heading: {
                id: "staff",
                icon: "ic-staff",
                title: "filter.staff",
            },
            expanded: true,
            children: (
                <FilterRootStyled>
                    <PatientFilter
                        {...{t}}
                        OnSearch={(data: { query: ActionBarState }) => {
                            handleFilterChange({patient: data.query});
                        }}
                        item={{
                            heading: {
                                icon: "ic-staff",
                                title: "staff",
                            },
                            gender: {
                                heading: "gender",
                                genders: ["male", "female"],
                            },
                            textField: {
                                labels: [
                                    {label: "name", placeholder: "search"},
                                    {label: "birthdate", placeholder: "--/--/----"},
                                ],
                            },
                        }}
                        keyPrefix={"filter."}
                    />
                </FilterRootStyled>
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
                    data={dataPatient}
                    setData={setDataPatient}
                />
            </FilterContainerStyles>
        </>
    );
}

export default Staff;
