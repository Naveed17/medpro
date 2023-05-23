import React, {useState} from "react";
import {Stack, Typography} from "@mui/material";
import Switch from "@mui/material/Switch";

function SwitchPrescriptionUI({...props}) {
    const {t, handleSwitchUI} = props;
    const localStorageSwitchUI = localStorage.getItem("prescription-switch-ui");
    const [switchUI, setSwitchUI] = useState(localStorageSwitchUI !== null ? JSON.parse(localStorageSwitchUI) : true);

    return (<Stack direction="row" mb={1} spacing={1} alignItems="center">
        <Typography>{t(`${switchUI ? "switch_" : ""}ui_classic`)}</Typography>
        <Switch
            checked={switchUI}
            onChange={event => {localStorage.setItem("prescription-switch-ui", event.target.checked as any);
                setSwitchUI(event.target.checked);
                handleSwitchUI && handleSwitchUI();
            }}
            inputProps={{'aria-label': 'controlled'}}/>
        <Typography>{t(`${!switchUI ? "switch_" : ""}ui_new`)}</Typography>
    </Stack>)
}

export default SwitchPrescriptionUI;
