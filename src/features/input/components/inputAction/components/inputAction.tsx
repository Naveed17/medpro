import React from 'react';
import { Input, InputAdornment, TextField } from '@mui/material';
import InputActionStyled from './overrides/InputActionStyle';

const inputAction = React.forwardRef(function inputAction(props: any, ref?: React.LegacyRef<HTMLInputElement> | undefined) {
    const { startAction = null, endAction, component: Component, ...rest } = props;
    const inputRender = ({ ...props }) => (
        <TextField
            {...props}
            InputProps={{
                ...(startAction && {
                    startAdornment: <InputAdornment position="start">{startAction}</InputAdornment>,
                }),
                ...(endAction && {
                    endAdornment: <InputAdornment position="end">{endAction}</InputAdornment>
                })
            }}
        />

    )
    const InputComponent = Component ?? inputRender;
    return (
        <InputActionStyled>
            <InputComponent
                {...rest}
                inputRef={ref} />
        </InputActionStyled>

    );
});

export default inputAction