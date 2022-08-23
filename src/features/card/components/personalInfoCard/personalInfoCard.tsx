import React from "react";
// hook
import {useTranslation} from "next-i18next";

// material
import {Box, Typography, Paper, Grid} from "@mui/material";
import {useAppSelector} from "@app/redux/hooks";
import {tableActionSelector} from "@features/table";

const data: any = {
    personal: [{
        name: "",
        value: "",
    }]
};

function PersonalInfo() {
    const {t, ready} = useTranslation("patient", {keyPrefix: "add-patient"});
    const {patient} = useAppSelector(tableActionSelector);
    if (patient)
        data.personal = [
            {
                name: "group",
                value: "-",
            },
            {
                name: "region",
                value: "-",
            },
            {
                name: "civility",
                value: patient.gender,
            },
            {
                name: "address",
                value: "-",
            },
            {
                name: "name",
                value: patient.firstName + ' ' + patient.lastName,
            },
            {
                name: "zip",
                value: "-",
            },
            {
                name: "date-of-birth",
                value: patient.birthdate
            },
            {
                name: "assurance",
                value: "-",
            },
            {
                name: "telephone",
                value: patient.contact[0].value,
            },
            {
                name: "cin",
                value: "-",
            },
            {
                name: "email",
                value: patient.email,
            },
            {
                name: "from",
                value: "-",
            },
        ]
    if (!ready) return <div>Loading...</div>;

    return (
        <Box>
            <Typography
                variant="body1"
                color="text.primary"
                fontFamily="Poppins"
                sx={{my: 1}}
            >
                {t("personal-info")}
            </Typography>
            <Paper sx={{p: 1.5, borderWidth: 0}}>
                <Grid container spacing={1.2}>
                    {data.personal.map((v: { name: string, value: string }) => (
                        <React.Fragment key={Math.random()}>
                            <Grid item md={3} sm={6} xs={6}>
                                <Typography variant="body1" color="text.secondary" noWrap>
                                    {t(v.name)}
                                </Typography>
                            </Grid>
                            <Grid item md={3} sm={6} xs={6}>
                                <Typography variant="body1" color="text.primary" noWrap>
                                    {v.value}
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
