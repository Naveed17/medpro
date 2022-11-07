import ConsultationPopupActionStyled from "./overrides/consultationPopupActionStyled";
import {
    Card,
    CardContent,
    List,
    ListItem,
    Typography,
    Stack,
    Avatar,
    Box,
    Link,
    Button, Chip, useTheme
} from '@mui/material'
import IconUrl from "@themes/urlIcon";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";

import * as React from "react";

function ConsultationPopupAction({...props}) {
    const {data, OnSchedule} = props
    const theme = useTheme();

    return (
        <ConsultationPopupActionStyled>
            <CardContent>
                <Typography gutterBottom variant="subtitle2" fontWeight={600}>
                    Consultation terminée avec
                </Typography>
                <Card>
                    <List>
                        <ListItem>
                            <Stack spacing={1} direction='row' alignItems="flex-start">

                                <Box>
                                    <Avatar src="/static/icons/men-avatar.svg" sx={{width: 60, height: 60}}/>
                                    <Typography fontWeight={700} gutterBottom>
                                        {data.name}
                                    </Typography>
                                    <Stack spacing={0.2} direction='row' alignItems="center">
                                        <IconUrl path='ic-tel' className="ic-tel"/>
                                        <Link underline="none" href={`tel:`} sx={{ml: 1, fontSize: 12}}
                                              color="text.primary" fontWeight={400}>
                                            {data.phone}
                                        </Link>
                                    </Stack>
                                </Box>

                            </Stack>
                        </ListItem>
                        {/*<ListItem>
                            <Typography fontWeight={400}>
                                Date du rendez-vous
                            </Typography>
                            <Stack spacing={4} direction="row" alignItems='center'>
                                <Stack spacing={0.5} direction="row" alignItems='center'>
                                    <IconUrl className='ic-callander' path="ic-calendar"/>
                                    <Typography fontWeight={600}>
                                        {data.date}
                                    </Typography>
                                </Stack>
                                <Stack spacing={0.5} direction="row" alignItems='center'>
                                    <IconUrl className='ic-time' path="setting/ic-time"/>
                                    <Typography fontWeight={700}>
                                        {data.time}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </ListItem>*/}
                        <ListItem>
                            <Stack spacing={4} direction="row" alignItems='center'>
                                <Stack spacing={0.5} direction="row" alignItems='center'>
                                    <Typography fontWeight={600}>
                                        Prix de la consultation
                                    </Typography>
                                </Stack>
                                <Stack spacing={0.5} direction="row" alignItems='center'>
                                    <Chip
                                        color="success"
                                        label={`${data.fees} TND`}
                                    />
                                </Stack>
                            </Stack>
                        </ListItem>
                        <ListItem>
                            <textarea rows={6} readOnly
                                      defaultValue={data.instruction}/>
                        </ListItem>
                    </List>
                </Card>
                <Stack mt={1} spacing={2} justifyContent={"flex-end"} direction={{xs: 'column', md: "row"}}>
                    <Button
                        onClick={OnSchedule}
                        variant="contained" startIcon={<LocalHospitalOutlinedIcon/>}>
                        Replanifier un Conrole
                    </Button>
                </Stack>
            </CardContent>
        </ConsultationPopupActionStyled>
    )
}

export default ConsultationPopupAction;
