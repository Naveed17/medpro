import moment from "moment-timezone";
import {HumanizerConfig} from "@lib/constants";

const humanizeDuration = require("humanize-duration");

export const getDiffDuration = (date: string, largest = 2, round = true, datefrom?: string, units?: string[]) => {
    const local = moment.tz(date, "DD-MM-YYYY HH:mm:ss", "Africa/Tunis");
    const shortEnglishHumanizer = humanizeDuration.humanizer(HumanizerConfig);
    const duration: any = moment.duration((datefrom ? moment(datefrom, "DD-MM-YYYY HH:mm:ss") : moment.utc()).diff(local.local()));
    return shortEnglishHumanizer(duration, {largest, round, ...(units ? [units] : [])});
}
