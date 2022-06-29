import React from "react";
import Switch from "@mui/material/Switch";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelIcon from "@mui/icons-material/Cancel";
const label = { inputProps: { "aria-label": "Switch demo" } };

function CustomToggle({...props}){
    const { onChange, value } = props;
    return(
        <Switch
            {...label}
            value={value}
            onChange={(e) => onChange(e)}
            checkedIcon={<CheckCircleRoundedIcon />}
            icon={<CancelIcon />}
            sx={{ "& .MuiSwitch-switchBase": { p: "6px" } }}
        />
    )
}

export default CustomToggle;
