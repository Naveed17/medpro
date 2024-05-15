import {Collapse, ListItem, ListItemText, Stack, TextField, Typography,} from "@mui/material";
import {motion} from "framer-motion";
import {DatePicker} from "@features/datepicker";
import React from "react";
import Step2 from "./step2";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {SetAgreement, stepperSelector} from "@features/stepper";
import Autocomplete from "@mui/material/Autocomplete";
import IconUrl from "@themes/urlIcon";

function Step1({...props}) {
    const {t, collapse, insurances, agreements} = props;
    const agreementList = agreements.filter((ag: any) => ag.insurance?.isConvention)
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
                        onInputChange={(ev, newVal) => dispatch(SetAgreement({...agreement, name: newVal}))}
                        getOptionLabel={(option) => {
                            if (typeof option === 'string') {
                                const item = agreementList.find((al:{mutual:string}) => al.mutual === option)
                                SetAgreement({...agreement, insurance: item ? item.insurance: null})
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
                        onChange={(newValue: any) => dispatch(SetAgreement({...agreement, startDate: newValue}))}/>
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
