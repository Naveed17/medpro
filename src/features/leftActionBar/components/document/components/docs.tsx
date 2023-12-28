import {Typography} from "@mui/material";
import React, {useState} from "react";
import {DocumentFilter, FilterContainerStyles, setFilter} from "@features/leftActionBar";
import {useTranslation} from "next-i18next";
import {Accordion} from "@features/accordion";
import {useAppDispatch} from "@lib/redux/hooks";

import {LoadingScreen} from "@features/loadingScreen";

function Docs() {
    const dispatch = useAppDispatch();

    const {t, ready} = useTranslation(["docs"]);

    const [dataPatient, setDataPatient] = useState([
        {
            heading: {
                id: 'title',
                title: 'filter.caption',
            },
            expanded: true,
            children: (
                <DocumentFilter
                    {...{t}}
                    OnSearch={(data: { query: any }) => {
                        window.history.replaceState({
                            ...window.history.state,
                            as: "/dashboard/documents?page=1",
                            url: "/dashboard/documents?page=1"
                        }, '', "/dashboard/documents?page=1");
                        dispatch(setFilter(data));
                    }}/>
            )
        }
    ]);

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <>
            <FilterContainerStyles>
                <Typography
                    variant={"h6"}
                    color="text.primary"
                    sx={{py: 1.48, pl: "10px", mb: "0.21em"}}
                    gutterBottom>
                    {t(`filter.sub-title`)}
                </Typography>
                <Accordion
                    translate={{t, ready}}
                    data={dataPatient}
                    setData={setDataPatient}
                />
            </FilterContainerStyles>
        </>
    )
}

export default Docs;
