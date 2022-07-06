import {useRef, useEffect} from "react";
import moment from "moment";

// ----------------------------------------------------------------------

function useDateConverture(minutes: number) {

    const unities = ['ans', 'mois', 'jours', 'heures', 'minutes', 'secondes', 'milliseconds']
    const convertDate = useRef(true);

    useEffect(
        () => {
            const dates = Object.values(((moment.duration(minutes, "minutes") as any)._data));
            const index = dates.reverse().findIndex((date) => date !== 0);
            console.log(dates[index],unities[index]);

        },
        []
    );

    return convertDate;
}

export default useDateConverture;
