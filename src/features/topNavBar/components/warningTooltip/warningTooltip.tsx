import * as React from 'react';
import {styled} from '@mui/material/styles';
import Tooltip, {TooltipProps, tooltipClasses} from '@mui/material/Tooltip';

const WarningTooltip = styled(({className, ...props}: TooltipProps) => (
    <Tooltip {...props} classes={{popper: className}}/>
))(({theme}) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.warning.main,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: "none",
        fontSize: 11,
    },
}));

export default WarningTooltip;
