import {createAction} from "@reduxjs/toolkit"

export const setPermissions = createAction<{ [key: string]: any[] } | null>('casl/setPermissions')
