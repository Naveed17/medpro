import {Typography} from "@mui/material";
import React from "react";
import {FilterContainerStyles} from "@features/leftActionBar";
import {useTranslation} from "next-i18next";
import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function Stats() {

    const {t, ready} = useTranslation("stats");

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <>
            <FilterContainerStyles>
                <Typography
                    variant="h6"
                    color="text.primary"
                    sx={{py: 1.48, pl: "10px", mb: "0.21em"}}
                    gutterBottom>
                    {t(`filter.title`)}
                </Typography>
            </FilterContainerStyles>
        </>
    )
}

export default Stats
