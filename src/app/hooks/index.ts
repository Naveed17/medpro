export {default as useIsMountedRef} from "./useIsMountedRef";
export {default as useDateConverture} from "./useDateConverture";
export {default as useTimeFromMinutes} from "./useTimeFromMinutes";
export * from "./prepareSearchKeys";
export * from "./rest/useAppointment";

export function getDifference<T>(a: T[], b: T[]): T[] {
    return a.filter((element) => {
        return !b.includes(element);
    });
}

export function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export const ConditionalWrapper = ({...props}) => {
    const {condition, wrapper, children} = props;
    return condition ? wrapper(children) : children;
}
