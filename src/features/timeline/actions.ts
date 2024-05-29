import {createAction} from "@reduxjs/toolkit"

export const setShowDetails = createAction<boolean>('timeLine/setShowDetails')
export const setShowStats = createAction<boolean>('timeLine/setShowStats')
export const setShowTimeline = createAction<boolean>('timeLine/setShowTimeline')
