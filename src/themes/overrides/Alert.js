import * as React from 'react';
import Alert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';
import IconUrl from "@themes/urlIcon";
const RootStyle = styled(Alert)(({ theme, styleprops }) => ({
    //width: '100%',
    border: 0,
    padding: theme.spacing(0.3, 2,0,2),
    '& svg path': {
        fill: theme.palette[styleprops].main,
    }

}));

export default function BasicAlert({ children, ...props }) {
    const { icon, color, data,onChange, ...rest } = props;
    return (
        <RootStyle onClick={onChange} styleprops={color} icon={<IconUrl path={icon} />} severity={color} sx={rest.sx}>
            {data}
        </RootStyle >

    );
}
