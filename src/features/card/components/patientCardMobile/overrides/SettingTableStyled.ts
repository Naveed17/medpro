import {styled} from "@mui/material/styles";

const SettingTableStyled = styled(`div`)(({theme}) => ({
    marginBottom: 8,
    " & .patient-config-list": {
        paddingTop: 0,
        paddingBottom: 0,
        "& .MuiListItem-root": {
            backgroundColor: theme.palette.background.paper,
            borderWidth: "1px 1px 1px 4px",
            borderColor: "#dddddd",
            borderStyle: "solid",
            padding: "8px",
            paddingLeft: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            "&.pending": {
                borderLeftColor: theme.palette.warning.main,
            },
            "&.warning": {
                borderLeftColor: theme.palette.warning.main,
            },
            "&.completed": {
                borderLeftColor: theme.palette.success.main,
            },
            "&.error": {
                borderLeftColor: theme.palette.error.main,
            },
        },
        "& .settings-icon": {
            transform: "rotate(90deg)",
            fontSize: 20,
        },
        "& .check-icon": {
            fontSize: 20,
        },
        "& .more-icon-btn": {
            width: 22,
            height: 22,
        },
        '& .MuiIconButton-root[variant="custom"]': {
            width: 33,
            height: 32,
            marginLeft: 4,
        },
    },
}));

export default SettingTableStyled;
