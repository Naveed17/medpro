import {createAction} from "@reduxjs/toolkit";

export const toggleEdit = createAction('patientDetail/toggleEdit');
export const onOpenDialog = createAction<boolean>('patientDetail/onOpenDialog');
export const resetDialog = createAction('patientDetail/resetDialog');
export const setUuid = createAction<any>('patientDetail/setUuid');
export const setDialogData = createAction<any>('patientDetail/setDialogData');

