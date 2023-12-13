import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import React, {useEffect, useState} from "react";
import {SidebarCheckbox} from "@features/sidebarCheckbox";
import {leftActionBarSelector, setFilter} from "@features/leftActionBar";

function AppointmentTypesFilter({...props}) {
    const {t, ready} = props;
    const dispatch = useAppDispatch();

    const {appointmentTypes} = useAppSelector(dashLayoutSelector);
    const {query} = useAppSelector(leftActionBarSelector);

    const [types, setTypes] = useState<any[]>(appointmentTypes ? [...appointmentTypes] : []);

    useEffect(() => {
        setTypes(types.map((type) => ({
            ...type,
            checked:
                query?.type?.split(",")?.find(typeObject => type.uuid === typeObject) !== undefined ?? false
        })));
    }, [query?.type]); // eslint-disable-line react-hooks/exhaustive-deps

    return types.map((item, index) => (
        <React.Fragment key={index}>
            <SidebarCheckbox
                label={"name"}
                checkState={item.checked}
                translate={{t, ready}}
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
    ))
}

export default AppointmentTypesFilter;
