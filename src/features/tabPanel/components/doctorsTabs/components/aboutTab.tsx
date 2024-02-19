import { Label } from '@features/label';
import { Grid, Stack, Card, CardContent, Typography, List, ListItem, Avatar, Link, ListItemText } from '@mui/material'
import IconUrl from '@themes/urlIcon'
import dynamic from 'next/dynamic';
import React from 'react'
const Maps = dynamic(() => import("@features/maps/components/maps"), {
    ssr: false,
});
function AboutTab({ ...props }) {
    const { t, cords, outerBounds, theme } = props
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                {t("personal_info")}
                            </Typography>
                            <List disablePadding>
                                <ListItem disablePadding sx={{ py: .5 }}>
                                    <Typography width={140} variant="body2" color='text.secondary'>
                                        {t("full_name")}
                                    </Typography>
                                    <Typography fontWeight={500}>
                                        Dr Ghassen BOULAHIA
                                    </Typography>
                                </ListItem>
                                <ListItem disablePadding sx={{ py: .5 }}>
                                    <Typography width={140} variant="body2" color='text.secondary'>
                                        {t("cin")}
                                    </Typography>
                                    <Typography fontWeight={500}>
                                        02165102
                                    </Typography>
                                </ListItem>
                                <ListItem disablePadding sx={{ py: .5 }}>
                                    <Typography width={140} variant="body2" color='text.secondary'>
                                        {t("birthdate")}
                                    </Typography>
                                    <Typography fontWeight={500}>
                                        29 juin 1972
                                    </Typography>
                                </ListItem>
                                <ListItem disablePadding sx={{ py: .5, alignItems: 'flex-start' }}>
                                    <Typography width={140} variant="body2" color='text.secondary'>
                                        {t("mobile")}
                                    </Typography>
                                    <Stack spacing={1.25}>
                                        <Stack direction='row' alignItems='center' spacing={1}>
                                            <Avatar
                                                sx={{
                                                    width: 27,
                                                    height: 18,
                                                    borderRadius: 0
                                                }}
                                                alt={"flags"}
                                                src={`https://flagcdn.com/tn.svg`}
                                            />
                                            <Typography fontWeight={500}>
                                                +216 22 469 495
                                            </Typography>
                                        </Stack>
                                        <Stack direction='row' alignItems='center' spacing={1}>
                                            <Avatar
                                                sx={{
                                                    width: 27,
                                                    height: 18,
                                                    borderRadius: 0
                                                }}
                                                alt={"flags"}
                                                src={`https://flagcdn.com/tn.svg`}
                                            />
                                            <Typography fontWeight={500}>
                                                +216 22 469 495
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </ListItem>
                                <ListItem disablePadding sx={{ py: .5 }}>
                                    <Typography width={140} variant="body2" color='text.secondary'>
                                        {t("email")}
                                    </Typography>
                                    <Typography fontWeight={500}>
                                        ghassen.boulahia@med.com
                                    </Typography>
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                {t("doctor_location")}
                            </Typography>
                            <Stack spacing={2}>
                                <Stack direction='row' spacing={1}>
                                    <IconUrl width={16} height={16} path="ic-pin-2" color={theme.palette.primary.main} />
                                    <Link underline="none" fontWeight={500} fontSize={12}>
                                        Centre médical clinique les Jasmins - 6ème Étage Centre Urbain Nord 1082 Tunis Tunisie
                                    </Link>
                                </Stack>
                                <Stack maxHeight={300}>
                                    <Maps data={cords}
                                        outerBounds={outerBounds}
                                        draggable={false} />
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                {t("pro_qualifications")}
                            </Typography>
                            <Typography>
                                {t("specialist_in")} Gynécologie-obstétrique
                            </Typography>
                            <Typography>
                                Ancien praticien des hôpitaux de Paris Diplômé des universités françaises en :
                            </Typography>
                            <List disablePadding sx={{ mb: 2 }}>
                                <ListItem disablePadding>
                                    <ListItemText sx={{ m: .2 }} primary="* Infertilité et Assistance médicale à la procréation" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText sx={{ m: 0.2 }} primary="* Échographie obstétricale et gynécologique" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText sx={{ m: 0.2 }} primary="* Chirurgie Vaginale" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText sx={{ m: 0.2 }} primary="* Traitement du Polapsus Urogénital" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText sx={{ m: 0.2 }} primary="* Hystéroscopie opératoire" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText sx={{ m: 0.2 }} primary="* Colposcopie" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText sx={{ m: 0.2 }} primary="* Maladies du Sein" />
                                </ListItem>
                            </List>
                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                {t("spoken_lang")}
                            </Typography>
                            <List disablePadding>
                                {
                                    ["Français", "Anglais"].map((lang, idx) =>
                                        <ListItem disablePadding key={idx}>
                                            <ListItemText sx={{ m: .1 }} primary={lang} />
                                        </ListItem>
                                    )

                                }
                            </List>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                {t("acts_&_care")}
                            </Typography>
                            <Stack mt={1} direction='row' flexWrap="wrap" alignItems='center' sx={{ gap: 1 }}>
                                {
                                    ["Hystéroscopie thérapeutique", "Suivi de grossesse", "Hystérectomie", "Traitement des prolapsus du plancher pelvien", "Stérilité du couple", "Echographie 3D", "FIV (Fécondation in vitro)", "Plastie de la vulve et du périnée", "Frottis cervico-vaginal"].map((act, idx) =>
                                        <Label key={idx} variant="filled" sx={{ bgcolor: theme.palette.grey["B905"] }}>
                                            {act}
                                        </Label>
                                    )
                                }


                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                {t("scheduled_shifts")}
                            </Typography>
                            <List>
                                {
                                    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, idx) =>
                                        <ListItem disablePadding key={idx}

                                            sx={{ py: .5 }}
                                        >
                                            <ListItemText sx={{ m: 0, span: { fontWeight: 600 } }} primary={day} />
                                            <Label variant="filled" sx={{ fontSize: 14, fontWeight: 600, bgcolor: theme.palette.background.default, borderRadius: 1, px: 1.5, py: 1, height: 37 }}>
                                                10:00 AM - 01:00 PM
                                            </Label>
                                        </ListItem>
                                    )
                                }


                            </List>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                {t("price_list")}
                            </Typography>
                            <List>
                                {
                                    ["Consultation simple", "Consultation endométriose 1ere fois", "Echographie pelvienne", "Pose dispositif intra utérin (DIU)", "Retrait ou changement dispositif intra utérin (DIU)", "Colposcopie", "Hystéroscopie"].map((day, idx) =>
                                        <ListItem disablePadding key={idx}

                                            sx={{ py: .5 }}
                                        >
                                            <ListItemText sx={{ m: 0, maxWidth: 180, span: { fontWeight: 600 } }} primary={day} />
                                            <Label variant="filled" sx={{ fontSize: 14, ml: 'auto', fontWeight: 600, bgcolor: theme.palette.background.default, borderRadius: 1, px: 1.5, py: 1, height: 37 }}>
                                                70 TND - 100 TND
                                            </Label>
                                        </ListItem>
                                    )
                                }


                            </List>
                        </CardContent>
                    </Card>
                </Stack>
            </Grid>
        </Grid>
    )
}

export default AboutTab