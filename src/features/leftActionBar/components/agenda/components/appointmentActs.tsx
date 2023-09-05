import {useMedicalEntitySuffix, useMedicalProfessionalSuffix} from "@lib/hooks";
import {useRouter} from "next/router";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import React, {useState} from "react";
import {useTranslation} from "next-i18next";
import {useRequest} from "@lib/axios";
import {Autocomplete, Divider, Stack, TextField} from "@mui/material";
import {leftActionBarSelector, setFilter} from "@features/leftActionBar";
import MenuItem from "@mui/material/MenuItem";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FormControl from "@mui/material/FormControl";
import {SWRNoValidateConfig} from "@lib/swr/swrProvider";
import _ from "lodash";

function AppointmentActs() {
    const {medical_professional} = useMedicalProfessionalSuffix();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [selectedActs, setSelectedActs] = useState<string[]>([]);

    const {t} = useTranslation('common');
    const {query: filter} = useAppSelector(leftActionBarSelector);

    const {data: httpActSpeciality} = useRequest(medical_professional ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/professionals/${medical_professional?.uuid}/acts/${router.locale}`
    } : null, SWRNoValidateConfig);

    const acts = (httpActSpeciality as HttpResponse)?.data.reduce((actsUpdate: any[], data: any) => [...(actsUpdate ?? []), {...data?.act, medicalProfessionalAct: data.uuid}], []) as any[];

    return (
        <FormControl component="form" fullWidth>
            <Autocomplete
                id={"select-act"}
                disabled={!acts}
                multiple
                autoHighlight
                disableClearable
                size="small"
                value={acts && selectedActs.length > 0 ? acts.filter(act => selectedActs.includes(act?.medicalProfessionalAct ?? "")) : []}
                onChange={(e, newValue: any[]) => {
                    e.stopPropagation();
                    const actsUuid = newValue.map(act => act.medicalProfessionalAct);
                    setSelectedActs(actsUuid);
                    dispatch(setFilter({...filter, acts: actsUuid.length === 0 ? undefined : actsUuid.join(",")}));
                }}
                sx={{color: "text.secondary"}}
                options={acts ?? []}
                loading={acts?.length === 0}
                getOptionLabel={(option) => {
                    // Value selected with enter, right from the input
                    if (typeof option === 'string') {
                        return option;
                    }
                    // Add "xxx" option created dynamically
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    // Regular option
                    return option.name;
                }}
                isOptionEqualToValue={(option: any, value) => option.name === value?.name}
                renderOption={(props, option) => (
                    <Stack key={option.medicalProfessionalAct ? option.medicalProfessionalAct : "-1"}>
                        {!option.uuid && <Divider/>}
                        <MenuItem
                            {...props}
                            {...(!option.medicalProfessionalAct && {sx: {fontWeight: "bold"}})}
                            value={option.medicalProfessionalAct}>
                            {!option.medicalProfessionalAct && <AddOutlinedIcon/>}
                            {option.name}
                        </MenuItem>
                    </Stack>
                )}
                renderInput={params =>
                    <TextField color={"info"}
                               {...params}
                               InputProps={{
                                   ...params.InputProps,
                                   endAdornment: (
                                       <React.Fragment>
                                       </React.Fragment>
                                   ),
                               }}
                               placeholder={t("acts-consultation-placeholder")}
                               sx={{
                                   paddingLeft: 0,
                                   whiteSpace: "nowrap",
                                   overflow: "hidden",
                                   textOverflow: "ellipsis"
                               }}
                               variant="outlined" fullWidth/>}/>
        </FormControl>)
}

export default AppointmentActs;
