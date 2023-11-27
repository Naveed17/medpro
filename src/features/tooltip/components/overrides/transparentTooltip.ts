import {styled} from '@mui/material/styles';
import Tooltip, {TooltipProps, tooltipClasses} from '@mui/material/Tooltip';

const TransparentTooltip = styled(Tooltip)<TooltipProps>(({theme, className, ...props}) => ({
    [`& .MuiTooltip-popper`]: {
        background: "transparent"
    },
}));
export default TransparentTooltip;
