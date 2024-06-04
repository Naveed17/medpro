import React, {memo} from "react";
import {TextField} from "@mui/material";

const MyTextInput: any = memo(({...props}) => {
    return (
        <TextField {...props} />
    );
})
MyTextInput.displayName = "TextField";

export default MyTextInput;
