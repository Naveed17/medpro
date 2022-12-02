export {default as useIsMountedRef} from "./useIsMountedRef";
export {default as useDateConverture} from "./useDateConverture";
export {default as useTimeFromMinutes} from "./useTimeFromMinutes";
export * from "./prepareSearchKeys";
export * from "./rest/useAppointment";

export default function getDifference<T>(a: T[], b: T[]): T[] {
    return a.filter((element) => {
        return !b.includes(element);
    });
}
