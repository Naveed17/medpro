import {Box, Button, Card, Collapse, Grid, Paper, Switch, Typography} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import TimePicker from "@themes/overrides/TimePicker";
import React, {useState} from "react";
import Schedule from "@interfaces/schedule";

type SchedulesProps = {
    initData: Schedule[]
}

function Schedules({initData}: SchedulesProps) {
    const [schedule, setSchedule] = useState(initData);
    console.log(schedule);
    return (
        <>
            {schedule.map((value: any, ind) => (
                <Card key={ind}
                      sx={{
                          border: "1px solid #E4E4E4",
                          boxShadow: "none",
                          bgcolor: "#FCFCFC",
                          mt: 2,
                      }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            px: 1,
                        }}>
                        <Typography
                            variant="body1"
                            color="text.primary"
                            fontWeight={600}
                            sx={{textTransform: "uppercase", margin: '13px 15px'}}>
                            {value.day}
                        </Typography>

                        <Switch
                            onChange={(e) => {
                                const day = schedule.findIndex(d => d.day === value.day)
                                schedule[day].opened = e.target.checked
                                if (schedule[day].hours === null)
                                    schedule[day].hours = [{start: '', end: ''}]
                                setSchedule([...schedule])
                            }
                            }
                            checked={value.opened}
                        />
                    </Box>

                    <Collapse
                        in={value.opened} sx={{bgcolor: "common.white", borderTop: "1px solid #C9C8C8"}}>
                        <Paper sx={{borderRadius: 0, border: "none", px: 1, my: 2}}>
                            {value.hours?.map((hour: any, i: number) => (
                                <Grid container spacing={1} alignItems="center" sx={{mt: 1}} key={i}>
                                    {hour && <Grid item lg={3} md={3} sm={12} xs={4}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                svg: {mr: 1},
                                                justifyContent: "end",
                                            }}>
                                            <IconUrl path="ic-time"/>
                                            <Typography variant="body2" color="text.primary">
                                                {i + 1 > 1 ? i + 1 + 'em seance' : '1er seance'}
                                            </Typography>
                                        </Box>
                                    </Grid>}
                                    {hour && <Grid item lg={4} md={6} sm={12} xs={12}>
                                        <TimePicker
                                            defaultValue={[hour.start ? new Date("2013/1/16 " + hour.start) : '', hour.end ? new Date("2013/1/16 " + hour.end) : '']}
                                            onChange={(s: any, e: any) => console.log(s, e)}
                                        />
                                    </Grid>}
                                    {i > 0 && (
                                        <Grid item lg={3} md={3} sm={12} xs={12}>
                                            <Button
                                                variant="text"
                                                color="error"
                                                size="small"
                                                sx={{
                                                    svg: {width: 15},
                                                    path: {fill: (theme) => theme.palette.error.main},
                                                }}
                                                startIcon={<IconUrl path="icdelete"/>}
                                                onClick={() => {
                                                    value.hours.splice(i, 1);
                                                    setSchedule([...schedule])
                                                }}>
                                                Supprimer
                                            </Button>
                                        </Grid>
                                    )}
                                </Grid>
                            ))}

                            <Grid container justifyContent="center">
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <Button
                                        onClick={() => {
                                            const day = schedule.findIndex(d => d.day === value.day)
                                            schedule[day].hours?.push({start: '', end: ''});
                                            setSchedule([...schedule])
                                        }}
                                        variant="contained"
                                        color="success"
                                        sx={{mt: 1}}>
                                        Ajouter
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Collapse>
                </Card>
            ))}
        </>
    )
}

export default Schedules;
