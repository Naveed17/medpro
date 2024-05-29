import {createAction} from "@reduxjs/toolkit"

export const setOpenChat = createAction<boolean>('chat/setOpenChat')
export const setMessage = createAction<string>('chat/setMessage')
export const setChannel = createAction<any>('chat/setChannel')
