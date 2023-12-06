import moment from "moment-timezone";
import {humanizerConfig} from "@lib/constants";

const humanizeDuration = require("humanize-duration");

export const getDiffDuration = (date: string, largest = 2) => {
    const shortEnglishHumanizer = humanizeDuration.humanizer(humanizerConfig);
    const duration: any = moment.duration(moment.utc().diff(moment(date, "DD-MM-YYYY HH:mm")));
    console.log("duration", duration.asMilliseconds())
    return shortEnglishHumanizer(duration, {largest, round: true});
}
