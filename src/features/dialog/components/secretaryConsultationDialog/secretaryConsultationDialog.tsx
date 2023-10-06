import React, {useEffect, useState} from "react";
import {
    Avatar,
    Badge,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    DialogActions,
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
import {configSelector} from "@features/base";
import {useRouter} from "next/router";
import {useRequestQuery} from "@lib/axios";
import {LoadingButton} from "@mui/lab";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {startCase} from 'lodash'
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import {useTransactionEdit} from "@lib/hooks/rest";
import {TimeSchedule} from "@features/tabPanel";
import { useTheme } from "@emotion/react";

const limit = 255;

function SecretaryConsultationDialog({...props}) {
    const {
        data: {
            app_uuid,
            agenda,
            patient,
            t,
            transactions, setTransactions,
            total, setTotal,
            setRestAmount,
            changes,
            meeting,
            setMeeting,
            checkedNext,
            setCheckedNext,
            addFinishAppointment,
            setIsFinishAppointDisabled
        },
    } = props;
    const router = useRouter();
    const theme  = useTheme() as Theme;
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const {data: session} = useSession();
    const {trigger: triggerTransactionEdit} = useTransactionEdit();

    const localInstr = localStorage.getItem(`instruction-data-${app_uuid}`);
    const [instruction, setInstruction] = useState(localInstr ? localInstr : "");
    const [selectedPayment, setSelectedPayment] = useState<any>(null);
    const [openPaymentDialog, setOpenPaymentDialog] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [selectedDose,setSelectedDose] = useState("day")

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;
    const demo = localStorage.getItem('newCashbox') ? localStorage.getItem('newCashbox') === '1' : user.medical_entity.hasDemo;

    const {direction} = useAppSelector(configSelector);
    const {paymentTypesList} = useAppSelector(cashBoxSelector);
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {data: httpAppointmentTransactions, mutate} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/agendas/${agenda}/appointments/${app_uuid}/transactions/${router.locale}`
    });

    useEffect(() => {
        if (httpAppointmentTransactions) {
            const res = (httpAppointmentTransactions as HttpResponse)?.data
            setTransactions(res.transactions ? res.transactions[0] : null);
            if (total === -1)
                setTotal(res.fees ? res.fees : 0)
            setRestAmount(res.rest_amount)
        }
    }, [httpAppointmentTransactions, setTotal, setTransactions]) // eslint-disable-line react-hooks/exhaustive-deps

    const resetDialog = () => {
        setOpenPaymentDialog(false);
    };
    const openDialogPayment = () => {
        let payments: any[] = [];
        if (transactions) {
            transactions.transaction_data.forEach((td: any) => {
                let pay: any = {
                    uuid: td.uuid,
                    amount: td.amount,
                    payment_date: moment().format('DD-MM-YYYY'),
                    payment_time: `${new Date().getHours()}:${new Date().getMinutes()}`,
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
            appointment: {uuid: app_uuid},
            patient,
            total,
            isNew: getTransactionAmountPayed() === 0
        })
        setOpenPaymentDialog(true);
    }
    const getTransactionAmountPayed = (): number => {
        let payed_amount = 0;
        if (transactions)
            transactions.transaction_data?.forEach((td: { amount: number; }) => payed_amount += td.amount);

        return payed_amount;
    }

    const handleOnGoingPaymentDialog = () => {
        setLoading(true);
        triggerTransactionEdit(selectedPayment,
            transactions,
            () => {
                mutate().then(() => {
                    setOpenPaymentDialog(false);
                    setLoading(false)
                })
            });
    }
    console.log(patient)
    return (
        <>
        {addFinishAppointment ?  <TimeSchedule select/>:(
        <RootStyled>
            <Grid container spacing={3}>
                <Grid item md={6} sm={12} xs={12}>
                    <Stack
                        alignItems="center"
                        spacing={2}
                        mx="auto"
                        width={1}>
                        <Typography mt={{xs: 3, md: 0}} variant="subtitle1">
                            {t("recap")}
                        </Typography>
                        <Typography>{t("doc_list")}</Typography>
                        <Box display='grid' sx={{
                            width: '100%',
                            gridGap: 16,
                            gridTemplateColumns: 
                                "repeat(1,minmax(0,1fr))",
                               
                        }}>
                            {changes.map((item: { checked: boolean; icon: string; name: string; }, idx: number) => (
                                <Badge key={'feat' + idx} color="success" invisible={!item.checked}>
                                    <Card className="document-card" sx={{
                                        borderColor:item.checked ? (theme:Theme) => theme.palette.success.main :(theme:Theme) => theme.palette.divider
                                    }}>
                                        <CardContent>
                                            <Stack direction='row' className="document-detail" alignItems="center">
                                                <IconUrl path={item.icon} width={16} height={16}/>
                                                <Typography variant='subtitle2' textAlign={"center"}
                                                ml={1}
                                                            whiteSpace={"nowrap"} fontSize={11}>
                                                    {t("consultationIP." + item.name)}
                                                </Typography>
                                                {
                                                    item.checked ? (
                                                    <IconButton size="small" disableRipple sx={{ml:'auto'}}>
                                                  <IconUrl path={"ic-printer"} color={theme.palette.primary.main} width={16} height={16}/>
                                                </IconButton>
                                                    )
                                                :
                                                (
                                                <IconButton size="small" disableRipple sx={{ml:'auto'}}>
                                                  <IconUrl path={"ic-plus"} color={theme.palette.primary.main} width={16} height={16}/>
                                                </IconButton>
                                                )
                                                }
                                                
                                               
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Badge>
                            ))}
                        </Box>

                    </Stack>
                </Grid>
               <Grid item md={6} sm={12} xs={12}>
                    <Stack
                        alignItems="center"
                        spacing={2}
                        mx="auto"
                        width={1}>
                        <Typography variant="subtitle1">
                            {t("finish_the_consutation")}
                        </Typography>
                        <Typography>{t("type_the_instruction_for_the_secretary")}</Typography>
                        <Stack pt={3} direction='row' alignItems='center' justifyContent='space-between' width={1}>
                           
                        <Stack direction={"row"} alignItems={"center"} spacing={1.2}>
                            <Avatar 
                            {...(patient?.hasPhoto && {
                                alt:patient?.name,
                                src:patient?.photo
                            })}
                             sx={{width: 30, height: 30,bgcolor:'primary.main'}} />
                             <Stack>
                                <Stack direction={"row"} alignItems={"center"} spacing={.5}>
                                    <IconUrl path={patient?.gender ==="M" ? 'ic-h':'ic-f'}/>
                                    <Typography fontWeight={700}>
                                                    {patient?.firstName} {patient?.lastName}
                                                    </Typography>

                                
                             </Stack>
                             {patient?.contact?.length > 0 && 
                             <Stack direction='row' alignItems='center' spacing={.5}>
                                  <IconUrl path="ic-tel" color={theme.palette.text.primary} width={12} height={12}/>
                                 <Typography variant="body2">{patient?.contact[0]}
                                    

                                 </Typography>
                             
                             </Stack>
}
                             </Stack>

                        </Stack>
                         {
                            total - getTransactionAmountPayed() !== 0 ?
                                <Stack direction={"row"} alignItems={"center"}>
                                    {demo && <Button
                                        endIcon={
                                            <Typography sx={{fontSize:'16px !important'}}>
                                                {devise}
                                            </Typography>
                                        }
                                        variant="contained"
                                        color="error"
                                        size={"small"}
                                        style={{
                                            marginLeft: 5
                                        }}
                                        {...(isMobile && {

                                            sx: {minWidth: 40},
                                        })}
                                        onClick={openDialogPayment}
                                    >
                                         
                                         <Typography ml={1}>{t("amount_paid")}</Typography>
                                         <Typography component='span' fontWeight={700} variant="subtitle2" ml={1}>
                                            {getTransactionAmountPayed() > 0 && `${getTransactionAmountPayed()} / `} {total}
                                            {" "} 
                                         </Typography>
                                    </Button>
                                    }
                                </Stack> :
                                <Chip
                                    label={`${total} ${devise}`}
                                    color={"success"}
                                    onDelete={() => {
                                    }}
                                    deleteIcon={<DoneAllRoundedIcon/>}
                                />
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
                            color="info"
                            variant="outlined"
                            onClick={() => {setCheckedNext(!checkedNext);
                            setIsFinishAppointDisabled(!checkedNext)
                            }}>
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
<RadioGroup
        row

      >
       
       
                                    {
                                    [
                                    'day','month','year'
                                    ].map((item:string)=>(
                                         <FormControlLabel
                                         key={item}
                                         onChange={(e) => {e.stopPropagation()
                                         setSelectedDose(item)
                                        }
                                    }
          value={item}
          control={<Radio  checked={selectedDose === item}/>}
          label={startCase(t(item))}
          
        />
  
                                    ))
                                    }
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
                        minHeight: 380
                    }
                }}
                open={openPaymentDialog}
                data={{
                    selectedPayment,
                    setSelectedPayment,
                    appointment: {uuid: app_uuid},
                    patient
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
        </RootStyled>
        )}
        </>
    );
}

export default SecretaryConsultationDialog;
