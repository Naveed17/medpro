import {Typography} from "@mui/material";
import {Accordion} from "@features/accordion";
import rightActionData from "./data";
import {useTranslation} from "next-i18next";
import {
    FilterContainerStyles,
    FilterRootStyled,
    PatientFilter,
    PlaceFilter,
} from "./overrides";
import {
    ActionBarState,
    AppointmentActs,
    AppointmentDisease,
    AppointmentReasonsFilter, InsuranceFilter, leftActionBarSelector,
    setFilter
} from "@features/leftActionBar";
import React, {useState} from "react";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {LoadingScreen} from "@features/loadingScreen";
import {useRouter} from "next/router";
import {setSelectedRows} from "@features/table";

function Patient() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const {collapse} = rightActionData.filter;
    const {t, ready} = useTranslation("patient", {keyPrefix: "config"});
    const {query: filter} = useAppSelector(leftActionBarSelector);

    const [opened, setOpend] = useState("patient");
    const [dataPatient, setDataPatient] = useState([
        {
            heading: {
                id: collapse[0].heading.title,
                icon: collapse[0].heading.icon,
                title: collapse[0].heading.title.toLowerCase(),
            },
            expanded: true,
            children: (
                <FilterRootStyled>
                    <PatientFilter
                        OnSearch={(data: { query: ActionBarState }) => {
                            router
                                .replace("/dashboard/patient?page=1", "/dashboard/patient", {
                                    shallow: true,
                                })
                                .then(() => {
                                    dispatch(setSelectedRows([]));
                                    dispatch(setFilter({patient: data.query}));
                                });
                        }}
                        item={{
                            heading: {
                                icon: "ic-patient",
                                title: "patient",
                            },
                            hasDouble: {
                                heading: "duplication"
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
                        t={t}
                    />
                </FilterRootStyled>
            ),
        },
        {
            heading: {
                id: "insurance",
                icon: "ic-assurance",
                title: "insurance",
            },
            expanded: false,
            children: (
                <InsuranceFilter
                    {...{t}}
                    OnSearch={(data: { query: any }) => {
                        dispatch(setFilter({
                            ...filter,
                            patient: {
                                ...filter?.patient,
                                ...(data.query.insurance && {insurances: data.query.insurance.join(",")})
                            }
                        }));
                    }}/>
            ),
        },
        {
            heading: {
                id: "meetingReason",
                icon: "setting/ic-patient-file",
                title: "reason_for_consultation",
            },
            expanded: false,
            children: (<AppointmentReasonsFilter/>)
        },
        {
            heading: {
                id: "meetingActs",
                icon: "ic-generaliste",
                title: "acts",
            },
            expanded: false,
            children: (<AppointmentActs/>)
        },
        {
            heading: {
                id: "meetingDiseases",
                icon: "setting/medical-history",
                title: "disease",
            },
            expanded: false,
            children: (<AppointmentDisease/>)
        }
    ]);

    const [dataPlace, setDataPlace] = useState([
        {
            heading: {
                id: collapse[1].heading.title,
                icon: collapse[1].heading.icon,
                title: collapse[1].heading.title.toLowerCase(),
            },
            expanded: false,
            children: (
                <FilterRootStyled>
                    <PlaceFilter
                        OnSearch={(data: { query: ActionBarState }) => {
                            router
                                .replace("/dashboard/patient?page=1", "/dashboard/patient", {
                                    shallow: true,
                                })
                                .then(() => {
                                    dispatch(setFilter({patient: data.query}));
                                });
                            dispatch(setFilter({patient: data.query}));
                        }}
                        item={collapse[1]}
                        setOpend={(ev: string) => {
                            setOpend(ev);
                        }}
                        t={t}
                        keyPrefix={"filter."}
                    />
                </FilterRootStyled>
            ),
        },
    ]);

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <div>
            <FilterContainerStyles>
                <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{py: 5, pl: "10px", mb: "0.21em"}}
                    gutterBottom>
                    {t(`filter.title`)}
                </Typography>
                <Accordion
                    translate={{t, ready}}
                    data={dataPatient}
                    setData={setDataPatient}
                />
                <Accordion
                    translate={{t, ready}}
                    data={dataPlace}
                    setData={setDataPlace}
                />
            </FilterContainerStyles>
        </div>
    );
}

export default Patient;
