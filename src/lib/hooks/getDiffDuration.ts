import moment from "moment-timezone";
const humanizeDuration = require("humanize-duration");

export const getDiffDuration = (date: string) => {
    const shortEnglishHumanizer = humanizeDuration.humanizer({
        language: "shortEn",
        languages: {
            shortEn: {
                y: () => "y",
                mo: () => "mo",
                w: () => "w",
                d: () => "d",
                h: () => "h",
                m: () => "min",
                s: () => "s",
                ms: () => "ms",
            },
        },
    });
    const duration: any = moment.duration(moment.utc().diff(moment.utc(date, "DD-MM-YYYY HH:mm")));
    return shortEnglishHumanizer(duration, {largest: 2, round: true});
}
