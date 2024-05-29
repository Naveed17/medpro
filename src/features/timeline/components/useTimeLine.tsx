import {useCallback, useEffect, useMemo, useState} from "react";
import {Channel, Program, useEpg} from "planby";
import {theme} from "./overrides/theme";
import {useAppSelector} from "@lib/redux/hooks";
import {agendaSelector} from "@features/calendar";
import moment from "moment-timezone";
import {getSlotsFormat} from "@lib/hooks";
import {timeLineSelector} from "@features/timeline";

function useTimeLine({...props}) {
    const {data} = props;
    const {agendas, config: agendaConfig} = useAppSelector(agendaSelector);
    const {showDetails: showTimeLineDetails} = useAppSelector(timeLineSelector);

    const [channels, setChannels] = useState<Channel[]>([]);
    const [epg, setEpg] = useState<Program[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [slotMinTime, setSlotMinTime] = useState(8);
    const [slotMaxTime, setSlotMaxTime] = useState(20);

    const channelsData = useMemo(() => channels, [channels]);
    const epgData = useMemo(() => epg, [epg]);

    const openingHours = agendaConfig?.openingHours[0] as any;
    const currentMonth = moment().locale('en').format("ddd").toUpperCase();

    const {getEpgProps, getLayoutProps, onScrollToNow} = useEpg({
        channels: channelsData,
        epg: epgData,
        dayWidth: 7200,
        itemHeight: showTimeLineDetails ? 46 : 36,
        height: 140,
        isSidebar: false,
        isTimeline: true,
        isLine: true,
        startDate: moment(getSlotsFormat(slotMinTime), "HH:mm:ss").toString(),
        endDate: moment(getSlotsFormat(slotMaxTime), "HH:mm:ss").toString(),
        isBaseTimeFormat: false,
        theme
    });

    const handleFetchResources = useCallback(async () => {
        setIsLoading(true);
        const epg = data.map((event: any, index: number) => {
            return {
                ...event,
                since: moment(`${event.dayDate} ${event.startTime}`, 'DD-MM-YYYY HH:mm').toString(),
                till: moment(`${event.dayDate} ${event.startTime}`, 'DD-MM-YYYY HH:mm').add(event.duration, "minutes").toString(),
                title: `${event.patient.firstName} ${event.patient.lastName}`,
                channelUuid: agendaConfig?.uuid,
                overlapEvent: data.filter((item: any) => item.startTime === event.startTime && item.uuid !== event.uuid).length > 0,
                overlapEventIndex: data.findIndex((item: any) => item.startTime === event.startTime),
                index
            }
        });
        const channels = agendas as any[];
        setEpg(epg as Program[]);
        setChannels(channels);
        setIsLoading(false);
    }, [agendaConfig?.uuid, agendas, data]);

    useEffect(() => {
        if (openingHours[currentMonth]) {
            openingHours[currentMonth].forEach((openingHour: {
                start_time: string,
                end_time: string
            }) => {
                const min = moment.duration(openingHour?.start_time).asHours();
                const max = moment.duration(openingHour?.end_time).asHours();
                if (min < slotMinTime) {
                    setSlotMinTime(min);
                }

                if (max > slotMaxTime) {
                    setSlotMaxTime(max);
                }
            })
        }
    }, [openingHours]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        handleFetchResources();
    }, [handleFetchResources]);

    return {getEpgProps, getLayoutProps, isLoading, onScrollToNow};
}

export default useTimeLine;
