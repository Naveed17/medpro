import {ActionBarState} from "@features/leftActionBar";

export const prepareSearchKeys = (filter: ActionBarState | undefined) => {
    let query = "";
    if (filter) {
        Object.entries(filter).forEach((param) => {
            if (param[0] === "patient" && param[1]) {
                Object.entries(param[1]).forEach(deepParam => {
                    if (deepParam[1]) {
                        query += `&${deepParam[0]}=${deepParam[1]}`;
                    }
                })
            }

            if (["type", "status", "isOnline", "acts", "disease"].includes(param[0]) && param[1]) {
                query += `&${param[0]}=${param[1]}`;
            }

            if (param[0] === "reasons" && param[1]) {
                query += `&consultionReasons=${param[1]}`;
            }
        });
    }
    return query;
}
