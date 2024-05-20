import {CustomIconButton} from '@features/buttons';
import {FormControlLabel, Stack, Switch, TextField, Typography} from '@mui/material'
import {LocalizationProvider, TimePicker} from '@mui/x-date-pickers'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import AddIcon from '@mui/icons-material/Add';
import React, {useState} from 'react'
import IconUrl from '@themes/urlIcon';

function ScheduledShiftsDialog() {
    const [state, setState] = useState(
        [
            {
                enable: false,
                day: "Monday",
                timeShifts: [
                    {
                        startTime: null,
                        endTime: null,
                    }
                ]

            },
            {
                enable: false,
                day: "Tuesday",
                timeShifts: [
                    {
                        startTime: null,
                        endTime: null,
                    }
                ]

            },
            {
                enable: false,
                day: "Wednesday",
                timeShifts: [
                    {
                        startTime: null,
                        endTime: null,
                    }
                ]

            },
            {
                enable: false,
                day: "Thursday",
                timeShifts: [
                    {
                        startTime: null,
                        endTime: null,
                    }
                ]

            },
            {
                enable: false,
                day: "Friday",
                timeShifts: [
                    {
                        startTime: null,
                        endTime: null,
                    }
                ]

            },
            {
                enable: false,
                day: "Saturday",
                timeShifts: [
                    {
                        startTime: null,
                        endTime: null,
                    }
                ]

            },
            {
                enable: false,
                day: "Sunday",
                timeShifts: [
                    {
                        startTime: null,
                        endTime: null,
                    }
                ]

            },
        ]
    )
    return (
        <Stack spacing={1}>
            {
                state.map((item, index) => (
                    <Stack spacing={.5} width={1} key={"main-" + index}>
                        <FormControlLabel sx={{
                            alignSelf: "flex-start",
                            ".MuiTypography-root": {
                                fontSize: 14,
                                fontWeight: 600
                            }
                        }} control={<Switch disableRipple onChange={(e) => {
                            setState(state.map((innerItem, idx) => {
                                if (index === idx) {
                                    innerItem.enable = e.target.checked;
                                }
                                return innerItem;
                            }))

                        }}/>} label={item.day}/>
                        <Stack component={LocalizationProvider} spacing={1} dateAdapter={AdapterDayjs}>
                            {item.timeShifts.map((shiftItem, ItemIndex) => (
                                <Stack direction='row' spacing={1} alignItems='center' width={1}
                                       key={"shift-" + ItemIndex}>
                                    <TimePicker
                                        slots={{
                                            openPickerIcon: () => <Typography>From</Typography>,
                                            textField: (params) => <TextField sx={{
                                                ".MuiInputBase-root": {
                                                    flexDirection: 'row-reverse',
                                                    input: {
                                                        textAlign: "right",
                                                        fontWeight: 600
                                                    }
                                                }
                                            }} fullWidth {...params} />
                                        }}
                                        ampm={false}
                                        openTo="hours"
                                        views={["hours", "minutes"]}
                                        format="HH:mm"
                                        value={shiftItem.startTime}
                                        onChange={(newValue) => {
                                            setState(state.map((innerItem, idx) => ({
                                                ...innerItem,
                                                ...(index === idx && {
                                                    timeShifts: {
                                                        ...innerItem.timeShifts,
                                                        [ItemIndex]: {
                                                            ...innerItem.timeShifts[ItemIndex],
                                                            startTime: newValue as any
                                                        }
                                                    }
                                                })
                                            })))

                                        }}
                                    />
                                    <TimePicker
                                        slots={{
                                            openPickerIcon: () => <Typography>To</Typography>,
                                            textField: (params) => <TextField
                                                sx={{
                                                    ".MuiInputBase-root": {
                                                        flexDirection: 'row-reverse',
                                                        input: {
                                                            textAlign: "right",
                                                            fontWeight: 600
                                                        }
                                                    }
                                                }}
                                                fullWidth {...params} />
                                        }}
                                        ampm={false}
                                        openTo="hours"
                                        views={["hours", "minutes"]}
                                        format="HH:mm"
                                        value={shiftItem.endTime}
                                        onChange={(newValue) => {
                                            setState(state.map((innerItem, idx) => ({
                                                ...innerItem,
                                                ...(index === idx && {
                                                    timeShifts: {
                                                        ...innerItem.timeShifts,
                                                        [ItemIndex]: {
                                                            ...innerItem.timeShifts[ItemIndex],
                                                            endTime: newValue as any
                                                        }
                                                    }
                                                })
                                            })))
                                        }}
                                    />
                                    {ItemIndex === 0 ? (
                                        <CustomIconButton color="success"
                                                          onClick={() => {
                                                              setState(state.map((innerItem, idx) => {
                                                                  if (index === idx) {
                                                                      innerItem.timeShifts.push({
                                                                          startTime: null,
                                                                          endTime: null
                                                                      });
                                                                  }
                                                                  return innerItem;
                                                              }))
                                                          }}

                                        >
                                            <AddIcon/>
                                        </CustomIconButton>
                                    ) : (
                                        <CustomIconButton color="error"
                                                          onClick={() => {
                                                              setState(state.map((innerItem, idx) => {
                                                                  if (index === idx) {
                                                                      innerItem.timeShifts.splice(ItemIndex, 1);
                                                                  }
                                                                  return innerItem;
                                                              }))
                                                          }}

                                        >
                                            <IconUrl path="ic-delete" color="white"/>
                                        </CustomIconButton>
                                    )
                                    }

                                </Stack>
                            ))}
                        </Stack>
                    </Stack>

                ))
            }

        </Stack>
    )
}

export default ScheduledShiftsDialog
