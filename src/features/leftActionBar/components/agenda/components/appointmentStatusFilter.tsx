import {AppointmentStatus} from "@features/calendar";
import React from "react";
import {SidebarCheckboxStyled} from "@features/sidebarCheckbox";
import {Checkbox, Typography} from "@mui/material";
import {leftActionBarSelector, setFilter} from "@features/leftActionBar";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {useTranslation} from "next-i18next";

function AppointmentStatusFilter() {
    const dispatch = useAppDispatch();

    const {t} = useTranslation("common");
    const {query} = useAppSelector(leftActionBarSelector);

    return (<>{Object.values(AppointmentStatus).map((status) =>
            status.icon && (
                <React.Fragment key={status.key}>
                    <SidebarCheckboxStyled
                        component="label"
                        htmlFor={status.key}
                        sx={{
                            "& .MuiSvgIcon-root": {
                                width: 16,
                                height: 16,
                            },
                        }}
                        styleprops={""}>
                        <Checkbox
                            size="small"
                            id={status.key}
                            onChange={(event) => {
                                const selected = event.target.checked;
                                const statusKey = Object.entries(AppointmentStatus).find((value) => value[1].key === status.key);

                                if (selected && !query?.status?.includes((statusKey && statusKey[0]) as string)) {
                                    const type = (statusKey && statusKey[1]) as AppointmentStatusModel;
                                    const key = type?.key === "ONLINE" ? "isOnline" : "status";
                                    const value = type?.key === "ONLINE" ? selected : (statusKey && statusKey[0]) as string;
                                    dispatch(setFilter({[key]: `${value}${(query?.status && type?.key !== "ONLINE" ? `,${query.status}` : "")}`}));
                                } else {
                                    const sp = query?.status?.split(",") as string[];
                                    dispatch(setFilter({status: sp?.length > 1 ? query?.status?.replace(`${(statusKey && statusKey[0]) as string},`, "") : undefined}));
                                }
                            }}
                            name={status.key}
                        />
                        {status.icon}
                        <Typography ml={1}>{t(`appointment-status.${status.key}`)}</Typography>
                    </SidebarCheckboxStyled>
                </React.Fragment>
            )
    )}
    </>)
}

export default AppointmentStatusFilter;
