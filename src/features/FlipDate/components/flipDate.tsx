import React, {useRef, useEffect, useState} from "react";
import "@pqina/flip/dist/flip.min.css";
import {useAppSelector} from "@lib/redux/hooks";
import {timerSelector} from "@features/card";
import moment from "moment-timezone";

function FlipDate({...props}) {
    const {value} = props;
    const Tick = useRef<any>(null);
    const divRef = useRef<any>(null);
    const tickRef = useRef<any>(null);

    const {startTime: initTimer, isActive, isPaused, event} = useAppSelector(timerSelector);

    const [tickValue, setTickValue] = useState(value);
    const localInitTimer = moment.utc(`${initTimer}`, "HH:mm");
    const [time, setTime] = useState<number>(moment().utc().seconds(parseInt(localInitTimer.format("ss"), 0)).diff(localInitTimer, "seconds"));

    let tickInstance: any = null;

    useEffect(() => {
        let interval: any = null;
        if (isActive && isPaused === false) {
            interval = setInterval(() => {
                setTime(time + 1);
                const timer = moment().utc().hour(0).minute(0).second(time).format('HH : mm : ss');
                setTickValue(timer.split(" : "));
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => {
            clearInterval(interval);
        };
    }, [isActive, isPaused, time]);


    useEffect(() => {
        const didInit = (tick: any) => {
            tickRef.current = tick;
        };

        const currDiv = divRef.current;
        const tickValue = tickRef.current;
        (async () => {
            // @ts-ignore
            Tick.current = (await import('@pqina/flip')).default;
            // eslint-disable-next-line react-hooks/exhaustive-deps
            tickInstance = Tick.current.DOM.create(currDiv, {
                value,
                didInit
            });
        })();

        return () => {
            if (tickInstance) {
                Tick.current.DOM.destroy(tickValue);
            }
        };

    }, [value]);

    useEffect(() => {
        if (tickRef.current) {
            tickRef.current.value = tickValue;
        }
    }, [tickValue]);

    return (
        <div ref={divRef} className="tick">
            <div data-repeat="true">
                <span data-view="flip"/>
            </div>
        </div>
    );
}

export default FlipDate;
