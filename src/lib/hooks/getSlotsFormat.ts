import moment from "moment-timezone";

export const getSlotsFormat = (slot: number) => {
    const duration = moment.duration(slot, "hours") as any;
    return moment.utc(duration._milliseconds).format("HH:mm:ss");
}
