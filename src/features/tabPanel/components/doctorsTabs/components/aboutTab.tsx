import {Label} from '@features/label';
import {ConditionalWrapper} from '@lib/hooks';
import {
    Grid,
    Stack,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    Avatar,
    ListItemText,
    Button,
    ListItemIcon,
    IconButton
} from '@mui/material'
import IconUrl from '@themes/urlIcon'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Zoom from "react-medium-image-zoom";
import React, {useEffect, useState} from 'react'

function AboutTab({...props}) {
    const {t, user, theme, handleOpenRestPass, handleOpenMeun} = props;
    const [slots, setSlots] = useState<any>({
        MON: [],
        TUE: [],
        WED: [],
        THU: [],
        FRI: [],
        SAT: [],
        SUN: []
    });

    useEffect(() => {
        if (user?.slots) {
            const slots: any = {
                MON: [],
                TUE: [],
                WED: [],
                THU: [],
                FRI: [],
                SAT: [],
                SUN: []
            };
            const hours = (Object.values(user.slots)[0] as any)?.slots;
            Object.keys(hours).forEach((ohours: any, index: number) => {
                slots[ohours] = hours[ohours];
            });
            setSlots(slots);
        }
    }, [user?.slots]);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                    <Card sx={{overflow: 'visible'}}>
                        <CardContent>
                            <ConditionalWrapper
                                condition={false}
                                wrapper={(children: any) => <Zoom>{children}</Zoom>}>
                                <Stack alignItems='center' spacing={1.5}>
                                    <Avatar
                                        className={"zoom"}
                                        src={"/static/icons/men-avatar.svg"}
                                        sx={{
                                            "& .injected-svg": {
                                                margin: 0
                                            },
                                            width: 75,
                                            height: 75,
                                            borderRadius: 2

                                        }}>
                                        <IconUrl width={75} height={75} path="men-avatar"/>
                                    </Avatar>
                                    <Stack spacing={.5} alignItems={"center"}>
                                        <Typography variant="subtitle2" fontWeight={700} color="primary">
                                            Dr {user?.firstName} {user?.lastName}
                                        </Typography>
                                        <Typography variant="body2">
                                            {user?.specialities.map((specialitie: any) => specialitie.speciality.name).join(",")}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </ConditionalWrapper>

                            <Typography mt={1} gutterBottom variant="subtitle1" fontWeight={600}>
                                {t("personal_info")}
                            </Typography>
                            <List disablePadding>
                                <ListItem disablePadding sx={{py: .5}}>
                                    <Typography width={140} variant="body2" color='text.secondary'>
                                        {t("cin")}
                                    </Typography>
                                    <Typography fontWeight={500}>
                                        {user?.cin ?? "-"}
                                    </Typography>
                                </ListItem>
                                <ListItem disablePadding sx={{py: .5}}>
                                    <Typography width={140} variant="body2" color='text.secondary'>
                                        {t("birthdate")}
                                    </Typography>
                                    <Typography fontWeight={500}>
                                        {user?.birthDate ?? "-"}
                                    </Typography>
                                </ListItem>
                                <ListItem disablePadding sx={{py: .5, alignItems: 'flex-start'}}>
                                    <Typography width={140} variant="body2" color='text.secondary'>
                                        {t("mobile")}
                                    </Typography>
                                    <Stack spacing={1.25}>
                                        {user?.contacts?.map((contact: ContactModel, index: number) =>
                                            <Stack key={index} direction='row' alignItems='center'
                                                   spacing={1}>
                                                <Avatar
                                                    sx={{
                                                        width: 27,
                                                        height: 18,
                                                        borderRadius: 0
                                                    }}
                                                    alt={"flags"}
                                                    src={`https://flagcdn.com/tn.svg`}
                                                />
                                                <Typography fontWeight={500}>
                                                    {contact.code} {contact.value}
                                                </Typography>
                                            </Stack>) ?? "-"}
                                    </Stack>
                                </ListItem>
                                <ListItem disablePadding sx={{py: .5}}>
                                    <Typography width={140} variant="body2" color='text.secondary'>
                                        {t("email")}
                                    </Typography>
                                    <Typography fontWeight={500}>
                                        {user?.email ?? "-"}
                                    </Typography>
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <Stack spacing={1} alignItems='flex-start'>
                                <Typography variant='subtitle2' fontWeight={600}>
                                    {t("department")}
                                </Typography>
                                {user?.department.map((department: DepartmentModel, index: number) =>
                                    <Button key={index} variant="google"
                                            sx={{bgcolor: theme.palette.info.main, border: 'none'}}>
                                        {department.name}
                                    </Button>)}
                                <Typography variant='subtitle1' fontWeight={600}>
                                    {t("assigned_staff")}
                                </Typography>
                                <List disablePadding sx={{width: 1}}>
                                    {user?.assigned.map((assign: any, index: number) => <ListItem
                                        key={index}
                                        sx={{px: 1, mb: .5, border: 1, borderColor: 'divider', borderRadius: 1.6}}
                                        secondaryAction={
                                            <IconButton
                                                disableRipple
                                                size="small"
                                                onClick={handleOpenMeun}>
                                                <MoreVertIcon fontSize='small'/>
                                            </IconButton>
                                        }>
                                        <ListItemIcon>
                                            <Avatar
                                                src={"/static/icons/men-avatar.svg"}
                                                sx={{
                                                    width: 45,
                                                    height: 45,
                                                    borderRadius: 2

                                                }}>
                                                <IconUrl width={45} height={45} path="men-avatar"/>
                                            </Avatar>
                                        </ListItemIcon>
                                        <Stack spacing={.2}>
                                            <Typography fontSize={13} fontWeight={600} color='primary'>
                                                Mme Salme Rezgui
                                            </Typography>
                                            <Typography variant='body2' fontWeight={600}>
                                                Secretaire
                                            </Typography>
                                        </Stack>
                                    </ListItem>)}
                                    {user?.assigned?.length === 0 && "-"}
                                </List>
                                <Typography variant='subtitle1' fontWeight={600}>
                                    {t("rest_pass")}
                                </Typography>
                                <Button
                                    variant='google'
                                    onClick={handleOpenRestPass}
                                    disableRipple
                                    sx={{
                                        bgcolor: theme.palette.grey["A500"],
                                        alignSelf: 'flex-start',
                                        border: 'none'

                                    }}>
                                    {t("rest_pass")}
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                {t("pro_qualifications")}
                            </Typography>
                            <List disablePadding sx={{mb: 2}}>
                                {user?.qualification?.map((qualification: QualificationModel, index: number) =>
                                    <ListItem
                                        key={index}
                                        disablePadding>
                                        <ListItemText sx={{m: .2}}
                                                      primary="* Infertilité et Assistance médicale à la procréation"/>
                                    </ListItem>)}
                                {user?.qualification?.length === 0 && "-"}
                            </List>
                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                {t("spoken_lang")}
                            </Typography>
                            <List disablePadding>
                                {user?.languages.map((lang: LanguageModel, idx: number) =>
                                    <ListItem disablePadding key={idx}>
                                        <ListItemText sx={{m: .1}} primary={lang.name}/>
                                    </ListItem>)}
                            </List>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                {t("acts_&_care")}
                            </Typography>
                            <Stack mt={1} direction='row' flexWrap="wrap" alignItems='center' sx={{gap: 1}}>
                                {user?.acts.map((act: ActModel, idx: number) =>
                                    <Label key={idx} variant="filled" sx={{bgcolor: theme.palette.grey["B905"]}}>
                                        {act.act.name}
                                    </Label>)}
                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
                <Stack spacing={2}>
                    <Card>
                        <CardContent>
                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                {t("scheduled_shifts")}
                            </Typography>
                            <List>
                                {Object.keys(slots).map((day: any, index) =>
                                    <ListItem disablePadding key={index}
                                              sx={{py: .5}}>
                                        <ListItemText sx={{m: 0, span: {fontWeight: 600}}}
                                                      primary={t(`days.${day}`, {ns: "common"})}/>
                                        <Label variant="filled" sx={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            bgcolor: theme.palette.background.default,
                                            borderRadius: 1,
                                            px: 1.5,
                                            py: 1,
                                            height: 37
                                        }}>
                                            {slots[day].map((slot: any) => `${slot.start_time} - ${slot.end_time}`)}
                                        </Label>
                                    </ListItem>)}
                            </List>
                        </CardContent>
                    </Card>
                    {/*<Card>
                        <CardContent>
                            <Typography gutterBottom variant="subtitle1" fontWeight={600}>
                                {t("price_list")}
                            </Typography>
                            <List>
                                {
                                    ["Consultation simple", "Consultation endométriose 1ere fois", "Echographie pelvienne", "Pose dispositif intra utérin (DIU)", "Retrait ou changement dispositif intra utérin (DIU)", "Colposcopie", "Hystéroscopie"].map((day, idx) =>
                                        <ListItem disablePadding key={idx}

                                                  sx={{py: .5}}
                                        >
                                            <ListItemText sx={{m: 0, maxWidth: 180, span: {fontWeight: 600}}}
                                                          primary={day}/>
                                            <Label variant="filled" sx={{
                                                fontSize: 14,
                                                ml: 'auto',
                                                fontWeight: 600,
                                                bgcolor: theme.palette.background.default,
                                                borderRadius: 1,
                                                px: 1.5,
                                                py: 1,
                                                height: 37
                                            }}>
                                                70 TND - 100 TND
                                            </Label>
                                        </ListItem>
                                    )
                                }


                            </List>
                        </CardContent>
                    </Card>*/}
                </Stack>
            </Grid>
        </Grid>
    )
}

export default AboutTab
