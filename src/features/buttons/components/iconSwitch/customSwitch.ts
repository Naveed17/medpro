import {styled} from "@mui/material";
import Switch from '@mui/material/Switch';

const IconSwitch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
        borderRadius: 22 / 2,
        backgroundColor: theme.palette.divider,
        
        '&:after': {
            content: '""',
            position: 'absolute',
            width: 16,
            height: 16,
            backgroundImage: `url('data:image/svg+xml;utf8,<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6.00012" r="5" stroke="white" stroke-width="2"/></svg>')`,
            backgroundRepeat:'no-repeat',
            right:theme.direction === 'rtl' ? 12 :  9,
            top:12.5
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: 'none',
        backgroundColor: theme.palette.common.white,
        width: 16,
        height: 16,
        margin: 2,
    },
    ".Mui-checked":{
    "&.Mui-checked":{
        "& + .MuiSwitch-track":{
            backgroundColor:theme.palette.primary.main,
            opacity:1,
        }
    }
    }
}));

export default IconSwitch;
