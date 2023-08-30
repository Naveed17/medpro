import React, {useState} from "react";
import {
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    DialogActions,
    Grid,
    IconButton,
    InputAdornment,
    InputBase,
    Stack,
    TextField,
    Theme,
    Typography,
    useMediaQuery,
} from "@mui/material";
import RootStyled from "./overrides/rootSyled";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckIcon from '@mui/icons-material/Check';
import IconUrl from "@themes/urlIcon";
import Icon from "@themes/urlIcon";
import {Label} from "@features/label";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import moment from "moment-timezone";
import {useAppSelector} from "@lib/redux/hooks";
import {cashBoxSelector} from "@features/leftActionBar/components/cashbox";
import CloseIcon from "@mui/icons-material/Close";
import {Dialog} from "@features/dialog";
import {configSelector, dashLayoutSelector} from "@features/base";
import {useRouter} from "next/router";
import {useRequestMutation} from "@lib/axios";
import {consultationSelector} from "@features/toolbar";
import {LoadingButton} from "@mui/lab";
import {getBirthdayFormat, useMedicalEntitySuffix} from "@lib/hooks";
import {OnTransactionEdit} from "@lib/hooks/onTransactionEdit";
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded';

const limit = 255;

function SecretaryConsultationDialog({...props}) {
    const {
        data: {
            app_uuid,
            t,
            changes,
            total,
            meeting,
            setMeeting,
            checkedNext,
            setCheckedNext,
            appointment,
            exam,
            reasons
        },
    } = props;

    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

    const {data: session} = useSession();

    const localInstr = localStorage.getItem(`instruction-data-${app_uuid}`);
    const [instruction, setInstruction] = useState(localInstr ? localInstr : "");
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [openAI, setOpenAI] = useState(false);
    const [response, setResponse] = useState("");
    const [loadingChat, setLoadingChat] = useState(false);

    const router = useRouter();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;
    const demo = localStorage.getItem('newCashbox') ? localStorage.getItem('newCashbox') === '1' : user.medical_entity.hasDemo;

    const {direction} = useAppSelector(configSelector);
    const {selectedBoxes} = useAppSelector(cashBoxSelector);
    const {mutate} = useAppSelector(consultationSelector);
    const {medicalProfessionalData} = useAppSelector(dashLayoutSelector);
    const {patientAntecedent} = useAppSelector(consultationSelector);

    const {trigger: triggerPostTransaction} = useRequestMutation(null, "/payment/cashbox");
    const {trigger: triggerChat} = useRequestMutation(null, "/chat/ai");

    const {
        paymentTypesList
    } = useAppSelector(cashBoxSelector);

    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();


    const resetDialog = () => {
        setOpenPaymentDialog(false);
    };
    const openDialogPayment = () => {
        let payments: any[] = [];
        if (appointment.transactions) {
            appointment.transactions.transaction_data.map((td: any) => {
                let pay: any = {
                    uuid: td.uuid,
                    amount: td.amount,
                    payment_date: moment().format('DD-MM-YYYY HH:mm'),
                    status_transaction: td.status_transaction_data,
                    type_transaction: td.type_transaction_data,
                    data: td.data
                }
                if (td.insurance)
                    pay["insurance"] = td.insurance.uuid
                if (td.payment_means)
                    pay["payment_means"] = paymentTypesList.find((pt: {
                        slug: string;
                    }) => pt.slug === td.payment_means.slug)
                payments.push(pay)
            })
        }
        setSelectedPayment({
            uuid: app_uuid,
            payments,
            payed_amount: getTransactionAmountPayed(),
            appointment: {...appointment, uuid: app_uuid},
            patient: appointment.patient,
            total,
            isNew: getTransactionAmountPayed() === 0
        })
        setOpenPaymentDialog(true);
    }
    const getTransactionAmountPayed = (): number => {
        let payed_amount = 0;
        if (appointment.transactions)
            appointment.transactions.transaction_data.map((td: { amount: number; }) => payed_amount += td.amount);
        return payed_amount;
    }

    const msgGenerator = () => {
        let msg = '';
        if (medicalProfessionalData) {
            msg = `Je m'appelle dr ${session?.user?.name} ${medicalProfessionalData[0]?.medical_professional.specialities[0].speciality.name}, mon patient ${appointment.patient.firstName} ${appointment.patient.lastName}`;
            if (appointment.patient.birthdate)
                msg += ` ${getBirthdayFormat(appointment.patient, t).trim()} `;
            if (appointment.patient.gender)
                msg += ` de sexe ${appointment.patient.gender === 'F' ? 'feminin' : 'masculin'}`;

            msg += ` a consulté le ${appointment.day_date}`
            if (exam.motif.length > 0) {
                msg += ` pour motif ${reasons.find((reason: { uuid: any; }) => reason.uuid === exam.motif[0]).name}` //UUID
            }
            if (localStorage.getItem("Modeldata" + app_uuid) !== null) {
                let txtModel = ''
                const models = JSON.parse(localStorage.getItem("Modeldata" + app_uuid) as string);
                Object.keys(models).map(key => {
                    if (models[key])
                        txtModel += ` ${key}=${models[key]}`;
                })
                if (txtModel.length > 0) msg += ` avec${txtModel}`
            }

            if (exam.notes)
                msg += `. mes observations: ${exam.notes}`
            if (exam.diagnosis)
                msg += `. mon diagnostique été: ${exam.diagnosis}`
            if (exam.disease && exam.disease.length > 0) {
                msg += ' maladie:'
                exam.disease.map(((disease: string) => msg += ` ${disease},`))
            }
            if (Object.keys(patientAntecedent).length > 0) {
                msg += ' .Voici les antecedents '
                Object.keys(patientAntecedent).map(antecedent => {
                    msg += `-${antecedent}: (`
                    patientAntecedent[antecedent].map((pa: { name: any; }) => {
                        msg += ` ${pa.name},`
                    })
                    msg = msg.replace(/.$/, ")")
                })
            }
            if (appointment.patient.treatment.length > 0) {
                msg += ' et j\'ai recommandé les traitements suivants:'
                appointment.patient.treatment.map((treatment: { name: any; }) => msg += ` -${treatment.name}`)
            }
            if (appointment.patient.requestedAnalyses.length > 0) {
                msg += '. J\'ai demandé les analyses suivante:'
                appointment.patient.requestedAnalyses.forEach((analyse: { hasAnalysis: any[]; }) => {
                    analyse.hasAnalysis.map(ha => {
                        msg += ` -${ha.analysis.name}`
                    })
                })
            }
            if (appointment.patient.requestedImaging.length > 0) {
                msg += '. J\'ai demandé des imageries médicals:'
                appointment.patient.requestedImaging?.forEach((ri: { [x: string]: any[]; }) => {
                    ri['medical-imaging']?.map(mi => {
                        msg += ` - ${mi['medical-imaging'].name}`
                    })
                })
            }

            msg += '. qu\'est ce que vous pensez? (sans mentionner dans la réponse que cela est générer par AI) '
        }

        return msg;
    }

    const handleOnGoingPaymentDialog = () => {
        setLoading(true);
        OnTransactionEdit(selectedPayment,
            selectedBoxes,
            router.locale,
            session,
            medical_entity.uuid,
            appointment.transactions,
            triggerPostTransaction,
            urlMedicalEntitySuffix,
            () => {
                mutate().then(() => {
                    setOpenPaymentDialog(false);
                    setLoading(false)
                })
            });

    }


    return (
        <RootStyled>
            <Grid container>
                <Grid item md={6} sm={12} xs={12}>
                    <Stack
                        alignItems="center"
                        spacing={2}
                        maxWidth={{xs: "100%", md: "80%"}}
                        mx="auto"
                        width={1}>
                        <Typography variant="subtitle1">
                            {t("finish_the_consutation")}
                        </Typography>
                        <Typography>{t("type_the_instruction_for_the_secretary")}</Typography>
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
                        {
                            total - getTransactionAmountPayed() !== 0 ?
                                <Stack direction={"row"} alignItems={"center"}>
                                    <Typography mr={1}>{t("amount_paid")}</Typography>
                                    <Label
                                        variant="filled"
                                        color={getTransactionAmountPayed() === 0 ? "success" : "warning"}
                                        sx={{color: (theme) => theme.palette.text.primary}}>
                                        <Typography
                                            color="text.primary"
                                            variant="subtitle1"
                                            mr={0.3}
                                            fontWeight={600}>
                                            {getTransactionAmountPayed() > 0 && `${getTransactionAmountPayed()} / `} {total}
                                        </Typography>
                                        {devise}
                                    </Label>
                                    {demo && <Button
                                        variant="contained"
                                        size={"small"}
                                        style={{
                                            marginLeft: 5
                                        }}
                                        {...(isMobile && {

                                            sx: {minWidth: 40},
                                        })}
                                        onClick={openDialogPayment}
                                    >
                                        <IconUrl color={"white"} path="ic-fees"/> {!isMobile &&
                                        <Typography fontSize={12} ml={1}>{t("pay")}</Typography>}
                                    </Button>}
                                </Stack> :
                                <Chip
                                    label={`${total} ${devise}`}
                                    color={"success"}
                                    onDelete={() => {
                                    }}
                                    deleteIcon={<DoneAllRoundedIcon/>}
                                />
                        }
                        <Button
                            className="counter-btn"
                            disableRipple
                            color="info"
                            variant="outlined"
                            onClick={() => setCheckedNext(!checkedNext)}>
                            <Checkbox checked={checkedNext}/>
                            {t("plan_a_meeting")}
                            {checkedNext && (
                                <>
                                    <InputBase
                                        type={"number"}
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

                                    {t("day")}
                                </>
                            )}
                        </Button>
                    </Stack>
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                    <Stack
                        alignItems="center"
                        spacing={2}
                        maxWidth={{xs: "100%", md: "80%"}}
                        mx="auto"
                        width={1}>
                        <Typography mt={{xs: 3, md: 0}} variant="subtitle1">
                            {t("recap")}
                        </Typography>


                        <Stack direction={"row"} spacing={1} alignItems={"center"}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img style={{width: 35}} src={"/static/img/medical-robot.png"} alt={"ai doctor logo"}/>
                            <Chip label={t('imMedAI')}/>
                            <Chip size={"small"} color={"primary"} label={t(loadingChat ? 'wait' : 'yes')}
                                  disabled={loadingChat} onClick={() => {
                                setLoadingChat(true)
                                const form = new FormData();
                                form.append('message', msgGenerator());
                                triggerChat({
                                    method: "POST",
                                    url: `${urlMedicalEntitySuffix}/appointments/${app_uuid}/chat`,
                                    data: form
                                }).then((r) => {
                                    const res = (r?.data as HttpResponse).data;
                                    setResponse(res.message)
                                    setOpenAI(true)
                                    setLoadingChat(false)
                                })
                            }}/>
                        </Stack>

                        <Box display='grid' sx={{
                            gridGap: 16,
                            gridTemplateColumns: {
                                xs: "repeat(2,minmax(0,1fr))",
                                md: "repeat(3,minmax(0,1fr))",
                                lg: "repeat(3,minmax(0,1fr))",
                            }
                        }}>
                            {changes.map((item: { checked: boolean; icon: string; name: string; }, idx: number) => (
                                <Badge key={'feat' + idx} color="success" invisible={!item.checked}
                                       badgeContent={<CheckIcon sx={{width: 8}}/>}>
                                    <Card style={{width: '100%'}}>
                                        <CardContent>
                                            <Stack spacing={2} className="document-detail" alignItems="center">
                                                <IconUrl path={item.icon}/>
                                                <Typography variant='subtitle2' textAlign={"center"}
                                                            whiteSpace={"nowrap"} fontSize={11}>
                                                    {t("consultationIP." + item.name)}
                                                </Typography>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Badge>
                            ))}
                        </Box>

                    </Stack>
                </Grid>

            </Grid>

            <Dialog
                action={"payment_dialog"}
                {...{
                    direction,
                    sx: {
                        minHeight: 380
                    }
                }}
                open={openPaymentDialog}
                data={{
                    selectedPayment,
                    setSelectedPayment,
                    appointment,
                    patient: appointment.patient
                }}
                size={"lg"}
                fullWidth
                title={t("payment_dialog_title", {ns: "payment"})}
                dialogClose={resetDialog}
                actionDialog={
                    <DialogActions>
                        <Button onClick={resetDialog} startIcon={<CloseIcon/>}>
                            {t("cancel", {ns: "common"})}
                        </Button>
                        <LoadingButton
                            disabled={selectedPayment && selectedPayment.payments.length === 0}
                            variant="contained"
                            loading={loading}
                            onClick={handleOnGoingPaymentDialog}
                            startIcon={<Icon path="ic-dowlaodfile"/>}>
                            {t("save", {ns: "common"})}
                        </LoadingButton>
                    </DialogActions>
                }
            />

            <Dialog
                action={"open_ai"}
                {...{
                    direction,
                    sx: {
                        minHeight: 380
                    }
                }}
                open={openAI}
                data={{
                    appointment, response
                }}
                title={t("MedAI")}
                dialogClose={resetDialog}
                actionDialog={
                    <DialogActions>
                        {/* <Button onClick={() => {
                            setOpenAI(false)
                        }} startIcon={<SentimentDissatisfiedRoundedIcon/>}>
                            {t("notsatisfied", {ns: "common"})}
                        </Button>*/}
                        <Button onClick={() => {
                            setOpenAI(false)
                        }} startIcon={<SentimentSatisfiedRoundedIcon/>}>
                            {t("Merci", {ns: "common"})}
                        </Button>
                    </DialogActions>
                }
            />

        </RootStyled>
    );
}

export default SecretaryConsultationDialog;
