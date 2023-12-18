import moment from "moment-timezone";
import {humanizerConfig} from "@lib/constants";

const humanizeDuration = require("humanize-duration");

export const getDiffDuration = (date: string, largest = 2) => {
    const shortEnglishHumanizer = humanizeDuration.humanizer(humanizerConfig);
    const duration: any = moment.duration(moment.utc().diff(moment.utc(date, "DD-MM-YYYY HH:mm")));
    return shortEnglishHumanizer(duration, {largest, round: true});
}
