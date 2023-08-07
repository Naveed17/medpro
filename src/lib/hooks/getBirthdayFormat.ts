import {getBirthday} from "@lib/hooks/getBirthday";

export const getBirthdayFormat = (patient: PatientModel, t: any, keyPrefix?: string) => {
    const birthday = getBirthday(patient?.birthdate);
    return `${birthday.years ? `${birthday.years} ${t(`${keyPrefix ? `${keyPrefix}.` : ""}years`).toLowerCase()}${birthday.years <= 2 ? "," : ""} ` : ""}
         ${birthday.years <= 2 && birthday.months ? `${birthday.months} ${t(`${keyPrefix ? `${keyPrefix}.` : ""}months`).toLowerCase()}, ` : ""} 
         ${birthday.years <= 2 && birthday.days ? `${birthday.days} ${t(`${keyPrefix ? `${keyPrefix}.` : ""}days`).toLowerCase()}` : ""}`;
}
