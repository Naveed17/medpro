import {Typography} from "@mui/material";
import {Accordion} from "@features/accordion";
import rightActionData from "./data";
import {useTranslation} from "next-i18next";
import {
    AppointmentFilter,
    PlaceFilter,
    PatientFilter,
    FilterContainerStyles,
    FilterRootStyled,
} from "./overrides";
import {ActionBarState, setFilter} from "@features/leftActionBar";
import React from "react";
import {useAppDispatch} from "@app/redux/hooks";

function Patient() {
    const {collapse} = rightActionData.filter;
    const {t, ready} = useTranslation("patient", {keyPrefix: 'filter'});
    const dispatch = useAppDispatch();

    const data = collapse.map((item) => {
        return {
            heading: {
                id: item.heading.title,
                icon: item.heading.icon,
                title: t(`${item.heading.title}`),
            },
            children: (
                <FilterRootStyled>
                    {item.heading.title === "patient" ? (
                        <PatientFilter
                            OnSearch={(data: { query: ActionBarState }) => {
                                dispatch(setFilter({patient: data.query}));
                            }}
                            item={{
                                heading: {
                                    icon: "ic-patient",
                                    title: "patient",
                                },
                                gender: {
                                    heading: "gender",
                                    genders: ["male", "female"],
                                },
                                textField: {
                                    labels: [
                                        {label: "name", placeholder: "name"},
                                        {label: "birthdate", placeholder: "--/--/----"},
                                        {label: "phone", placeholder: "telephone"},
                                    ],
                                },
                            }} t={t}/>
                    ) : item.heading.title === "place" ? (
                        <PlaceFilter item={item} t={t}/>
                    ) : (
                        <AppointmentFilter item={item} t={t}/>
                    )}
                </FilterRootStyled>
            ),
        };
    });

    if (!ready) return <>loading translations...</>;

    return (
        <div>
            <FilterContainerStyles>
                <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{py: 5, pl: "10px", mb: "0.21em"}}
                    gutterBottom
                >
                    {t(`title`)}
                </Typography>
                <Accordion translate={{t, ready}} badge={null} data={data} defaultValue={"Patient"}/>
            </FilterContainerStyles>
        </div>
    );
}

export default Patient;
