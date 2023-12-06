import React from "react";
import {Card, CardContent, Checkbox, Stack, Typography,} from "@mui/material";
import Icon from "@themes/urlIcon";
import CheckIcon from "@mui/icons-material/Check";

function ConsultationCard({...props}) {
    const {t, devise, allApps, appointments, setAppointments, getTotalApps, getTotalPayments, theme} = props;

    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    <Stack direction={"row"} alignItems={"center"} flex={3} pb={1}
                           borderBottom={`1px solid ${theme.palette.grey[200]}`}>
                        <Stack direction={"row"} alignItems={"center"} flex={1}>
                            <Checkbox checked={appointments.filter((app: {
                                checked: boolean
                            }) => app.checked).length === appointments.length}
                                      onChange={(e) => {
                                          appointments.map((app: {
                                              checked: boolean
                                          }) => app.checked = e.target.checked)
                                          setAppointments([...appointments])
                                      }}/>
                            <Typography fontSize={12}>{t('dialog.date')}</Typography>
                        </Stack>

                        <Typography flex={1} fontSize={12}>{t('dialog.amount')}</Typography>
                        <Typography flex={1} fontSize={12}>{t('dialog.leftPay')}</Typography>
                    </Stack>

                    <div style={{maxHeight: "32vh", overflowX: "auto"}}>
                        {allApps.filter((a1: { uuid: string; }) => !appointments.some((a2: {
                            uuid: string;
                        }) => a1.uuid === a2.uuid))
                            .map((app: any, index: number) => (
                                <Stack key={index} direction={"row"} alignItems={"center"} style={{flex: 3}} pb={1}
                                       borderBottom={index === appointments.length - 1 ? "" : `1px solid ${theme.palette.grey[200]}`}>
                                    <Stack direction={"row"} alignItems={"center"} flex={1}>
                                        <Checkbox checked={app.checked || false} onChange={(e) => {
                                            app.checked = e.target.checked;
                                            setAppointments([...appointments])
                                        }}/>
                                        <Stack spacing={0} sx={{
                                            ".react-svg": {
                                                svg: {
                                                    width: 11,
                                                    height: 11,
                                                    path: {
                                                        fill: (theme) => theme.palette.text.primary,
                                                    },
                                                },
                                            },
                                        }}>
                                            <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                                <Icon path="ic-agenda"/>
                                                <Typography fontSize={12}
                                                            fontWeight={"bold"}>{app.day_date}</Typography>
                                            </Stack>

                                            <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                                <Icon path="ic-time"/>
                                                <Typography fontSize={11}>{app.start_date}</Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>

                                    <Typography flex={1}><span style={{fontWeight: "bold"}}>{app.fees}</span> <span
                                        style={{fontSize: 10}}>{devise}</span></Typography>
                                    <Typography flex={1} fontWeight={"bold"} color={theme.palette.success.main}>0
                                        <span style={{fontSize: 10, fontWeight: '100'}}>{devise}</span>
                                        <CheckIcon style={{width: 15, height: 15}}/>
                                    </Typography>

                                </Stack>))}
                        {appointments.map((app: any, index: number) => (
                            <Stack key={index} direction={"row"} alignItems={"center"} style={{flex: 3}} pb={1}
                                   borderBottom={index === appointments.length - 1 ? "" : `1px solid ${theme.palette.grey[200]}`}>
                                <Stack direction={"row"} alignItems={"center"} flex={1}>
                                    <Checkbox checked={app.checked || false} onChange={(e) => {
                                        app.checked = e.target.checked;
                                        setAppointments([...appointments])
                                    }}/>
                                    <Stack spacing={0} sx={{
                                        ".react-svg": {
                                            svg: {
                                                width: 11,
                                                height: 11,
                                                path: {
                                                    fill: (theme) => theme.palette.text.primary,
                                                },
                                            },
                                        },
                                    }}>
                                        <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                            <Icon path="ic-agenda"/>
                                            <Typography fontSize={12} fontWeight={"bold"}>{app.day_date}</Typography>
                                        </Stack>

                                        <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                            <Icon path="ic-time"/>
                                            <Typography fontSize={11}>{app.start_date}</Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>

                                <Typography flex={1}><span
                                    style={{fontWeight: "bold"}}>{app.fees ? app.fees : app.rest_amount}</span> <span
                                    style={{fontSize: 10}}>{devise}</span></Typography>
                                <Typography flex={1} fontWeight={"bold"}
                                            color={!app.fees || app.fees == app.rest_amount ? "" : theme.palette.success.main}>{app.rest_amount}
                                    <span style={{fontSize: 10, fontWeight: '100'}}>{devise}</span>
                                </Typography>
                            </Stack>))}
                    </div>

                </Stack>

                <Stack direction={"row"} pl={3} pr={3} mt={2} borderRadius={1} justifyContent={"space-between"}
                       style={{backgroundColor: "#F0FAFF"}}>
                    <Typography fontSize={16} color={theme.palette.secondary.main}>{t('dialog.total')}</Typography>
                    <Typography color={theme.palette.secondary.main} fontSize={18}
                                fontWeight={"bold"}>{getTotalApps()} {devise}</Typography>
                </Stack>

                {getTotalApps() - getTotalPayments() > 0 &&
                    <Stack direction={"row"} pl={3} pr={3} mt={1} borderRadius={1} justifyContent={"space-between"}
                           style={{backgroundColor: theme.palette.error.main}}>
                        <Typography fontSize={16} style={{color: "white"}}>{t('dialog.leftPay')}</Typography>
                        <Typography style={{color: "white"}} fontSize={18}
                                    fontWeight={"bold"}>{getTotalApps() - getTotalPayments()} {devise}</Typography>
                    </Stack>}
            </CardContent>
        </Card>
    );
}

export default ConsultationCard;
