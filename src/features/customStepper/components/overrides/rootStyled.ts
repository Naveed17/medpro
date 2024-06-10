import {styled} from "@mui/material/styles";

const RootStyled = styled("div")(({theme}) => ({
    backgroundColor: theme.palette.background.paper,
    height: "inherit",
    "& .stepper-tabs": {
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(0, 0.5),
        "& .MuiTabs-flexContainer": {
            justifyContent: "flex-start",
        },
        button: {
            borderBottom: `2px solid ${theme.palette.grey[200]}`,
            flex:1,
            minWidth:'fit-content',
            borderRadius: 0,
            transition: "all 0.3s ease-in-out",
            [theme.breakpoints.down("sm")]: {
                padding: theme.spacing(0.5, 1),
                minWidth: "auto",
                fontSize: theme.typography.body2.fontSize,
            },
            "&.Mui-disabled": {
                borderBottomWidth: 2,
            },
            "&.Mui-selected": {
                color: theme.palette.primary.main,
                borderBottom: "2px solid transparent",
                ".tab-icon":{
                    border: "2px solid " + theme.palette.primary.main,
                    boxShadow: "0px 0px 0px 2px rgba(6, 150, 214, 0.25)",
                    backgroundColor: theme.palette.common.white,
                    '.dot':{
                        backgroundColor: theme.palette.primary.main,
            
                    }

                }
            },
        },
        "& .submitted": {
            borderBottom: "2px solid " + theme.palette.primary.main,
            ".tab-icon":{
                    border: "2px solid transparent",
                    backgroundColor: theme.palette.primary.main,
                    boxShadow: "none",
                    '.dot':{
                        backgroundColor: theme.palette.common.white,
                        position:'relative',
                        "&::before":{
                            content:"''",
                            position:'absolute',
                            display: "inline-block",
                            left: 4,
                            top: 1.5,
                            transform: "rotate(45deg)",
                            height: 7,
                            width: 4,
                            borderBottom: `1.5px solid ${theme.palette.primary.main}`,
                            borderRight: `1.5px solid${theme.palette.primary.main}`,
                        }
            
                    }

                }
        },
        "& .pending": {
            borderBottom: "2px solid " + theme.palette.grey[500],
        },
        ".MuiTabs-indicator":{
            backgroundColor: theme.palette.primary.light
        },
    },
    '& div[role="tabpanel"]': {
        overflow: "auto",
    },
    "& div[role='tabpanel'] > div": {
        "& .inner-section": {
            height: "calc(100vh - 160px)",
            overflow: "auto",
            padding: theme.spacing(3),
            "& .inner-box": {
                marginTop: 12,
            },

            "&.type-time-slot": {
                padding: 0,
                ".MuiFormControl-root": {
                    padding: 0,
                },
                ".MuiFormControlLabel-root": {
                    margin: 0,
                },
                ".MuiFormGroup-root": {
                    padding: theme.spacing(2),
                },
            },
        },
        "& .action": {
            padding: theme.spacing(1, 3),
            marginTop: theme.spacing(3),
            position: "absolute",
            width: "100%",
            bottom: "1rem",
            left: 0,
        },
        [theme.breakpoints.down("md")]: {
            padding: 0,
            paddingTop: theme.spacing(3),
        },
    },
}));
export default RootStyled;
