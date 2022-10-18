import React from 'react'
import RootStyled from './overrides/rootStyle'
import {Typography, Skeleton, CardContent, Grid, Stack, Box} from '@mui/material'
import {useTranslation} from "next-i18next";

function PatientContactDetailCard({...props}) {
    const {patient, loading} = props;
    const {t, ready} = useTranslation("patient", {keyPrefix: "config.add-patient"});
    if (!ready) return <div>Loading...</div>;

    return (
        <div>
            <Typography
                variant="body1"
                color="text.primary"
                fontFamily="Poppins"
                gutterBottom
            >
                {loading ? (
                    <Skeleton variant="text" sx={{maxWidth: 200}}/>
                ) : (
                    t("contact")
                )}
            </Typography>
            <RootStyled>
                <CardContent>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={2}>
                                {patient?.contact.map((contact: ContactModel, index: number) =>
                                    <Stack direction='row'
                                           key={index}
                                           alignItems="flex-start">
                                        <Typography className="label" variant='body2' color="text.secondary"
                                                    width='50%'>
                                            {t("telephone")}
                                        </Typography>
                                        {
                                            loading ?
                                                <Skeleton width={100}/> :
                                                <Stack direction='row' spacing={1} alignItems="center">
                                                    <Box component='img'
                                                         src={`https://flagcdn.com/w20/tn.png`}
                                                         srcSet={`https://flagcdn.com/w40/tn.png 2x`}
                                                         sx={{width: 22}}/>
                                                    <Typography className="label" variant='body2'
                                                                color="text.secondary">
                                                        {contact.code && contact.code} {contact.value}
                                                    </Typography>
                                                </Stack>
                                        }
                                    </Stack>)}
                                <Stack direction='row' alignItems="flex-start">
                                    <Typography className="label" variant='body2' color="text.secondary" width='50%'>
                                        {t("email")}
                                    </Typography>
                                    {
                                        loading ?
                                            <Skeleton width={100}/> :
                                            <Typography>{patient?.email ? patient.email : "--"}</Typography>
                                    }

                                </Stack>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack spacing={2}>
                                <Stack direction='row' alignItems="flex-start">
                                    <Typography className="label" variant='body2' color="text.secondary" width='50%'>
                                        {t("region")}
                                    </Typography>
                                    {
                                        loading ? <Skeleton width={100}/> :
                                            <Typography
                                                width='50%'>{patient?.address[0] ? patient?.address[0].city.name : "--"}</Typography>
                                    }


                                </Stack>
                                <Stack direction='row' alignItems="flex-start">
                                    <Typography className="label" variant='body2' color="text.secondary" width='50%'>
                                        {t("address")}
                                    </Typography>
                                    {
                                        loading ? <Skeleton width={100}/> :
                                            <Typography
                                                width='50%'>{patient?.address[0] ? patient?.address[0].street : "--"}</Typography>
                                    }

                                </Stack>
                                <Stack direction='row' alignItems="flex-start">
                                    <Typography className="label" variant='body2' color="text.secondary" width='50%'>
                                        {t("zip_code")}
                                    </Typography>
                                    {
                                        loading ?
                                            <Skeleton width={100}/> :
                                            <Typography width='50%'>
                                                {patient?.address[0] ? patient?.address[0].postalCode : "--"}
                                            </Typography>
                                    }

                                </Stack>
                                {patient?.insurances.map((data: { insurance: InsuranceModel }, index: number) =>
                                    <Stack direction='row'
                                           key={index}
                                           alignItems="flex-start">
                                        <Typography className="label" variant='body2' color="text.secondary"
                                                    width='50%'>
                                            {t("assurance")}
                                        </Typography>
                                        {
                                            loading ?
                                                <Skeleton width={100}/> :
                                                <Typography width='50%'>
                                                    {data.insurance.name}
                                                </Typography>
                                        }
                                    </Stack>)}
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </RootStyled>
        </div>
    )
}

export default PatientContactDetailCard
