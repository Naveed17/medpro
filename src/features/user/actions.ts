import { createAction } from "@reduxjs/toolkit"

export const setAccessToken = createAction<string>('user/setAccessToken')
export const setUserData = createAction<string>('user/setUserData')
