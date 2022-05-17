import {RootState} from "../../app/store";
import {createSelector} from "reselect";

export const setConfig = (state: RootState) => state.theme;

export const configSelector = createSelector(setConfig, state => state);
