import {
    Avatar,
    Button,
    Checkbox, FormControlLabel,
    IconButton,
    InputAdornment,
    InputBase, Radio,
    RadioGroup,
    Stack, TextField,
    Typography, useMediaQuery, useTheme
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import {startCase} from 'lodash'
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {setTimer, timerSelector} from "@features/card";
import {capitalizeFirst, getMilliseconds, shortEnglishHumanizer, useMedicalEntitySuffix, useTimer} from "@lib/hooks";
import {Label} from "@features/label";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import SwitchConsultationDialogStyled from "./overrides/switchConsultationDialogStyled";
import {useRequestQuery} from "@lib/axios";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {agendaSelector} from "@features/calendar";
import {useRouter} from "next/router";
import CheckIcon from "@mui/icons-material/Check";
import IconUrl from "@themes/urlIcon";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {DefaultCountry} from "@lib/constants";

function SwitchConsultationDialog({...props}) {
    const {
        data: {
            setOpenPaymentDialog
        }
    } = props;
    const {timer} = useTimer();
    const theme = useTheme();
    const router = useRouter();
    const {data: session} = useSession();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const dispatch = useAppDispatch();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;
    const isBeta = localStorage.getItem('newCashbox') ? localStorage.getItem('newCashbox') === '1' : user.medical_entity.hasDemo;

    const {t} = useTranslation(["common", "consultation"]);
    const {event} = useAppSelector(timerSelector);
    const {config: agendaConfig} = useAppSelector(agendaSelector);

    const [instruction, setInstruction] = useState("");
    const [checkedNext, setCheckedNext] = useState(false);
    const [meeting, setMeeting] = useState<number>(15);
    const [selectedDose, setSelectedDose] = useState("day")

    const {data: httpTransactionsResponse} = useRequestQuery(agendaConfig && event ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agendaConfig?.uuid}/appointments/${event?.publicId}/transactions/${router.locale}`,
    } : null, ReactQueryNoValidateConfig);

    useEffect(() => {
        if (httpTransactionsResponse) {
            const transactionsData = (httpTransactionsResponse as HttpResponse)?.data;
            dispatch(setTimer({
                event: {
                    ...event,
                    extendedProps: {
                        ...event?.extendedProps,
                        ...(transactionsData.transactions && {
                            patient: transactionsData.transactions[0]?.appointment?.patient,
                            transactions: transactionsData.transactions
                        }),
                        total: transactionsData?.fees ? transactionsData.fees : 0,
                        restAmount: transactionsData?.rest_amount ? transactionsData.rest_amount : 0
                    }
                }
            }));
        }
    }, [httpTransactionsResponse]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <SwitchConsultationDialogStyled sx={{minHeight: 150}} alignItems={"center"}>
            <Typography sx={{textAlign: "center"}}
                        variant="subtitle1">{t(`dialogs.switch-consultation-dialog.sub-title`)} </Typography>
            <Typography sx={{textAlign: "center"}}
                        marginTop={2}>{t(`dialogs.switch-consultation-dialog.description`).split(',')[0]},</Typography>
            <Typography
                sx={{textAlign: "center"}}>{t(`dialogs.switch-consultation-dialog.description`).split(',')[1]}</Typography>

            <Stack direction={"row"} py={3} alignItems={"center"} justifyContent={"space-between"} sx={{width: '60%'}}>
                <Stack direction={"row"} alignItems={"center"} spacing={1.2}>
                    <Avatar sx={{width: 40, height: 40, bgcolor: 'primary.main'}}/>
                    <Stack>
                        <Stack direction={"row"} alignItems={"center"} spacing={.5}>
                            <Typography fontWeight={700}>
                                {capitalizeFirst(`${event?.extendedProps.patient.firstName} ${event?.extendedProps.patient.lastName}`)}
                            </Typography>
                        </Stack>
                        <Typography fontSize={14}
                                    fontWeight={600}>{shortEnglishHumanizer(getMilliseconds(parseInt(timer.split(" : ")[0]), parseInt(timer.split(" : ")[1]), parseInt(timer.split(" : ")[2])), {
                            largest: 1,
                            round: true
                        })}</Typography>
                    </Stack>

                    {(event?.extendedProps.type?.name || typeof event?.extendedProps.type === "string") &&
                        <Label color='warning' variant='filled' className='label'>
                            {event?.extendedProps.type?.name ??
                                (typeof event?.extendedProps.type === "string" ?
                                    (event?.extendedProps.type === "Consultation" ? "En Consultation" : event?.extendedProps.type) : "")}
                        </Label>}
                </Stack>
                {isBeta && <Button
                    startIcon={event?.extendedProps.restAmount === 0 ? <CheckIcon/> :
                        <IconUrl path={'ic-argent'} color={"white"}/>}
                    variant="contained"
                    color={event?.extendedProps.restAmount === 0 ? "success" : "primary"}
                    style={{marginLeft: 5}}
                    onClick={() => setOpenPaymentDialog(true)}>
                    <Typography>{t("pay")}</Typography>
                </Button>
                }
            </Stack>

            <Stack className="instruction-box" spacing={1}>
                <Typography variant="body2" color="text.secondary">{startCase(t('note'))}</Typography>
                <TextField
                    fullWidth
                    multiline
                    value={instruction}
                    onChange={event => {
                        setInstruction(event.target.value.slice(0, 255));
                    }}
                    placeholder={t("type_instruction_for_the_secretary", {ns: "consultation"})}
                    rows={4}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment defaultValue={instruction} position="end">
                                {instruction.length} / {255}
                            </InputAdornment>
                        ),
                    }}
                />

                <Button
                    className="counter-btn"
                    disableRipple
                    variant="outlined"
                    onClick={(e) => {
                        e.stopPropagation();
                        setCheckedNext(!checkedNext);
                    }}>
                    <Stack direction="row" alignItems='center'
                           {
                               ...(checkedNext && isSmall && {
                                   mb: 1
                               })
                           }>
                        <Checkbox checked={checkedNext}/>
                        <Typography>{t("plan_a_meeting", {ns: "consultation"})}</Typography>
                    </Stack>
                    {checkedNext && (
                        <>
                            <InputBase
                                disabled={true}
                                value={meeting}
                                placeholder={'-'}
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                onChange={(e: any) => {
                                    if (e.target.value.length === 0)
                                        setMeeting(e.target.value)
                                    else setMeeting(Number(e.target.value))
                                }}
                                startAdornment={
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMeeting(meeting - 1);
                                        }}>
                                        <RemoveIcon/>
                                    </IconButton>
                                }
                                endAdornment={
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMeeting(meeting + 1);
                                        }}>
                                        <AddIcon/>
                                    </IconButton>
                                }
                            />
                            <RadioGroup sx={{ml: 1}} row onClick={(e) => e.stopPropagation()}>
                                {[t('times.day'), t('times.month'), t('times.year')].map((item: string) => (
                                    <FormControlLabel
                                        key={item}
                                        onChange={() => {
                                            setCheckedNext(true);
                                            setTimeout(() => setSelectedDose(item));
                                        }}
                                        value={item}
                                        control={<Radio checked={selectedDose === item}/>}
                                        label={startCase(t(item))}
                                    />
                                ))}
                            </RadioGroup>
                        </>
                    )}
                </Button>
            </Stack>
        </SwitchConsultationDialogStyled>
    )
}

export default SwitchConsultationDialog;
