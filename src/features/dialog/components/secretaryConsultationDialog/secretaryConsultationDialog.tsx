import React, {useEffect, useState} from "react";
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    InputBase,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Theme,
    Typography,
    useMediaQuery,
} from "@mui/material";
import RootStyled from "./overrides/rootSyled";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconUrl from "@themes/urlIcon";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import {useAppSelector} from "@lib/redux/hooks";
import {configSelector} from "@features/base";
import {useRouter} from "next/router";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {startCase} from 'lodash'
import {EventType, TimeSchedule} from "@features/tabPanel";
import {useTheme} from "@emotion/react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {Dialog} from "@features/dialog";
import CheckIcon from "@mui/icons-material/Check";

const limit = 255;

function SecretaryConsultationDialog({...props}) {
    const {
        data: {
            app_uuid,
            agenda,
            patient,
            t,
            setTransactions,
            total, setTotal,
            addInfo,
            changes,
            meeting,
            setMeeting,
            checkedNext,
            setCheckedNext,
            addFinishAppointment,
            showCheckedDoc,
            showPreview,
            mutatePatient
        }
    } = props;
    const router = useRouter();
    const theme = useTheme() as Theme;
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const {data: session} = useSession();
    const {trigger: triggerAppointmentEdit} = useRequestQueryMutation("appointment/edit");

    const localInstr = localStorage.getItem(`instruction-data-${app_uuid}`);
    const [instruction, setInstruction] = useState(localInstr ? localInstr : "");
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);
    const [selectedDose, setSelectedDose] = useState("day")

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;
    const demo = localStorage.getItem('newCashbox') ? localStorage.getItem('newCashbox') === '1' : user.medical_entity.hasDemo;

    const {direction} = useAppSelector(configSelector);
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {data: httpAppointmentTransactions} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda}/appointments/${app_uuid}/transactions/${router.locale}`
    });

    useEffect(() => {
        if (httpAppointmentTransactions) {
            const res = (httpAppointmentTransactions as HttpResponse)?.data
            setTransactions(res.transactions ? res.transactions[0] : null);
            if (total === -1) {
                const form = new FormData();
                form.append("consultation_fees", res.fees ? res.fees : 0);
                form.append("acts", JSON.stringify([]));
                form.append("fees", res.fees ? res.fees : 0);

                triggerAppointmentEdit({
                    method: "PUT",
                    url: `${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${app_uuid}/data/${router.locale}`,
                    data: form
                }, {
                    onSuccess: () => {
                        setTotal(res.fees ? res.fees : 0)
                    }
                })
            }
        }
    }, [httpAppointmentTransactions, setTotal, setTransactions]) // eslint-disable-line react-hooks/exhaustive-deps

    const resetDialog = () => {
        setOpenPaymentDialog(false);
    }

    const openDialogPayment = () => {
        setOpenPaymentDialog(true);
    }

    return (
        <>
            {addFinishAppointment ? <Stack spacing={1}>
                <Stack direction={"row"} alignItems={"center"} spacing={1.2}>
                    <Avatar
                        {...(patient?.hasPhoto && {
                            alt: patient?.name,
                            src: patient?.photo
                        })}
                        sx={{width: 40, height: 40, bgcolor: 'primary.main'}}/>
                    <Stack>
                        <Stack direction={"row"} alignItems={"center"} spacing={.5}>
                            <Typography fontWeight={700}>
                                {patient?.firstName} {patient?.lastName}
                            </Typography>
                        </Stack>
                        {patient?.contact?.length > 0 &&
                            <Stack direction='row' alignItems='center' spacing={.5}>
                                <IconUrl path="ic-tel" color={theme.palette.text.primary} width={12} height={12}/>
                                <Typography variant="body2">{patient?.contact[0]}</Typography>
                            </Stack>
                        }
                    </Stack>
                </Stack>
                <EventType select defaultType={1}/>
                <TimeSchedule select/>
            </Stack> : (
                <RootStyled>
                    <Grid container spacing={3}>
                        <Grid item md={4} sm={12} xs={12}>
                            <Stack
                                alignItems="center"
                                spacing={1}
                                mx="auto"
                                width={1}>
                                <Typography mt={{xs: 3, md: 0}}>
                                    {t("recap")}
                                </Typography>
                                <Typography
                                    style={{opacity: .7, fontSize: 11, marginBottom: 10}}>{t("docs")}</Typography>
                                <Box display='grid'
                                     sx={{
                                         width: '100%',
                                         gridGap: 12,
                                         gridTemplateColumns: "repeat(1,minmax(0,1fr))"
                                     }}>
                                    {changes.map((item: {
                                        index: number;
                                        checked: boolean;
                                        icon: string;
                                        name: string;
                                    }, idx: number) => (
                                        <Badge key={'feat' + idx} color="success" invisible={!item.checked}>
                                            <Card className="document-card" sx={{
                                                borderColor: item.checked ? (theme: Theme) => theme.palette.success.main : (theme: Theme) => theme.palette.divider
                                            }}>
                                                <CardContent>
                                                    <Stack direction='row'
                                                           onClick={() => {
                                                               if (item.index !== undefined) {
                                                                   if (!item.checked) {
                                                                       showPreview(item.name)
                                                                   } else showCheckedDoc(item.name)
                                                               } else
                                                                   addInfo(item.name === "fiche" ? "widget" : "exam")
                                                           }}
                                                           className="document-detail"
                                                           alignItems="center">
                                                        <IconUrl path={item.icon} width={16} height={16}/>
                                                        <Typography
                                                            variant='body2'
                                                            component='strong'
                                                            textAlign={"center"}
                                                            ml={1}
                                                            whiteSpace={"nowrap"}
                                                            fontSize={11}>
                                                            {t("consultationIP." + item.name)}
                                                        </Typography>
                                                        {item.checked ? item.index !== undefined ? (
                                                                <IconButton size="small" disableRipple
                                                                            sx={{ml: 'auto'}}>
                                                                    <IconUrl path={"ic-printer"}
                                                                             color={theme.palette.primary.main}
                                                                             width={16} height={16}/>
                                                                </IconButton>) : (<CheckCircleIcon
                                                                color={"success"}
                                                                sx={{
                                                                    ml: 'auto',
                                                                    width: 20
                                                                }}/>) :
                                                            (<IconButton size="small" disableRipple
                                                                         sx={{ml: 'auto'}}>
                                                                <IconUrl path={"ic-plus"}
                                                                         color={theme.palette.primary.main}
                                                                         width={16} height={16}/>
                                                            </IconButton>)
                                                        }
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </Badge>
                                    ))}
                                </Box>
                            </Stack>
                        </Grid>
                        <Grid item md={8} sm={12} xs={12}>
                            <Stack
                                alignItems="center"
                                spacing={1}
                                mx="auto"
                                width={1}>
                                <Typography variant="subtitle1">
                                    {t("finish_the_consutation")}
                                </Typography>
                                <Typography style={{
                                    opacity: .7,
                                    fontSize: 13,
                                    marginBottom: 10
                                }}>{t("type_the_instruction_for_the_secretary")}</Typography>
                                <Stack pt={2} pb={2} direction={{xs: 'column', sm: 'row'}} alignItems='center'
                                       justifyContent='space-between' spacing={{xs: 2, sm: 0}} width={1}>

                                    <Stack direction={"row"} alignItems={"center"} spacing={1.2}>
                                        <Avatar
                                            {...(patient?.hasPhoto && {
                                                alt: patient?.name,
                                                src: patient?.photo
                                            })}
                                            sx={{width: 40, height: 40, bgcolor: 'primary.main'}}/>
                                        <Stack>
                                            <Stack direction={"row"} alignItems={"center"} spacing={.5}>
                                                <Typography fontWeight={700}>
                                                    {patient?.firstName} {patient?.lastName}
                                                </Typography>
                                            </Stack>
                                            {patient?.contact?.length > 0 &&
                                                <Stack direction='row' alignItems='center' spacing={.5}>
                                                    <IconUrl path="ic-tel" color={theme.palette.text.primary} width={12}
                                                             height={12}/>
                                                    <Typography variant="body2">{patient?.contact[0]}</Typography>
                                                </Stack>
                                            }
                                        </Stack>
                                    </Stack>
                                    {
                                        <Stack direction={"row"} alignItems={"center"}>
                                            {demo && <Button
                                                startIcon={patient.rest_amount === 0 ?<CheckIcon/>: <IconUrl path={'ic-argent'} color={"white"}/>}
                                                variant="contained"
                                                color={patient.rest_amount === 0 ? "success":"primary"}
                                                style={{marginLeft: 5}}
                                                {...(isMobile && {
                                                    sx: {minWidth: 40},
                                                })}
                                                onClick={openDialogPayment}>
                                                <Typography>{t("pay")}</Typography>
                                                {
                                                    patient.rest_amount > 0 &&
                                                    <>
                                                        <Typography component='span'
                                                                    fontWeight={700}
                                                                    variant="subtitle2" ml={1}>
                                                            {patient.rest_amount}
                                                        </Typography>
                                                        <Typography fontSize={10}>{devise}</Typography>
                                                    </>
                                                }
                                            </Button>
                                            }
                                        </Stack>
                                    }
                                </Stack>
                                <Stack className="instruction-box" spacing={1}>
                                    <Typography variant="body2" color="text.secondary">{t('note')}</Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        value={instruction}
                                        onChange={event => {
                                            setInstruction(event.target.value.slice(0, limit));
                                            localStorage.setItem(`instruction-data-${app_uuid}`, event.target.value.slice(0, limit));
                                        }}
                                        placeholder={t("type_instruction_for_the_secretary")}
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
                                            <Typography>{t("plan_a_meeting")}</Typography>
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
                                                    onChange={(e) => {
                                                        if (e.target.value.length === 0)
                                                            setMeeting(e.target.value)
                                                        else setMeeting(Number(e.target.value))
                                                    }}
                                                    startAdornment={
                                                        <IconButton
                                                            size="small"
                                                            disabled={meeting <= 1 || meeting.length == 0}
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
                                                            disabled={meeting.length == 0}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMeeting(meeting + 1);
                                                            }}>
                                                            <AddIcon/>
                                                        </IconButton>
                                                    }
                                                />
                                                <RadioGroup sx={{ml: 1}} row onClick={(e) => e.stopPropagation()}>
                                                    {['day', 'month', 'year'].map((item: string) => (
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
                            </Stack>
                        </Grid>
                    </Grid>

                    <Dialog
                        action={"payment_dialog"}
                        {...{
                            direction,
                            sx: {
                                minHeight: 460
                            }
                        }}
                        open={openPaymentDialog}
                        data={{
                            patient,
                            setOpenPaymentDialog,
                            mutatePatient
                        }}
                        size={"lg"}
                        fullWidth
                        title={t("payment_dialog_title", {ns: "payment"})}
                        dialogClose={resetDialog}
                    />
                </RootStyled>
            )}
        </>
    )
        ;
}

export default SecretaryConsultationDialog;
