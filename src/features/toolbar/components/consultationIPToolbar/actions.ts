import { createAction } from "@reduxjs/toolkit";

export const SetEnd = createAction<any>("consultation/setEnd")
export const SetExam = createAction<any>("consultation/setExam")
export const SetFiche = createAction<any>("consultation/setFiche")
export const SetPatient = createAction<any>("consultation/setPatient")
export const SetMutation = createAction<any>("consultation/setMutation")
export const SetMutationDoc = createAction<any>("consultation/setMutationDoc")
export const SetSubmit = createAction<any>("consultation/setSubmit")
export const SetSelectedApp = createAction<any>("consultation/setSelectedApp")
export const SetSelectedDialog = createAction<any>("consultation/setSelectedDialog")
export const SetAppointement = createAction<any>("consultation/setAppointement")
