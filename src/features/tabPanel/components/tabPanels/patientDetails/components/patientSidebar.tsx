import React, { useState } from 'react'
import RootStyled from './overrides/rootStyle'
import { Alert, Avatar, AvatarGroup, Button, Card, CardContent, CardHeader, Collapse, FormControl, FormHelperText, Grid, IconButton, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material'
import IconUrl from '@themes/urlIcon';
import moment from "moment-timezone";
import { CustomIconButton } from '@features/buttons';
import { Label } from '@features/label';
const diseaseData = ["pregnancy_and_childbirth", "psychomotor_development", "risk_factors", "allergic", "family_antecedents", "previous_surgery"]
function PatientSidebar({ ...props }) {
    const { t, devise, theme } = props
    const [editNote, setEditNote] = useState(false);
    const [diseaseCollapse, setDiseaseCollapse] = useState<number>(-1);
    const input = React.useRef<any>();
    return (
        <RootStyled>
            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <Stack direction='row' alignItems='center' justifyContent='space-between'>
                            <Stack direction='row' alignItems='center' spacing={2}>
                                <Avatar
                                    src="/static/img/25.png"
                                    className='patient-avatar'>
                                    <IconUrl path="ic-image" />
                                </Avatar>
                                <Stack spacing={.3}>
                                    <Typography fontWeight={600} color="primary" variant='subtitle1'>
                                        User Name
                                    </Typography>
                                    <Stack direction='row' alignItems='center' spacing={.5}>
                                        <IconUrl path="ic-outline-cake" />
                                        <Typography fontWeight={500} color='text.secondary'>
                                            29/06/1989 {`(${moment().diff(moment("29/06/1989", "DD-MM-YYYY"), 'years')}ans)`}
                                        </Typography>
                                    </Stack>
                                    <AvatarGroup max={3} sx={{ flexDirection: 'row' }}>
                                        <Tooltip title={"assurance-1"}>
                                            <Avatar
                                                src={"/static/img/assurance-1.png"}
                                                alt={"assurance-1"}
                                                className='assurance-avatar' variant={"circular"}>

                                            </Avatar>
                                        </Tooltip>
                                        <Tooltip title={"assurance-2"}>
                                            <Avatar
                                                src={"/static/img/assurance-2.png"}
                                                alt={"assurance-2"}
                                                className='assurance-avatar' variant={"circular"}>

                                            </Avatar>
                                        </Tooltip>
                                    </AvatarGroup>
                                </Stack>
                            </Stack>
                            <CustomIconButton color="success">
                                <IconUrl path="ic-filled-call" width={20} height={20} />
                            </CustomIconButton>
                        </Stack>
                        <Stack spacing={1}>
                            <Alert className='alert-primary' icon={<IconUrl path="ic-folder" />} severity="primary">
                                <Typography fontWeight={600} variant='subtitle2'>
                                    Fiche N° 15/9
                                </Typography>
                            </Alert>
                            <Stack direction='row' spacing={1} alignItems='center'>
                                <Label color='success' sx={{ width: 1, height: 28 }}>
                                    <Typography fontWeight={500} component='span' color='success.main'>
                                        {t("credit")} 0 {devise}
                                    </Typography>
                                </Label>
                                <Label color='error' sx={{ width: 1, height: 28 }}>
                                    <Typography fontWeight={500} component='span' color='error.main'>
                                        {t("debit")} 0 {devise}
                                    </Typography>
                                </Label>
                            </Stack>
                            <Alert icon={false} className='appoint-alert'>
                                <Stack direction='row' alignItems='center' spacing={2}>
                                    <CustomIconButton className="btn-upcoming" disableRipple>
                                        <IconUrl path="ic-agenda-jour" width={21} height={21} color={theme.palette.primary.main} />
                                    </CustomIconButton>
                                    <Stack>
                                        <Typography fontWeight={600} color="text.primary" variant='subtitle2'>
                                            {t("upcoming")}
                                        </Typography>
                                        <Typography fontWeight={600} color="text.primary" variant='subtitle1'>
                                            2 {" "}
                                            <Typography variant='caption'>
                                                {t("appointments")}
                                            </Typography>
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Alert>
                            <Alert icon={false} className='appoint-alert'>
                                <Stack direction='row' alignItems='center' spacing={2}>
                                    <CustomIconButton className="btn-completed" disableRipple>
                                        <IconUrl path="ic-agenda-tick" width={21} height={21} color={theme.palette.success.main} />
                                    </CustomIconButton>
                                    <Stack>
                                        <Typography fontWeight={600} color="text.primary" variant='subtitle2'>
                                            {t("completed")}
                                        </Typography>
                                        <Typography fontWeight={600} color="text.primary" variant='subtitle1'>
                                            12 {" "}
                                            <Typography variant='caption'>
                                                {t("appointments")}
                                            </Typography>
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Alert>
                        </Stack>
                        <Stack spacing={1.5}>
                            <Button color='warning' variant='contained' startIcon={<IconUrl path="ic-filled-play" />}>
                                {t("start_consultation")}

                            </Button>
                            <Button variant='contained' startIcon={<IconUrl path="ic-agenda-plus" />}>
                                {t("add_rdv")}
                            </Button>
                            <Button className='btn-dup' disableRipple variant='text-black' startIcon={<IconUrl path="ic-danger" color={theme.palette.error.main} />}>
                                {t("duplicate")}
                            </Button>
                        </Stack>
                        <FormControl fullWidth className='note-wrapper'>
                            <TextField
                                inputRef={input}
                                sx={{ border: 'none !important' }}
                                multiline rows={3} label="Note"
                                InputProps={{
                                    endAdornment: <IconButton onClick={() => {
                                        var updated;
                                        setEditNote((prev) => {
                                            updated = !prev;
                                            return updated;
                                        });
                                        if (updated) {
                                            input?.current.focus();
                                        }

                                    }} size='small'><IconUrl width={17} height={17} color={theme.palette.text.secondary} path={editNote ? "ic-check-circle" : "ic-edit-pen"} /></IconButton>,
                                    readOnly: !editNote
                                }}
                                InputLabelProps={{ shrink: true }} />
                            <FormHelperText component={Stack} direction='row' alignItems='center' spacing={1}>
                                <IconUrl path="ic-agenda-jour" color={theme.palette.text.secondary} width={16} height={16} />
                                <Typography color="text.secondary" variant='caption' fontSize={14}>
                                    DD/MM/YYYY
                                </Typography>
                            </FormHelperText>
                        </FormControl>
                        {diseaseData.map((item: string, idx: number) =>
                            <Card key={idx} className="disease-card">
                                <CardHeader
                                    onClick={() => setDiseaseCollapse(
                                        diseaseCollapse === idx ? -1 : idx
                                    )}
                                    avatar={
                                        <IconUrl path="ic-outline-arrow-square-down" />
                                    }

                                    title={t(item)}

                                />
                                <Collapse in={diseaseCollapse === idx}>
                                    <CardContent>
                                        <Button sx={{ px: 1 }} variant="primary-light" size='small' startIcon={<IconUrl path="ic-plus" width={16} height={16} />}>
                                            {t("add")}
                                        </Button>
                                    </CardContent>
                                </Collapse>
                            </Card>
                        )}

                    </Stack>
                </CardContent>
            </Card>
        </RootStyled>
    )
}

export default PatientSidebar