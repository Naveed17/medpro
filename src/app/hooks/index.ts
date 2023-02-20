import moment from "moment-timezone";

require('moment-precise-range-plugin');
export {default as useIsMountedRef} from "./useIsMountedRef";
export {default as useDateConverture} from "./useDateConverture";
export {default as unsubscribeTopic} from "./unsubscribeTopic";
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

export const getBirthdayFormat = (patient: PatientModel, t: any, keyPrefix?: string) => {
    const birthday = moment().preciseDiff(moment(patient?.birthdate, "DD-MM-YYYY"), true);
    return `${birthday.years ? `${birthday.years} ${t(`${keyPrefix ? `${keyPrefix}.` : ""}years`).toLowerCase()}${birthday.years <= 2 ? "," : ""} ` : ""}
         ${birthday.years <= 2 && birthday.months ? `${birthday.months} ${t(`${keyPrefix ? `${keyPrefix}.` : ""}months`).toLowerCase()}, ` : ""} 
         ${birthday.years <= 2 && birthday.days ? `${birthday.days} ${t(`${keyPrefix ? `${keyPrefix}.` : ""}days`).toLowerCase()}` : ""}`;
};
