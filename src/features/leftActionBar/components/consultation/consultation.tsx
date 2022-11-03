// components
import React, {useEffect, useState} from "react";
import ConsultationStyled from "./overrides/consultationStyled";
import {
    Avatar,
    Box,
    Button,
    Collapse,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemIcon,
    Skeleton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Icon from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import Content from "./content";
import {collapse as collapseData} from "./config";
import {upperFirst} from "lodash";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {consultationSelector} from "@features/toolbar";
import moment from "moment-timezone";
import {toggleSideBar} from "@features/sideBarMenu";
import SaveAsIcon from '@mui/icons-material/SaveAs';
import {useRequestMutation} from "@app/axios";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {pxToRem} from "@themes/formatFontSize";
import {appLockSelector} from "@features/appLock";
import {onOpenPatientDrawer} from "@features/table";

function Consultation() {
    const [collapse, setCollapse] = useState<any>(4);
    const {t, ready} = useTranslation("consultation", {keyPrefix: "filter"});
    const {patient} = useAppSelector(consultationSelector);
    const {lock} = useAppSelector(appLockSelector);

    const [loading, setLoading] = useState<boolean>(true);
    const [edit, setEdit] = useState<boolean>(false);
    const [number, setNumber] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const {trigger} = useRequestMutation(null, "/patients");

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (patient && !lock) {
            dispatch(toggleSideBar(false));
            console.log(patient);
            setNumber(patient.contact[0])
            setEmail(patient.email)
            setName(patient.firstName + " " + patient.lastName)
            setLoading(false)
        }
    }, [dispatch, patient]); // eslint-disable-line react-hooks/exhaustive-deps

    const router = useRouter();
    const {data: session} = useSession();
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    if (!ready) return <>loading translations...</>;
    return (
        <ConsultationStyled>
            <Box className="header">
                <Box className="about">
                    <Avatar
                        sx={{width: 59, height: 59, marginLeft: 2, marginRight: 2}}
                        src={
                            patient?.gender === "M"
                                ? "/static/icons/men-avatar.svg"
                                : "/static/icons/women-avatar.svg"
                        }
                    />
                    <Box>
                        {loading ?
                            <>
                                <Skeleton width={130} variant="text"/>
                                <Skeleton variant="text"/>
                            </> : <>
                                <TextField variant="standard"
                                           InputProps={{
                                               style: {
                                                   background: "white",
                                                   width: '120%'
                                               },
                                               disableUnderline: true,
                                           }}
                                           inputProps={{
                                               style: {
                                                   background: "white",
                                                   fontSize: pxToRem(14),
                                                   color: '#0696D6'
                                               },
                                               readOnly: !edit
                                           }}
                                           placeholder={'name'}
                                           onChange={(ev) => {
                                               setName(ev.target.value)
                                               /*if (patient) {
                                                   let p = {...patient}
                                                   console.log(ev.target.value)
                                                   const res = ev.target.value.split(' ')
                                                   p.firstName = res[0];
                                                   p.lastName = res[1] ? res[1] : '';
                                                   dispatch(SetPatient(p))
                                               }*/
                                           }}
                                           id={'name'}
                                           onClick={() => {
                                               // setEdit(true)
                                               dispatch(onOpenPatientDrawer({patientId: patient?.uuid}));
                                           }}
                                           value={name}/>
                                <Typography variant="body2" color="text.secondary">
                                    {patient?.birthdate} (
                                    {patient?.birthdate
                                        ? moment().diff(moment(patient?.birthdate, "DD-MM-YYYY"), "years")
                                        : "--"}{" "}
                                    {t("year")})
                                </Typography></>}
                    </Box>

                    <Box onClick={() => {
                        // setEdit(true)
                        // document.getElementById('name')?.focus()
                        dispatch(onOpenPatientDrawer({patientId: patient?.uuid}));
                    }}>
                        <IconButton size={"small"} sx={{position: "absolute", top: 20, right: 10}}>
                            <Icon path={'ic-duotone'}/>
                        </IconButton>
                    </Box>
                </Box>
                <Box className="contact" ml={2}>
                    <Typography
                        component="div"
                        textTransform="capitalize"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            "& .react-svg": {mr: 1},
                            mb: 1.5,
                        }}
                        variant="body1"
                        color="text.primary"
                    >
                        <Icon path="ic-doc"/>
                        {upperFirst(t("contact details"))}
                    </Typography>
                    <Box sx={{pl: 1}}>
                        {number &&
                            <TextField variant="standard"
                                       InputProps={{
                                           style: {
                                               background: "white",
                                               width: '120%'
                                           },
                                           disableUnderline: true,
                                           startAdornment: (
                                               <InputAdornment
                                                   position="start">
                                                   <Icon
                                                       path="ic-phone"/>
                                               </InputAdornment>
                                           )
                                       }}
                                       inputProps={{
                                           style: {
                                               background: "white",
                                               fontSize: 12,
                                               color: '#7C878E'
                                           },
                                           readOnly: !edit

                                       }}
                                       onChange={(ev) => {
                                           if (patient) {
                                               let nm = {...number}
                                               nm.value = ev.target.value
                                               setNumber(nm)
                                           }
                                       }}
                                       onClick={() => {
                                           setEdit(true)
                                       }}
                                       placeholder={'Ajouter téléphone'}
                                       value={(number.code ? number.code + ' ' : '') + number.value}
                            />}

                        <TextField variant="standard"
                                   InputProps={{
                                       style: {background: "white", width: '120%'},
                                       disableUnderline: true,
                                       startAdornment: (
                                           <InputAdornment position="start">
                                               <Icon path="ic-message-contour"/>
                                           </InputAdornment>
                                       )
                                   }}
                                   inputProps={{
                                       style: {
                                           background: "white",
                                           fontSize: 12,
                                           color: '#7C878E'
                                       },
                                       readOnly: !edit
                                   }}
                                   onChange={(ev) => {
                                       setEmail(ev.target.value)
                                   }}
                                   onClick={() => {
                                       setEdit(true)
                                   }}
                                   placeholder={'Ajouter adresse e-mail'}
                                   value={email}/>
                    </Box>
                </Box>
            </Box>
            <Box style={{
                display: "flex",
                alignItems: "center",
                marginLeft: '-30px',
                justifyContent: "center"
            }}>
                {edit && <Button className='btn-add'
                                 sx={{ml: 'auto', margin: 'auto'}}
                                 size='small'
                                 onClick={() => {
                                     console.log(patient)
                                     const firstLastName = name.split(' ')
                                     if (patient) {
                                         const form = new FormData();
                                         form.append('first_name', firstLastName[0]);
                                         form.append('last_name', firstLastName[1] ? firstLastName[1] : '');
                                         form.append('gender', patient.gender === 'M' ? '1' : '2');
                                         form.append('phone', JSON.stringify(patient.contact[0]));
                                         form.append('email', email);

                                         trigger({
                                             method: "PUT",
                                             url: "/api/medical-entity/" + medical_entity.uuid + '/patients/' + patient?.uuid + '/' + router.locale,
                                             headers: {
                                                 ContentType: 'application/x-www-form-urlencoded',
                                                 Authorization: `Bearer ${session?.accessToken}`
                                             },
                                             data: form,
                                         }, {revalidate: true, populateCache: true}).then((data) => {
                                             console.log(data)
                                         });

                                         setEdit(false)
                                     }
                                 }}
                                 startIcon={<SaveAsIcon/>}>
                    {t('save')}
                </Button>}
            </Box>

            {/* <Stack spacing={1} mb={1}>
                <Alert icon="ic-danger" color="warning" sx={{borderTopRightRadius: 0, borderBottomRightRadius: 0}}>
                    <Typography color="text.primary">{upperFirst(t(`duplicate detection`))}</Typography>
                </Alert>
                <Button variant="consultationIP" startIcon={<PlayCircleFilledRoundedIcon/>}
                        sx={{borderTopRightRadius: 0, borderBottomRightRadius: 0, px: 1.5}}>
                    {upperFirst(t('consultation in progress'))}
                </Button>
            </Stack>*/}
            <Stack ml={-1.25}>
                <List dense>
                    {collapseData?.map((col, idx: number) => (
                        <React.Fragment key={`list-item-${idx}`}>
                            <ListItem
                                className="list-parent"
                                onClick={() => setCollapse(collapse === col.id ? "" : col.id)}
                            >
                                <ListItemIcon>
                                    <Icon path={col.icon}/>
                                </ListItemIcon>
                                <Typography fontWeight={700}>
                                    {upperFirst(t(col.title))}
                                    {col.id === 2 && (
                                        <Typography
                                            fontWeight={500}
                                            ml={1}
                                            component="span"
                                        ></Typography>
                                    )}
                                </Typography>
                                <IconButton size="small" sx={{ml: "auto"}}>
                                    <Icon path="ic-expand-more"/>
                                </IconButton>
                            </ListItem>
                            <ListItem sx={{p: 0}}>
                                <Collapse in={collapse === col.id} sx={{width: 1}}>
                                    <Box px={1.5}>
                                        <Content id={col.id} patient={patient}/>
                                    </Box>
                                </Collapse>
                            </ListItem>
                        </React.Fragment>
                    ))}
                </List>
            </Stack>
            {/*  <Button variant="consultationIP" startIcon={<Icon path="ic-doc-color"/>}
                    sx={{borderTopRightRadius: 0, borderBottomRightRadius: 0,}}>
                {upperFirst(t('patient record'))}
            </Button>*/}
        </ConsultationStyled>
    );
}

export default Consultation;
