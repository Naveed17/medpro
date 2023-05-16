import moment from "moment-timezone";

function useTimeFromMinutes(minutes: number){
    // do not include the first validation check if you want, for example,
    if (minutes >= 24 * 60 || minutes < 0) {
        throw new RangeError("Valid input should be greater than or equal to 0 and less than 1440.");
    }
    let h = minutes / 60 | 0,
        m = minutes % 60 | 0;
    return moment.utc().hours(h).minutes(m).format("HH:mm");
}
export default useTimeFromMinutes;
