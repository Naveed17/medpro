import {Collapse, Stack, TextField, Typography,} from "@mui/material";
import {motion} from "framer-motion";
import {DatePicker} from "@features/datepicker";
import React from "react";
import Step2 from "./step2";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {SetAgreement, stepperSelector} from "@features/stepper";
import Autocomplete from "@mui/material/Autocomplete";
import IconUrl from "@themes/urlIcon";

function Step1({...props}) {
    const {t, collapse, insurances} = props;
    const {agreement} = useAppSelector(stepperSelector);
    const dispatch = useAppDispatch();

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
                        {t(`dialog.stepper.${agreement.type}`)}{" "}
                        <Typography variant="caption" color="error">
                            *
                        </Typography>
                    </Typography>

                    {agreement.type === "insurance" ? <Autocomplete
                        options={insurances}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option: any, value) => option.name === value.name}
                        value={agreement.insurance}
                        popupIcon={<IconUrl path={"mdi_arrow_drop_down"}/>}
                        size={"small"}
                        onChange={(event, newValue) => {
                            let _agreement = {...agreement}
                            _agreement.insurance = newValue
                            dispatch(SetAgreement(_agreement))
                            /* setFieldValue("insurance", {
                                 ...values.insurance,
                                 select_insurance: newValue
                             });*/
                        }}
                        renderInput={(params) => (
                            <TextField {...params} placeholder={t('dialog.stepper.select_insurance')} variant="outlined"/>
                        )}
                    /> : <TextField
                        value={agreement?.name}
                        onChange={(event) => {
                            let _agreement = {...agreement}
                            _agreement.name = event.target.value
                            dispatch(SetAgreement(_agreement))
                        }}
                        placeholder={t("dialog.stepper.name")}
                    />}


                </Stack>
                <Stack spacing={0.5} width={1}>
                    <Typography variant="body2" color="text.secondary">
                        {t("dialog.stepper.description")}
                    </Typography>
                    <TextField
                        value={agreement?.label}
                        onChange={(event) => {
                            let _agreement = {...agreement}
                            _agreement.label = event.target.value
                            dispatch(SetAgreement(_agreement))
                        }}
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
                            let _agreement = {...agreement}
                            _agreement.startDate = newValue;
                            dispatch(SetAgreement(_agreement))
                        }}
                    />
                </Stack>
                <Stack spacing={0.5} width={1}>
                    <Typography variant="body2" color="text.secondary">
                        {t("dialog.stepper.end_date")}
                    </Typography>
                    <DatePicker
                        value={agreement?.endDate}
                        onChange={(newValue: any) => {
                            let _agreement = {...agreement}
                            _agreement.endDate = newValue;
                            dispatch(SetAgreement(_agreement))
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
