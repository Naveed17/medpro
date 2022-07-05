import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
const QuestionStyled = styled(Box)(({ theme }) => ({
    marginLeft: '-20px',
    [theme.breakpoints.down("md")]: {
        marginRight: '-16px',
        marginLeft: '-16px',
    },
    "& .tab-container": {
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
        paddingTop: theme.spacing(1),
        '& .MuiTab-root': {
            flex: 1,
            color: theme.palette.text.primary,
            '&.Mui-selected': {
                color: theme.palette.primary.main,
            }
        }

    },
    '& .MuiTabPanel-root': {
        padding: 0,
        '& .MuiList-root': {
            padding: 0,
            paddingTop: theme.spacing(1),
            '& .MuiListItem-root': {
                flexDirection: 'column',
                alignItems: 'flex-start',
                borderBottom: `1px solid ${theme.palette.grey[300]}`,
                paddingBottom: theme.spacing(2),
                cursor: 'pointer',
                '& .MuiBox-root': {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    '& .date-container': {
                        color: theme.palette.text.secondary,
                        display: 'flex',
                        alignItems: 'center',
                        '& .react-svg': {
                            marginRight: '5px',
                            '& svg': {
                                width: '11px', height: '11px',
                                '& path': {
                                    fill: theme.palette.text.secondary
                                }
                            }
                        }
                    },

                },
                "& .link": {
                    marginTop: theme.spacing(2),
                    fontSize: theme.typography.body2.fontSize,
                    textDecoration: 'none'
                }
            }
        }
    }

}));
export default QuestionStyled;