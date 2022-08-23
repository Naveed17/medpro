import { Card } from '@mui/material'
import { styled } from '@mui/material/styles'
const AppointmentCardStyled = styled(Card)(({ theme }) => {
    return {
        border: 'none',
        '& .MuiCardContent-root': {
            padding: theme.spacing(1),
            '& .MuiList-root': {
                '& .MuiListItem-root': {
                    padding: theme.spacing(1, 0.3),
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    '& .lable': {
                        width: '10px',
                        height: '10px',
                        padding: '0px',
                        minWidth: '1px',
                    },
                    '& .time svg': {
                        width: 12,
                        height: 12,
                        '& path': {
                            fill: theme.palette.text.primary,
                        }
                    },
                    '& .date': {
                        fontWeight: 600,
                    },
                    '& .callander': {
                        '& svg': {
                            width: 12,
                            height: 12,
                        }
                    },
                    '& .time-slot': {
                        fontWeight: 700,
                    },
                }
            },


        }
    }
});
export default AppointmentCardStyled;