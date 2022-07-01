import { createAction } from "@reduxjs/toolkit";

export const setQs = createAction<Question | null>('qsSidebar/setQs');
