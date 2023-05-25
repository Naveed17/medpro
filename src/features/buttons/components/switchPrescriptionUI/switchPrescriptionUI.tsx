import React, {useState} from "react";
import {Stack, Typography, useTheme} from "@mui/material";
import Switch from "@mui/material/Switch";

function SwitchPrescriptionUI({...props}) {
    const {t, keyPrefix = null, handleSwitchUI} = props;
    const theme = useTheme();

    const localStorageSwitchUI = localStorage.getItem("prescription-switch-ui");
    const [switchUI, setSwitchUI] = useState(localStorageSwitchUI !== null ? JSON.parse(localStorageSwitchUI) : true);

    return (<Stack direction="row" spacing={1} alignItems="center">
        <Typography>{t(`${keyPrefix ? `${keyPrefix}.` : ""}ui_classic`)}</Typography>
        <Switch
            sx={{
                '& .MuiSwitch-thumb': {
                    backgroundColor: theme.palette.info.main
                }
            }}
            color="default"
            checked={switchUI}
            onChange={event => {
                localStorage.setItem("prescription-switch-ui", event.target.checked as any);
                setSwitchUI(event.target.checked);
                handleSwitchUI && handleSwitchUI();
            }}
            inputProps={{'aria-label': 'controlled'}}/>
        <Typography>{t(`${keyPrefix ? `${keyPrefix}.` : ""}ui_new`)}</Typography>
    </Stack>)
}

export default SwitchPrescriptionUI;
