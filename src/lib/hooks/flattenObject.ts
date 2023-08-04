export function flattenObject(ob: any) {
    let toReturn: any = {};

    for (let i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if (typeof ob[i] == "object" && ob[i] !== null) {
            let flatObject = flattenObject(ob[i]);
            for (let x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + "." + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}
