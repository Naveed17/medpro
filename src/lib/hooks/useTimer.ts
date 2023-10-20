import {useEffect, useState} from "react";
import {useAppSelector} from "@lib/redux/hooks";
import {timerSelector} from "@features/card";
import moment from "moment-timezone";

function useTimer() {
    const {startTime: initTimer, isActive, isPaused, event} = useAppSelector(timerSelector);

    const localInitTimer = moment.utc(`${initTimer}`, "HH:mm");
    const [time, setTime] = useState<number>(moment().utc().seconds(parseInt(localInitTimer.format("ss"), 0)).diff(localInitTimer, "seconds"));

    useEffect(() => {
        let interval: any = null;

        if (isActive && isPaused === false) {
            interval = setInterval(() => {
                setTime(time + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isActive, isPaused, time]);

    return {timer: moment().utc().hour(0).minute(0).second(time).format('HH : mm : ss')};
}

export default useTimer;
