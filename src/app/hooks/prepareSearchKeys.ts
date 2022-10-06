import {ActionBarState} from "@features/leftActionBar";

export const prepareSearchKeys = (filter: ActionBarState | undefined) => {
  let query = "";
  if (filter) {
    Object.entries(filter).map((param, index) => {
      if (param[0] === "patient" && param[1]) {
        Object.entries(param[1]).map(deepParam => {
          if (deepParam[1]) {
            query += `&${deepParam[0]}=${deepParam[1]}`;
          }
        })
      }
      if (param[0] === "type" && param[1]) {
        query += `&${param[0]}=${param[1]}`;
      }
    });
  }
  return query;
}
