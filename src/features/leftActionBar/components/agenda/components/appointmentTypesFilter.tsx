import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import React, {useEffect} from "react";
import {SidebarCheckbox} from "@features/sidebarCheckbox";
import {leftActionBarSelector, setFilter} from "@features/leftActionBar";

function AppointmentTypesFilter({...props}) {
    const {t, ready} = props;
    const dispatch = useAppDispatch();

    const {appointmentTypes} = useAppSelector(dashLayoutSelector);
    const {query} = useAppSelector(leftActionBarSelector);

    const types = appointmentTypes ? [...appointmentTypes] : [];

    useEffect(() => {
        types?.map((type) => {
            Object.assign({...type}, {
                checked:
                    query?.type
                        ?.split(",")
                        .find((typeObject) => type.uuid === typeObject) !== undefined,
            });
        });
    });

    return (<>{types.map((item, index) => (
        <React.Fragment key={index}>
            <SidebarCheckbox
                label={"name"}
                checkState={item.checked}
                translate={{
                    t: t,
                    ready: ready,
                }}
                data={item}
                onChange={(selected: boolean) => {
                    if (selected && !query?.type?.includes(item.uuid)) {
                        dispatch(setFilter({type: item.uuid + (query?.type ? `,${query.type}` : "")}));
                    } else {
                        const sp = query?.type?.split(",") as string[];
                        sp?.splice(sp.findIndex((searchElement: string) => searchElement === item.uuid), 1);
                        dispatch(setFilter({type: sp?.length > 0 ? sp?.join(",") : undefined}));
                    }
                }}
            />
        </React.Fragment>
    ))}</>)
}

export default AppointmentTypesFilter;
