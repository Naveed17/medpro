import {Typography, Box, InputLabel} from "@mui/material";
import {DatePicker} from "@features/datepicker";
import React, {useState} from "react";
import {SidebarCheckbox} from "@features/sidebarCheckbox";
import {leftActionBarSelector, setFilter} from "@features/leftActionBar";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import moment from "moment-timezone";
import _ from "lodash";
import {dashLayoutSelector} from "@features/base";

interface StateProps {
    appointment_date: Date | null;
}

function AppointmentFilter({...props}) {
    const {item, t, ready, keyPrefix = "", OnSearch} = props;
    const dispatch = useAppDispatch();

    const {query} = useAppSelector(leftActionBarSelector);
    const {appointmentTypes} = useAppSelector(dashLayoutSelector);

    const [queryState, setQueryState] = useState<StateProps>({
        appointment_date: null
    });

    return (
        <Box component="figure" sx={{m: 0}}>
            <Typography variant="body2" color="text.secondary">
                {t(`${keyPrefix}${item.type?.heading}`)}
            </Typography>
            <Box>
                {appointmentTypes?.map((item, index) =>
                    <SidebarCheckbox
                        key={index}
                        label={"name"}
                        checkState={item.checked}
                        translate={{
                            t: t,
                            ready: ready,
                        }}
                        data={item}
                        onChange={(selected: boolean) => {
                            if (selected && !query?.type?.includes(item.uuid)) {
                                dispatch(setFilter({
                                    type:
                                        item.uuid + (query?.type ? `,${query.type}` : "")
                                }));
                            } else {
                                const sp = query?.type?.split(",") as string[];
                                dispatch(setFilter({
                                    type:
                                        sp.length > 1 ? query?.type?.replace(`${item.uuid},`, "") : undefined
                                }))
                            }
                        }}/>
                )}
            </Box>
            <Box>
                <InputLabel shrink sx={{mt: 2}}>
                    {t(`${keyPrefix}appointment`)}
                </InputLabel>
                <DatePicker
                    inputFormat="dd/MM/yyyy"
                    value={queryState.appointment_date}
                    onChange={(date: Date) => {
                        setQueryState({
                            ...queryState,
                            appointment_date: date
                        });

                        if (date && date.toString() !== "Invalid Date") {
                            OnSearch({
                                query: {
                                    ...queryState,
                                    appointment_date: moment(date).format("DD-MM-YYYY"),
                                },
                            });
                        } else {
                            const query = _.omit(queryState, "appointment_date");
                            OnSearch({
                                query,
                            });
                        }
                    }}/>
            </Box>
        </Box>
    );
}

export default AppointmentFilter;
