import {createReducer} from '@reduxjs/toolkit';
import {
    setShowDetails
} from './actions';

export type timeLineState = {
    showDetails: boolean;
};

const initialState: timeLineState = {
    showDetails: false
};

export const timeLineReducer = createReducer(initialState, builder => {
    builder.addCase(setShowDetails, (state, action: any) => {
        state.showDetails = action.payload;
    });
});
