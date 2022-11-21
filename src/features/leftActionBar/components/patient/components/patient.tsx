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
import {LoadingScreen} from "@features/loadingScreen";

function Patient() {
    const {collapse} = rightActionData.filter;
    const {t, ready} = useTranslation("patient");
    const dispatch = useAppDispatch();

    const data = collapse.map((item) => {
        return {
            heading: {
                id: item.heading.title,
                icon: item.heading.icon,
                title: t(item.heading.title.toLowerCase()),
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
                                        {label: "phone", placeholder: "phone"},
                                    ],
                                },
                            }}
                            keyPrefix={"filter."}
                            t={t}/>
                    ) : item.heading.title === "place" && (
                        <PlaceFilter
                            OnSearch={(data: { query: ActionBarState }) => {
                                dispatch(setFilter({patient: data.query}));
                            }}
                            item={item}
                            t={t} keyPrefix={"filter."}/>
                    )
                        // :(
                        // <AppointmentFilter
                        //     OnSearch={(data: { query: ActionBarState }) => {
                        //         dispatch(setFilter({patient: data.query}));
                        //     }}
                        //     item={item}
                        //     t={t}
                        //     ready={ready} keyPrefix={"filter."}/>)
                    }
                </FilterRootStyled>
            ),
        };
    });
    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <div>
            <FilterContainerStyles>
                <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{py: 5, pl: "10px", mb: "0.21em"}}
                    gutterBottom
                >
                    {t(`filter.title`)}
                </Typography>
                <Accordion translate={{t, ready}} data={data} defaultValue={"patient"}/>
            </FilterContainerStyles>
        </div>
    );
}

export default Patient;
