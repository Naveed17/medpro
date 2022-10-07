import { Typography, Box, InputLabel } from "@mui/material";
import { DatePicker } from "@features/datepicker";
import { useRequest } from "@app/axios";
import { SWRNoValidateConfig } from "@app/swr/swrProvider";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { SidebarCheckbox } from "@features/sidebarCheckbox";
import { leftActionBarSelector, setFilter } from "@features/leftActionBar";
import { useAppDispatch, useAppSelector } from "@app/redux/hooks";

function AppointmentFilter({ ...props }) {
    const { item, t, ready, keyPrefix = "" } = props;
    const router = useRouter();
    const { data: session } = useSession();
    const dispatch = useAppDispatch();

    const { query } = useAppSelector(leftActionBarSelector);

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
                <DatePicker />
            </Box>
            {/*            <Box>
                <InputLabel shrink sx={{mt: 2}}>
                    {t(`${keyPrefix}last-appointment`)}
                </InputLabel>
                <DatePicker/>
            </Box>*/}
        </Box>
    );
}

export default AppointmentFilter;
