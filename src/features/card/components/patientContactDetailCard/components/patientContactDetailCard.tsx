import React from 'react'
import RootStyled from './overrides/rootStyle'
import { Typography, Skeleton, CardContent, Grid, Stack, Box } from '@mui/material'
import { useTranslation } from "next-i18next";
function PatientContactDetailCard({ ...props }) {
    const { patient, loading } = props;
    const { t, ready } = useTranslation("patient", { keyPrefix: "config.add-patient" });
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
                    <Skeleton variant="text" sx={{ maxWidth: 200 }} />
                ) : (
                    t("contact")
                )}
            </Typography>
            <RootStyled>
                <CardContent>
                    <Grid container >
                        <Grid item xs={12} md={6}>
                            <Stack spacing={2}>
                                <Stack direction='row' alignItems="flex-start">
                                    <Typography className="label" variant='body2' color="text.secondary" width='50%'>
                                        {t("telephone")}
                                    </Typography>
                                    {
                                        loading ?
                                            <Skeleton width={100} /> :
                                            <Stack direction='row' spacing={1} alignItems="center">
                                                <Box component='img'
                                                    src={`https://flagcdn.com/w20/tn.png`}
                                                    srcSet={`https://flagcdn.com/w40/tn.png 2x`}
                                                    sx={{ width: 22 }} />
                                                <Typography className="label" variant='body2' color="text.secondary">
                                                    030000000000
                                                </Typography>
                                            </Stack>
                                    }

                                </Stack>
                                <Stack direction='row' alignItems="flex-start">
                                    <Typography className="label" variant='body2' color="text.secondary" width='50%'>
                                        {t("telephone")}
                                    </Typography>
                                    {
                                        loading ?
                                            <Skeleton width={100} /> :
                                            <Stack direction='row' spacing={1} alignItems="center">
                                                <Box component='img'
                                                    src={`https://flagcdn.com/w20/tn.png`}
                                                    srcSet={`https://flagcdn.com/w40/tn.png 2x`}
                                                    sx={{ width: 22 }} />
                                                <Typography className="label" variant='body2' color="text.secondary">
                                                    030000000000
                                                </Typography>
                                            </Stack>
                                    }
                                </Stack>
                                <Stack direction='row' alignItems="flex-start">
                                    <Typography className="label" variant='body2' color="text.secondary" width='50%'>
                                        {t("email")}
                                    </Typography>
                                    {
                                        loading ?
                                            <Skeleton width={100} /> :
                                            <Typography>--</Typography>
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
                                        loading ? <Skeleton width={100} /> :
                                            <Typography width='50%'>Ariana</Typography>
                                    }


                                </Stack>
                                <Stack direction='row' alignItems="flex-start">
                                    <Typography className="label" variant='body2' color="text.secondary" width='50%'>
                                        {t("address")}
                                    </Typography>
                                    {
                                        loading ? <Skeleton width={100} /> :
                                            <Typography width='50%'>2 ruse murabites menzah 5 </Typography>
                                    }

                                </Stack>
                                <Stack direction='row' alignItems="flex-start">
                                    <Typography className="label" variant='body2' color="text.secondary" width='50%'>
                                        {t("zip_code")}
                                    </Typography>
                                    {
                                        loading ?
                                            <Skeleton width={100} /> :
                                            <Typography width='50%'>
                                                1004
                                            </Typography>
                                    }

                                </Stack>
                                <Stack direction='row' alignItems="flex-start">
                                    <Typography className="label" variant='body2' color="text.secondary" width='50%'>
                                        {t("assurance")}
                                    </Typography>
                                    {
                                        loading ?
                                            <Skeleton width={100} /> :
                                            <Typography width='50%'>
                                                --
                                            </Typography>
                                    }

                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </RootStyled>
        </div>
    )
}

export default PatientContactDetailCard