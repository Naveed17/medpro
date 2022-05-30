import {GetStaticProps} from "next";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useEffect} from "react";
import dynamic from "next/dynamic";
import {useRouter} from "next/router";
import DashLayout from "@features/base/dashLayout";
import {CardContent, List, ListItem, Stack, Typography, Button, IconButton, Box, Grid, Avatar} from "@mui/material";
// import BasicAlert from "@themes/overrides/Alert"
import CardStyled from "./cardStyled";
import SubHeader from "../../../../features/subHeader/components/subHeader";
import CalendarToolbar from "../../../../features/calendarToolbar/components/calendarToolbar";
import IconUrl from "@themes/urlIcon";
import BasicAlert from "@themes/overrides/Alert"
import {deepOrange} from "@mui/material/colors";

function Profil(){
    const router = useRouter();

    useEffect(() => {
        console.log('i settings')
    }, [])

    const { t, ready } = useTranslation('common');
    if (!ready) return (<>loading translations...</>);

    return(
        <>
            <SubHeader>
                <CalendarToolbar date={''} />
                <Stack spacing={2} direction="row" alignItems="flex-start">
                    <Typography variant="h6">Dr. tester </Typography>
                </Stack>
            </SubHeader>
            <Box bgcolor="#F0FAFF" sx={{ p: { xs: "40px 8px", sm: "30px 8px", md: 2 } }}>
                <CardStyled>
                    <CardContent>
                        <List>
                            <ListItem>
                                <Stack spacing={2.3} direction="row" alignItems="flex-start" width={1}>
                                    <IconUrl className='left-icon' path="ic-doctor-h" />
                                    <Stack spacing={1} alignItems="flex-start" width={1}>
                                        <Typography variant="subtitle2" fontWeight={600}>Spécialités</Typography>
                                        <Button variant="outlined" color="info" onClick={(e) => console.log(e)}>
                                            Dermatologue
                                        </Button>
                                        <BasicAlert icon="danger"
                                                    data={'Contactez notre support pour changer votre nom ou spécialité  +216 22 469 495'}
                                                    color="warning">info</BasicAlert>
                                    </Stack>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Stack spacing={2.3} direction="row" alignItems="flex-start" width={1}>
                                    <IconUrl className='left-icon' path="ic-education" />
                                    <Stack spacing={0.5} alignItems="flex-start" width={1}>
                                        <Typography variant="subtitle2" gutterBottom fontWeight={600}>Qualification professionnelle</Typography>
                                        <Typography fontWeight={400}>
                                            Thèse de Doctorat en Médecine
                                        </Typography>
                                        <Typography fontWeight={400}>
                                            Diplôme de Spécialiste en Dermatologie Vénéréologie
                                        </Typography>
                                        <Typography>
                                            Diplôme Inter Universitaire Cosmetologie
                                        </Typography>
                                        <Typography>
                                            Diplôme Inter Universitaire de Laser en Dermatologie

                                        </Typography>
                                    </Stack>
                                    <IconButton size="small" color="primary" onClick={(e) => console.log(e)}>
                                        <IconUrl path="ic-edit" />
                                    </IconButton>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Stack spacing={2.3} direction="row" alignItems="flex-start" width={1}>
                                    <IconUrl className='left-icon' path="ic-assurance" />
                                    <Stack spacing={1} alignItems="flex-start" width={1}>
                                        <Typography variant="subtitle2" gutterBottom fontWeight={600}>Assurance maladie</Typography>
                                        <Stack spacing={2.5} direction="row" alignItems="flex-start" width={1}>
                                            <Box component="img"
                                                 src="/static/img/assurance-1.png"
                                            />
                                            <Box component="img"
                                                 src="/static/img/assurance-2.png"
                                            />

                                        </Stack>
                                    </Stack>
                                    <IconButton size="small" color="primary" onClick={(e) => console.log(e)}>
                                        <IconUrl path="ic-edit" />
                                    </IconButton>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Stack spacing={2.3} direction="row" alignItems="flex-start" width={1}>
                                    <IconUrl className='left-icon' path="ic-argent" />
                                    <Stack spacing={1} alignItems="flex-start" width={1}>
                                        <Typography variant="subtitle2" gutterBottom fontWeight={600}>Modes de règlement</Typography>
                                        <Stack spacing={1} direction="row" alignItems="flex-start" width={1}>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)} >
                                                Espèces
                                            </Button>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Chèque
                                            </Button>
                                        </Stack>
                                    </Stack>
                                    <IconButton size="small" color="primary" onClick={(e) => console.log(e)}>
                                        <IconUrl path="ic-edit" />
                                    </IconButton>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Stack spacing={2.3} direction="row" alignItems="flex-start" width={1}>
                                    <IconUrl className='left-icon' path="ic-langue2" />
                                    <Stack spacing={1} alignItems="flex-start" width={1}>
                                        <Typography variant="subtitle2" gutterBottom fontWeight={600}>Langues parlées</Typography>
                                        <Stack spacing={1} direction="row" alignItems="flex-start" width={1}>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Français
                                            </Button>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Arabe
                                            </Button>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Italien
                                            </Button>

                                        </Stack>
                                    </Stack>
                                    <IconButton size="small" color="primary" onClick={(e) => console.log(e)}>
                                        <IconUrl path="ic-edit" />
                                    </IconButton>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Stack spacing={2.3} direction="row" alignItems="flex-start" width={1}>
                                    <IconUrl className='left-icon' path="ic-generaliste" />
                                    <Stack spacing={1} alignItems="flex-start" width={1}>
                                        <Typography variant="subtitle2" gutterBottom fontWeight={600}>Actes principaux</Typography>
                                        <Stack spacing={1} direction={{ xs: 'column', md: 'row' }} alignItems="flex-start" width={1}>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Relissage fractionnel
                                            </Button>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Prise en charge de lacné
                                            </Button>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Traitement Médical et Chirurgical des Cheveux
                                            </Button>

                                        </Stack>
                                    </Stack>
                                    <IconButton size="small" color="primary" onClick={(e) => console.log(e)}>

                                        <IconUrl path="ic-edit" />
                                    </IconButton>
                                </Stack>
                            </ListItem>
                            <ListItem>
                                <Stack spacing={4} direction="row" alignItems="flex-start" width={1}>
                                    {/*<Icon className='left-icon' path={null} />*/}
                                    <Stack spacing={1} alignItems="flex-start" width={1}>
                                        <Typography variant="subtitle2" gutterBottom fontWeight={600}>Actes Secondaries</Typography>
                                        <Stack spacing={1} direction={{ xs: 'column', md: 'row' }} alignItems="flex-start" width={1}>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Relissage fractionnel
                                            </Button>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Prise en charge de lacné
                                            </Button>
                                            <Button variant="outlined" color="info"
                                                    onClick={(e) => console.log(e)}>
                                                Traitement Médical et Chirurgical des Cheveux
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </ListItem>
                        </List>
                    </CardContent>
                </CardStyled>
            </Box>
        </>
    )
}
export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale as string, ['common', 'menu','settings']))
    }
})
export default Profil

Profil.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}
