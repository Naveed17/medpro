import React, {useState} from 'react';
import {Button, Stack, TextField, Typography} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import IconUrl from "@themes/urlIcon";

const AddInsurance = ({...props}) => {
    const {t,setAddNew} = props;

    const [selectedInsurance, setSelectedInsurance] = useState("");

    const options = ["", "A", "B"]

    return (
        <Stack spacing={1}>
            <Typography
                className="label"
                variant="body2"
                color="text.secondary">
                {t("insurance.agreement")}
            </Typography>

            <Autocomplete
                options={options}
                getOptionLabel={(option) => option}
                value={selectedInsurance}
                popupIcon={<IconUrl path={"mdi_arrow_drop_down"}/>}
                size={"small"}
                onChange={(event, newValue) => setSelectedInsurance(newValue)}
                renderInput={(params) => (
                    <TextField {...params} placeholder={t('insurance.select')} variant="outlined"/>
                )}
            />

            <Stack direction={"row"} spacing={1}>
                <Stack spacing={1} style={{width: "100%"}}>
                    <Typography
                        className="label"
                        variant="body2"
                        color="text.secondary">
                        {t("insurance.member")}
                    </Typography>
                    <Autocomplete
                        options={options}
                        getOptionLabel={(option) => option}
                        value={selectedInsurance}
                        popupIcon={<IconUrl path={"mdi_arrow_drop_down"}/>}
                        size={"small"}
                        onChange={(event, newValue) => setSelectedInsurance(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} placeholder={t('insurance.member_placeholder')} variant="outlined"/>
                        )}
                    />

                </Stack>

                <Stack spacing={1} style={{width: "100%"}}>
                    <Typography
                        className="label"
                        variant="body2"
                        color="text.secondary">
                        {t("insurance.cashbox")}
                    </Typography>
                    <Autocomplete
                        options={options}
                        getOptionLabel={(option) => option}
                        value={selectedInsurance}
                        popupIcon={<IconUrl path={"mdi_arrow_drop_down"}/>}
                        size={"small"}
                        onChange={(event, newValue) => setSelectedInsurance(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} placeholder={t('insurance.cashbox_placeholder')} variant="outlined"/>
                        )}
                    />
                </Stack>

            </Stack>
            <Stack direction={"row"} spacing={1}>
                <Stack spacing={1} style={{width: "100%"}}>
                    <Typography
                        className="label"
                        variant="body2"
                        color="text.secondary">
                        {t("insurance.insured")}
                    </Typography>
                    <Autocomplete
                        options={options}
                        getOptionLabel={(option) => option}
                        value={selectedInsurance}
                        popupIcon={<IconUrl path={"mdi_arrow_drop_down"}/>}
                        size={"small"}
                        onChange={(event, newValue) => setSelectedInsurance(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} placeholder={t('insurance.insured_placeholder')} variant="outlined"/>
                        )}
                    />
                </Stack>
                <Stack spacing={1} style={{width: "100%"}}>
                    <Typography
                        className="label"
                        variant="body2"
                        color="text.secondary">
                        {t("insurance.apci")}
                    </Typography>
                    <Autocomplete
                        options={options}
                        getOptionLabel={(option) => option}
                        value={selectedInsurance}
                        popupIcon={<IconUrl path={"mdi_arrow_drop_down"}/>}
                        size={"small"}
                        onChange={(event, newValue) => setSelectedInsurance(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} placeholder={t('insurance.apci_placeholder')} variant="outlined"/>
                        )}
                    />

                </Stack>
            </Stack>

            <Button variant={"contained"} onClick={()=>setAddNew(false)}>{t('save')}</Button>
        </Stack>
    );
}

export default AddInsurance;
