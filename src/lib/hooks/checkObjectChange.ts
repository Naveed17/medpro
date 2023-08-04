import get from 'lodash/get';
import set from "lodash/set";

export const checkObjectChange = (initObj: any, resultObj: any) => {
    let resultObject: any = {}
    Object.entries(initObj)?.map(entry => {
        const [key, oldVal] = entry;
        const newVal = get(resultObj, key)
        if (newVal !== oldVal) {
            set(resultObject, key, newVal)
        }
    });

    return resultObject;
}
