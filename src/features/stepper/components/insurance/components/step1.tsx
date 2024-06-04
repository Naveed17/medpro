import {Collapse, ListItem, ListItemText, Stack, TextField, Typography,} from "@mui/material";
import {motion} from "framer-motion";
import {DatePicker} from "@features/datepicker";
import React, {useEffect, useState} from "react";
import Step2 from "./step2";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {SetAgreement, stepperSelector} from "@features/stepper";
import Autocomplete from "@mui/material/Autocomplete";
import IconUrl from "@themes/urlIcon";
import moment from "moment-timezone";

function Step1({...props}) {
    const {t, collapse, insurances, agreements} = props;

    const agreementList = agreements.filter((ag: any) => ag.insurance?.isConvention).reduce((acc: any, current: any) => {
        const x = acc.find((item: any) => item.mutual === current.mutual);
        if (!x) {
            acc.push(current);
        }
        return acc;
    }, []);

    const {agreement} = useAppSelector(stepperSelector);

    let [selectedAgreement, setSelectedAgreement] = useState(agreement?.name || '');

    const dispatch = useAppDispatch();

    const handleInputChange = (event: any, newInputValue: any) => {
        setSelectedAgreement(newInputValue);
    };

    const handleChange = (event: any, newValue: any) => {
        if (newValue && typeof newValue === 'object') {
            setSelectedAgreement(newValue); // Assuming 'mutual' is the value you want from the selected option
        } else {
            setSelectedAgreement(newValue);
        }
    };


    useEffect(() => {
        if (selectedAgreement && typeof selectedAgreement === 'object') {
            dispatch(SetAgreement({
                ...agreement,
                insurance: selectedAgreement.insurance,
                name: selectedAgreement.mutual
            }))
        } else
            dispatch(SetAgreement({...agreement,  name: selectedAgreement}))
    }, [selectedAgreement]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Stack component={motion.div}
               key="step1"
               initial={{opacity: 0}}
               animate={{opacity: 1}}
               exit={{opacity: 0}}
               transition={{duration: 0.5}}
               spacing={2}
               pb={5}>
            <Stack
                width={1}
                direction={{xs: "column", sm: "row"}}
                alignItems="center"
                spacing={2}>
                <Stack spacing={0.5} width={1}>
                    <Typography variant="body2" color="text.secondary">
                        {t(`dialog.stepper.${agreement?.type}`)}{" "}
                        <Typography variant="caption" color="error">
                            *
                        </Typography>
                    </Typography>

                    {agreement && agreement.type === "insurance" ? <Autocomplete
                        options={insurances}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option: any, value) => option.name === value.name}
                        value={agreement.insurance}
                        popupIcon={<IconUrl path={"mdi_arrow_drop_down"}/>}
                        size={"small"}
                        onChange={(event, newValue) => {
                            dispatch(SetAgreement({...agreement, insurance: newValue}))
                        }}
                        renderInput={(params) => (
                            <TextField {...params} placeholder={t('dialog.stepper.select_insurance')}
                                       variant="outlined"/>
                        )}
                    /> : <Autocomplete
                        id={"role"}
                        autoHighlight
                        size="small"
                        options={agreementList}
                        freeSolo
                        value={agreement?.name}
                        onInputChange={handleInputChange}
                        onChange={handleChange}
                        getOptionLabel={(option) => {
                            if (typeof option === 'string') {
                                return option;
                            }
                            if (option.inputValue) {
                                return option.inputValue;
                            }
                            return option.mutual;
                        }}
                        renderOption={(props, option) => (
                            <ListItem {...props}>
                                <ListItemText primary={option?.mutual}/>
                            </ListItem>
                        )}
                        sx={{color: "text.secondary"}}
                        renderInput={params =>
                            <TextField
                                {...params}
                                color={"info"}
                                sx={{paddingLeft: 0}}
                                placeholder={t("dialog.stepper.name")}
                                variant="outlined"
                                fullWidth/>}/>
                    }
                </Stack>
                <Stack spacing={0.5} width={1}>
                    <Typography variant="body2" color="text.secondary">
                        {t("dialog.stepper.description")}
                    </Typography>
                    <TextField
                        value={agreement?.label}
                        onChange={(event) => dispatch(SetAgreement({...agreement, label: event.target.value}))}
                        placeholder={t("dialog.stepper.placeholer_description")}
                    />
                </Stack>
            </Stack>
            <Stack width={1} direction="row" alignItems="center" spacing={2}>
                <Stack spacing={0.5} width={1}>
                    <Typography variant="body2" color="text.secondary">
                        {t("dialog.stepper.start_date")}{" "}
                    </Typography>
                    <DatePicker
                        value={agreement?.startDate}
                        onChange={(newValue: any) => {
                            dispatch(SetAgreement({...agreement, startDate:newValue}))
                        }}/>
                </Stack>
                <Stack spacing={0.5} width={1}>
                    <Typography variant="body2" color="text.secondary">
                        {t("dialog.stepper.end_date")}
                    </Typography>
                    <DatePicker
                        value={agreement?.endDate}
                        onChange={(newValue: any) => {
                            dispatch(SetAgreement({...agreement,endDate:newValue}))
                        }}
                    />
                </Stack>
            </Stack>
            <Collapse in={collapse}>
                <Step2 {...props} />
            </Collapse>
        </Stack>
    );
}

export default Step1;
