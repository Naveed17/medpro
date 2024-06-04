import React from 'react';
import { TextField } from "@mui/material";

const CustomInput = React.forwardRef(function custom(props, ref) {
    return (
        <TextField
            {...props}
            inputRef={ref}
            {...((props as any)?.InputProps?.sx && { sx: (props as any)?.InputProps?.sx })}
            fullWidth
        />
    )
})

export default CustomInput;
