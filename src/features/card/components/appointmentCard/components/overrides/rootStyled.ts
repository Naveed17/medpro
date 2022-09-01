import {styled} from '@mui/material/styles'

import {Card} from '@mui/material'

const RootStyled = styled(Card)(({theme}) => {
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
            '& .code-scan-container': {
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: `3px solid ${theme.palette.warning.main}`,
                borderRadius: "15px",
                width: 106,
                height: 106,
                zIndex: 1,
                [theme.breakpoints.down('sm')]: {
                    width: 90,
                    height: 90,
                },
                '& .code-wrapper': {
                    "&::before": {
                        content: "''",
                        position: "absolute",
                        height: "calc(100% + 10px)",
                        width: "50%",
                        backgroundColor: "white",
                        top: -5,
                        left: "25%",
                        zIndex: -1,
                    },
                    "&::after": {
                        content: "''",
                        position: "absolute",
                        height: "50%",
                        width: "calc(100% + 10px)",
                        backgroundColor: "white",
                        top: "25%",
                        left: -5,
                        zIndex: -1,
                    }
                }
            }
        }
    }
});
export default RootStyled;
