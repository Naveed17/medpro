import React from 'react';
import {TextField} from "@mui/material";

const CustomInput = React.forwardRef(function custom(props, ref) {
    return (
        <TextField
            {...props}
            inputRef={ref}
            fullWidth
        />
    )
})

export default CustomInput;
