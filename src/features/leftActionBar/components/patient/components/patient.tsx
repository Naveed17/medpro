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
    AppointmentReasonsFilter, FilterOverview, InsuranceFilter,
    setFilter
} from "@features/leftActionBar";
import React, {useState} from "react";
import {useAppDispatch} from "@lib/redux/hooks";

import {LoadingScreen} from "@features/loadingScreen";
import {setSelectedRows} from "@features/table";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";

function Patient() {
    const dispatch = useAppDispatch();
    const {data: session} = useSession();

    const {collapse} = rightActionData.filter;
    const {t, ready} = useTranslation("patient", {keyPrefix: "config"});

    const {data: user} = session as Session;
    const isBeta = localStorage.getItem('newCashbox') ? localStorage.getItem('newCashbox') === '1' : user.medical_entity.hasDemo;

    const handleFilterChange = (data: any) => {
        window.history.replaceState({
            ...window.history.state,
            as: "/dashboard/patients?page=1",
            url: "/dashboard/patients?page=1"
        }, '', "/dashboard/patients?page=1");
        dispatch(setSelectedRows([]));
        dispatch(setFilter(data));
    }

    const [dataPatient, setDataPatient] = useState([
        {
            heading: {
                id: collapse[0].heading.title,
                icon: collapse[0].heading.icon,
                title: collapse[0].heading.title.toLowerCase(),
            },
            expanded: true,
            children: (
                <PatientFilter
                    {...{t}}
                    OnSearch={(data: { query: ActionBarState }) => {
                        handleFilterChange({patient: data.query});
                    }}
                    item={{
                        heading: {
                            icon: "ic-patient",
                            title: "patient",
                        },
                        textField: {
                            labels: [
                                {label: "name", placeholder: "search"},
                                {label: "birthdate", placeholder: "--/--/----"},
                            ],
                        },
                        gender: {
                            heading: "gender",
                            genders: ["male", "female"],
                        },
                        hasDouble: {
                            heading: "duplication"
                        },
                        ...(isBeta && {
                            rest: {
                                heading: "unPayed"
                            }
                        })
                    }}
                    keyPrefix={"filter."}
                />
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
                        handleFilterChange({patient: data.query});
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
            children: (<AppointmentReasonsFilter OnSearch={(data: any) => {
                handleFilterChange(data);
            }}/>)
        },
        {
            heading: {
                id: "meetingActs",
                icon: "ic-generaliste",
                title: "acts",
            },
            expanded: false,
            children: (<AppointmentActs OnSearch={(data: any) => {
                handleFilterChange(data);
            }}/>)
        },
        {
            heading: {
                id: "meetingDiseases",
                icon: "setting/medical-history",
                title: "disease",
            },
            expanded: false,
            children: (<AppointmentDisease OnSearch={(data: any) => {
                handleFilterChange(data);
            }}/>)
        },
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
                            handleFilterChange({patient: data.query});
                        }}
                        item={collapse[1]}
                        t={t}
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

export default Patient;
