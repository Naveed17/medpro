import {useRef} from "react";
import moment from "moment";

// ----------------------------------------------------------------------

function useDateConverture(min: number, max: number) {

    const unities = [
        {singular: 'year', plural: 'years'},
        {singular: 'month', plural: 'months'},
        {singular: 'day', plural: 'days'},
        {singular: 'hour', plural: 'hours'},
        {singular: 'minute', plural: 'minutes'},
        {singular: 'seconde', plural: 'secondes'},
        {singular: 'millisecond', plural: 'milliseconds'}
    ];
    const convertDate = useRef<any[]>([]);
    let minutes: number[] = [];
    let diff = 1;
    convertDate.current = [];

    do {
        if (min >= 1440) diff = 1440;
        else if (min >= 60) diff = 60;
        else if (min >= 30) diff = 15;
        else if (min >= 5) diff = 5;

        minutes = [...minutes, min]
        min += diff;

    } while (min <= max)

    minutes.map((minute: number) => {
        const dates = Object.values(((moment.duration(minute, "minutes") as any)._data));
        const index = dates.reverse().findIndex((date) => date !== 0);
        convertDate.current = [...convertDate.current, {
            value:minute,
            date: dates[index],
            unity:(dates[index] === 1? unities[index].singular:unities[index].plural)
        }];
    })
    return convertDate.current;
}

export default useDateConverture;
