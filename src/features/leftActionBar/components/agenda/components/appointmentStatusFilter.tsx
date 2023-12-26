import {AppointmentStatus} from "@features/calendar";
import React, {useEffect, useState} from "react";
import {SidebarCheckbox} from "@features/sidebarCheckbox";
import {leftActionBarSelector, setFilter} from "@features/leftActionBar";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {useTranslation} from "next-i18next";

function AppointmentStatusFilter() {
    const dispatch = useAppDispatch();

    const {t} = useTranslation("common");
    const {query} = useAppSelector(leftActionBarSelector);

    const [statusData, setStatusData] = useState<any[]>(Object.values(AppointmentStatus).filter(item => item.icon));

    useEffect(() => {
        setStatusData([...statusData.map((item) => ({
            ...item,
            checked:
                ((query?.isOnline && item.key === "ONLINE") ||
                    query?.status?.split(",")?.find(typeObject => AppointmentStatus[typeObject].key === item.key) !== undefined) ?? false
        }))]);
    }, [query?.status, query?.isOnline]); // eslint-disable-line react-hooks/exhaustive-deps

    return (<>
        {statusData?.map((status) =>
            <SidebarCheckbox
                key={status.key}
                {...{t}}
                prefix={"appointment-status"}
                size="small"
                label={"key"}
                data={status}
                id={status.key}
                checkState={status.checked}
                onChange={(selected: boolean) => {
                    const statusKey = Object.entries(AppointmentStatus).find((value) => value[1].key === status.key);
                    const type = (statusKey && statusKey[1]) as AppointmentStatusModel;
                    const key = type?.key === "ONLINE" ? "isOnline" : "status";

                    if (selected && !query?.status?.includes((statusKey && statusKey[0]) as string)) {
                        const value = type?.key === "ONLINE" ? selected : (statusKey && statusKey[0]) as string;
                        dispatch(setFilter({[key]: `${value}${(query?.status && type?.key !== "ONLINE" ? `,${query.status}` : "")}`}));
                    } else {
                        const sp = query?.status?.split(",") as string[];
                        statusKey && sp?.splice(sp.findIndex((searchElement: string) => searchElement === statusKey[0]), 1);
                        dispatch(setFilter({[key]: type?.key !== "ONLINE" && (sp?.length > 0 ? sp?.join(",") : undefined)}));
                    }
                }}
                name={status.key}
            />
        )}
    </>)

}

export default AppointmentStatusFilter;
