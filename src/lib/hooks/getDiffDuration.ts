import moment from "moment-timezone";
import {humanizerConfig} from "@lib/constants";

const humanizeDuration = require("humanize-duration");

export const getDiffDuration = (date: string, largest = 2) => {
    const local = moment.tz(date, "DD-MM-YYYY HH:mm", "Africa/Tunis");
    const shortEnglishHumanizer = humanizeDuration.humanizer(humanizerConfig);
    const duration: any = moment.duration(moment().utc().diff(local.local()));
    return shortEnglishHumanizer(duration, {largest, round: true});
}
