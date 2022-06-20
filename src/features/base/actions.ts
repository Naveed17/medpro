import { createAction } from "@reduxjs/toolkit"

export const setTheme = createAction<string>('theme/setTheme')
export const setDirection = createAction<string>('theme/setDirection')
export const setLocalization = createAction<string>('theme/setLocalization')
