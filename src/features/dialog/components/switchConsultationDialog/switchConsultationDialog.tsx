import {
    Avatar,
    Box,
    Button,
    Checkbox, FormControlLabel,
    IconButton,
    InputAdornment,
    InputBase, Radio,
    RadioGroup,
    Stack, TextField,
    Typography, useMediaQuery, useTheme
} from "@mui/material";
import React, {useState} from "react";
import {useTranslation} from "next-i18next";
import {startCase} from 'lodash'
import {useAppSelector} from "@lib/redux/hooks";
import {timerSelector} from "@features/card";
import {capitalizeFirst, useTimer} from "@lib/hooks";
import {FlipDate} from "@features/FlipDate";
import {Label} from "@features/label";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

function SwitchConsultationDialog() {
    const {timer} = useTimer();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const {t} = useTranslation("common");
    const {event} = useAppSelector(timerSelector);

    const [instruction, setInstruction] = useState("");
    const [checkedNext, setCheckedNext] = useState(false);
    const [meeting, setMeeting] = useState<number>(15);
    const [selectedDose, setSelectedDose] = useState("day")

    return (
        <Stack sx={{minHeight: 150}} alignItems={"center"}>
            <Typography sx={{textAlign: "center"}}
                        variant="subtitle1">{t(`dialogs.switch-consultation-dialog.sub-title`)} </Typography>
            <Typography sx={{textAlign: "center"}}
                        marginTop={2}>{t(`dialogs.switch-consultation-dialog.description`).split(',')[0]},</Typography>
            <Typography
                sx={{textAlign: "center"}}>{t(`dialogs.switch-consultation-dialog.description`).split(',')[1]}</Typography>

            <Stack direction={"row"} py={3} alignItems={"center"}>
                <Stack direction={"row"} alignItems={"center"} spacing={1.2}>
                    <Avatar sx={{width: 40, height: 40, bgcolor: 'primary.main'}}/>
                    <Stack>
                        <Stack direction={"row"} alignItems={"center"} spacing={.5}>
                            <Typography fontWeight={700}>
                                {capitalizeFirst(`${event?.extendedProps.patient.firstName} ${event?.extendedProps.patient.lastName}`)}
                            </Typography>
                        </Stack>
                        <FlipDate value={timer.split(" : ").map(time => parseInt(time))}/>
                    </Stack>

                    {(event?.extendedProps.type?.name || typeof event?.extendedProps.type === "string") &&
                        <Label color='warning' variant='filled' className='label'>
                            {event?.extendedProps.type?.name ??
                                (typeof event?.extendedProps.type === "string" ?
                                    (event?.extendedProps.type === "Consultation" ? "En Consultation" : event?.extendedProps.type) : "")}
                        </Label>}
                </Stack>
            </Stack>

            <Stack className="instruction-box" spacing={1}>
                <Typography variant="body2" color="text.secondary">{t('note')}</Typography>
                <TextField
                    fullWidth
                    multiline
                    value={instruction}
                    onChange={event => {
                        setInstruction(event.target.value.slice(0, 255));
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
    )
}

export default SwitchConsultationDialog;
