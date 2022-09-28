import React from "react";
// hook
import {useTranslation} from "next-i18next";

// material
import {Box, Typography, Paper, Grid, Skeleton} from "@mui/material";

// dumy data
const data = {
    personal: [
        // {
        //   name: "group",
        //   value: "groupe x",
        // },
        // {
        //   name: "region",
        //   value: "Ariana",
        // },
        // {
        //   name: "civility",
        //   value: "Mr",
        // },
        {
            name: "address"
        },
        {
            name: "name"
        },
        // {
        //   name: "zip",
        //   value: "1004",
        // },
        {
            name: "birthdate"
        },
        // {
        //   name: "assurance",
        //   value: "",
        // },
        {
            name: "telephone"
        },
        // {
        //   name: "cin",
        //   value: "",
        // },
        {
            name: "email"
        },
        // {
        //   name: "from",
        //   value: "",
        // },
    ],
};

function PersonalInfo({...props}) {
    const {patient, loading} = props;
    const {t, ready} = useTranslation("patient", {keyPrefix: "config.add-patient"});
    console.log(patient);
    if (!ready) return <div>Loading...</div>;
    return (
        <Box>
            <Typography
                variant="body1"
                color="text.primary"
                fontFamily="Poppins"
                sx={{my: 1}}
            >
                {loading ? (
                    <Skeleton variant="text" sx={{maxWidth: 200}}/>
                ) : (
                    t("personal-info")
                )}
            </Typography>
            <Paper sx={{p: 1.5, borderWidth: 0}}>
                <Grid container spacing={1.2}>
                    {data.personal.map((v) => (
                        <React.Fragment key={Math.random()}>
                            <Grid item md={3} sm={6} xs={6}>
                                <Typography variant="body1" color="text.secondary" noWrap>
                                    {t(v.name)}
                                </Typography>
                            </Grid>
                            <Grid item md={3} sm={6} xs={6}>
                                <Typography variant="body1" color="text.primary" noWrap>
                                    {loading ? (
                                        <Skeleton variant="text"/>
                                    ) : v.name === "name" ? (
                                        <>
                                            {patient.firstName} {patient.firstName}
                                        </>
                                    ) : v.name === "telephone" ? (
                                        <>
                                            {(patient.contact.length > 0 && patient.contact[0].value) || "-"}
                                        </>
                                    ) : v.name === "address" ? (
                                        <>
                                            {patient.address[0] ? patient.address[0].city.name + ', ' + patient.address[0].street : "-"}
                                        </>
                                    ) : (
                                        patient[v.name]
                                    )}
                                </Typography>
                            </Grid>
                        </React.Fragment>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
}

export default PersonalInfo;
