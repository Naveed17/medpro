import { createAction } from "@reduxjs/toolkit"
import {dashLayoutState} from "@features/base";

export const setOngoing = createAction<dashLayoutState>('dashLayout/setOngoing')
