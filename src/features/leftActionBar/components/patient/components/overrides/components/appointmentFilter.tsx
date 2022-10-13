import { Typography, Box, InputLabel } from "@mui/material";
import { DatePicker } from "@features/datepicker";
import { useRequest } from "@app/axios";
import { SWRNoValidateConfig } from "@app/swr/swrProvider";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { SidebarCheckbox } from "@features/sidebarCheckbox";
import { leftActionBarSelector, setFilter } from "@features/leftActionBar";
import { useAppDispatch, useAppSelector } from "@app/redux/hooks";
import moment from "moment-timezone";
import _ from "lodash";

interface StateProps {
    appointment_date: Date | null;
}

function AppointmentFilter({ ...props }) {
    const { item, t, ready, keyPrefix = "", OnSearch } = props;
    const router = useRouter();
    const { data: session } = useSession();
    const dispatch = useAppDispatch();

    const { query } = useAppSelector(leftActionBarSelector);

    const [queryState, setQueryState] = useState<StateProps>({
        appointment_date: null
    });

    const { data: user } = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const { data: httpAppointmentTypesResponse, error: errorHttpAppointmentTypes } = useRequest({
        method: "GET",
        url: "/api/medical-entity/" + medical_entity.uuid + "/appointments/types/" + router.locale,
        headers: { Authorization: `Bearer ${session?.accessToken}` }
    }, SWRNoValidateConfig);

    const types = (httpAppointmentTypesResponse as HttpResponse)?.data as AppointmentTypeModel[];

    return (
        <Box component="figure" sx={{ m: 0 }}>
            <Typography variant="body2" color="text.secondary">
                {t(`${keyPrefix}${item.type?.heading}`)}
            </Typography>
            <Box>
                {types?.map((item, index) =>
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
                        }} />
                )}
            </Box>
            <Box>
                <InputLabel shrink sx={{ mt: 2 }}>
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
                    }} />
            </Box>
        </Box>
    );
}

export default AppointmentFilter;
