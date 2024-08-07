import {
    Avatar,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    InputAdornment,
    InputBase,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useTranslation} from "next-i18next";
import {startCase} from 'lodash'
import {useAppSelector} from "@lib/redux/hooks";
import {timerSelector} from "@features/card";
import {capitalizeFirst, getMilliseconds, shortEnglishHumanizer, useTimer} from "@lib/hooks";
import {Label} from "@features/label";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import SwitchConsultationDialogStyled from "./overrides/switchConsultationDialogStyled";
import CheckIcon from "@mui/icons-material/Check";
import IconUrl from "@themes/urlIcon";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {DefaultCountry, MobileContainer} from "@lib/constants";
import {agendaSelector} from "@features/calendar";
import {navBarSelector} from "@features/topNavBar";
import MenuItem from "@mui/material/MenuItem";
import useUsers from "@lib/hooks/rest/useUsers";
import {dashLayoutSelector} from "@features/base";
import {useRequestQueryMutation} from "@lib/axios";

function SwitchConsultationDialog({...props}) {
    const {
        data: {
            instruction, setInstruction,
            general_information,medicalEntityHasUser,
            selectedUser, setSelectedUser,
            setSelectedDiscussion,
            setOpenPaymentDialog
        }
    } = props;
    const {timer} = useTimer();
    const theme = useTheme();
    const {data: session} = useSession();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const isMobile = useMediaQuery(`(max-width:${MobileContainer}px)`);

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;
    const isBeta = localStorage.getItem('newCashbox') ? localStorage.getItem('newCashbox') === '1' : user.medical_entity.hasDemo;

    const {t} = useTranslation(["common", "consultation"]);
    const {event} = useAppSelector(timerSelector);
    const {selectedEvent} = useAppSelector(agendaSelector);
    const {action: dialogAction} = useAppSelector(navBarSelector);

    const {users} = useUsers();

    const [checkedNext, setCheckedNext] = useState(false);
    const [meeting, setMeeting] = useState<number>(5);
    const [selectedDose, setSelectedDose] = useState("day")

    const {trigger: createDiscussion} = useRequestQueryMutation("/chat/new");

    const addDiscussion = (user: UserModel | undefined) => {
        if (user)
            createDiscussion({
                method: "POST",
                data: {
                    "members": [{
                        uuid: medicalEntityHasUser,
                        name: `${general_information.firstName} ${general_information.lastName}`
                    }, {
                        uuid: user.uuid,
                        name: `${user?.firstName} ${user?.lastName}`
                    }]
                },
                url: `/-/chat/api/discussion`
            }, {
                onSuccess: (res: any) => {
                    setSelectedDiscussion(res.data)
                }
            })
    }

    useEffect(() => {
        const usr = users.filter((user: UserModel) => user.uuid !== medicalEntityHasUser)
        if (usr.length > 0) {
            setSelectedUser(usr[0].uuid)
            addDiscussion(usr[0])
        }
    }, [users]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <SwitchConsultationDialogStyled sx={{minHeight: 150}} alignItems={"center"}>
            <Typography sx={{textAlign: "center"}}
                        variant="subtitle1">{t(`dialogs.${selectedEvent ? 'switch-consultation-dialog' : 'manage-consultation-dialog'}.sub-title${selectedEvent === null ? `-${dialogAction}` : ""}`)} </Typography>
            <Typography sx={{textAlign: "center"}}
                        marginTop={2}>{t(`dialogs.${selectedEvent ? 'switch-consultation-dialog' : 'manage-consultation-dialog'}.description${selectedEvent === null ? `-${dialogAction}` : ""}`).split(',')[0]}</Typography>
            <Typography
                sx={{textAlign: "center"}}>{t(`dialogs.${selectedEvent ? 'switch-consultation-dialog' : 'manage-consultation-dialog'}.description${selectedEvent === null ? `-${dialogAction}` : ""}`).split(',')[1]}</Typography>

            <Stack direction={"row"} py={3} alignItems={"center"} justifyContent={"space-between"} sx={{width: '90%'}}>
                <Stack direction={isMobile ? "column" : "row"} alignItems={"center"} spacing={1.2}>
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
                    sx={{
                        borderColor: 'divider',
                        bgcolor: theme => theme.palette.grey['A500'],
                    }}
                    startIcon={event?.extendedProps.restAmount === 0 ? <CheckIcon/> :
                        <IconUrl path={'ic-argent'}/>}
                    variant="outlined"
                    color="info"
                    onClick={() => setOpenPaymentDialog(true)}>
                    <Typography>{t("pay")}</Typography>
                    {event?.extendedProps.restAmount > 0 &&
                        <>
                            <Typography component='span'
                                        fontWeight={700}
                                        variant="subtitle2" ml={1}>
                                {event?.extendedProps.restAmount}
                            </Typography>
                            <Typography fontSize={10}>{devise}</Typography>
                        </>
                    }
                </Button>
                }
            </Stack>

            <Stack className="instruction-box" spacing={1}>
                <Typography variant="body2" color="text.secondary">{startCase(t('note'))}</Typography>
                <Select
                    id="demo-simple-select"
                    value={selectedUser}
                    size={"small"}
                    onChange={event => {
                        addDiscussion(users.find((usr: UserModel) => usr.uuid === event.target.value))
                        setSelectedUser(event.target.value)
                    }}>
                    {users.filter((user: UserModel) => user.uuid !== medicalEntityHasUser).map((user: UserModel) => (
                        <MenuItem key={user.uuid}
                                  value={user.uuid}>{user.firstName} {user.lastName}</MenuItem>))}
                </Select>

                <TextField
                    fullWidth
                    multiline
                    value={instruction}
                    onChange={event => {
                        setInstruction(event.target.value.slice(0, 255));
                    }}
                    placeholder={t("type_instruction_for_the_secretary")}
                    rows={2}
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
                                {['day', 'week', 'month'].map((item: string) => (
                                    <FormControlLabel
                                        key={item}
                                        onChange={() => {
                                            setCheckedNext(true);
                                            setTimeout(() => setSelectedDose(item));
                                        }}
                                        value={item}
                                        control={<Radio checked={selectedDose === item}/>}
                                        label={startCase(t(`times.${item}`))}
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
