import React from 'react';
import {TextField} from "@mui/material";

const CustomInput = React.forwardRef(function custom(props, ref) {
    return (
        <TextField
            {...props}
            inputRef={ref}
            sx={{
                "& .MuiInputBase-root": {
                    paddingLeft: 0,
                }
            }}
            fullWidth
        />
    )
})

export default CustomInput;
