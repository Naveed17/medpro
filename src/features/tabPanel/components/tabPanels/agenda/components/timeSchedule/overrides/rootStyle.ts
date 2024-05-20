import {Box,styled} from '@mui/material';
const RootStyled  = styled(Box)(({theme})=>({
    ".rdv-date-picker":{
        border:`1px solid ${theme.palette.grey[100]}`,
        borderRadius:theme.shape.borderRadius,
        height:300,
    ".MuiPickersLayout-contentWrapper":{
        ".MuiDateCalendar-root":{
            margin:0,
            ".picker-header":{
            backgroundColor:theme.palette.grey[50],
            ".MuiTypography-root":{
                fontSize:16,
                fontWeight:500,
            },
            ".MuiDivider-root":{
                display:'none'
            }
            }
        }
    },
    ".MuiPickersDay-root":{
        width:30,
        height:30,
    },
    ".MuiDayCalendar-weekDayLabel":{
        width:30,
        height:40
    }
},
".time-slot-container":{
    ".MuiChip-root":{
        border:`1px solid ${theme.palette.grey[200]}`,
        borderRadius:theme.shape.borderRadius,
        backgroundColor:'transparent',
    }
}

}));
export default RootStyled;