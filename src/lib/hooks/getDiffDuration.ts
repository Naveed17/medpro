import moment from "moment-timezone";
const humanizeDuration = require("humanize-duration");

export const getDiffDuration = (date: string) => {
    const duration: any = moment.duration(moment.utc().diff(moment.utc(date, "DD-MM-YYYY HH:mm")));
    return humanizeDuration(duration, {largest: 2, round: true});
}
