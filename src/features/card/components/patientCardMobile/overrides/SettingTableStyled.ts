import {styled} from "@mui/material/styles";

const SettingTableStyled = styled(`div`)(({theme}) => ({
    marginBottom: 8,
    " & .patient-config-list": {
       
        paddingTop: 0,
        paddingBottom: 0,
        "& .MuiListItem-root": {
            backgroundColor:theme.palette.primary.lighter,
            borderWidth: "1px",
            borderColor: theme.palette.primary.light,
            borderStyle: "dashed",
            padding: "8px",
            paddingLeft: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            ".MuiListItemAvatar-root":{
                minWidth:30,
            },
            ".consultation-label":{
                color:theme.palette.common.white
            }
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
