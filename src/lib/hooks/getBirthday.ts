import moment from "moment-timezone";
require('moment-precise-range-plugin');

export const getBirthday = (birthdate: string) => {
    return moment().preciseDiff(moment(birthdate, "DD-MM-YYYY"), true);
}
