import moment from "moment-timezone";

export const appointmentGroupByDate = (events: any[]) => {
    // this gives an object with dates as keys
    const groups: any = events.reduce(
        (groups: any, data: any) => {
            const date = moment(data.time, "ddd MMM DD YYYY HH:mm:ss").format('DD-MM-YYYY');
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(data);
            return groups;
        }, {});

    // Edit: to add it in the array format instead
    return Object.keys(groups).map((date) => {
        return {
            date,
            events: groups[date].sort((a: EventModal, b: EventModal) => moment(a.start).diff(moment(b.start)))
        };
    }).sort((a, b) => moment(a.date, 'DD-MM-YYYY').diff(moment(b.date, 'DD-MM-YYYY')));
}
