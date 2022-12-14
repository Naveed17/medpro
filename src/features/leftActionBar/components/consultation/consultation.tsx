// components
import React, {useEffect, useState} from "react";
import ConsultationStyled from "./overrides/consultationStyled";
import {
    Avatar,
    Box,
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    Skeleton,
    Stack,
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
import {appLockSelector} from "@features/appLock";
import {onOpenPatientDrawer} from "@features/table";
import {LoadingScreen} from "@features/loadingScreen";
import {InputStyled} from "@features/tabPanel";
import IconUrl from "@themes/urlIcon";
import {CropImage} from "@features/cropImage";

function Consultation() {
    const [collapse, setCollapse] = useState<any>(4);
    const {t, ready} = useTranslation("consultation", {keyPrefix: "filter"});
    const {patient} = useAppSelector(consultationSelector);
    const {lock} = useAppSelector(appLockSelector);

    const [loading, setLoading] = useState<boolean>(true);
    const [number, setNumber] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const [picture, setPicture] = useState('');

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (patient && !lock) {
            dispatch(toggleSideBar(false));
            setNumber(patient.contact[0])
            setEmail(patient.email)
            setName(`${patient.firstName} ${patient.lastName}`)
            setLoading(false)
        }
    }, [patient]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleDrop = (acceptedFiles: FileList) => {
        const file = acceptedFiles[0];
        setPicture(URL.createObjectURL(file))
        setOpen(true);
    };

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);
    return (
        <ConsultationStyled>
            <Box className="header">
                <Box className="about">
                    <label htmlFor="contained-button-file">
                        <InputStyled
                            id="contained-button-file"
                            onChange={(e) => handleDrop(e.target.files as FileList)}
                            type="file"
                        />
                        <Avatar
                            src={picture === '' ? patient?.gender === "M" ? "/static/icons/men-avatar.svg" : "/static/icons/women-avatar.svg" : picture }
                            sx={{width: 59, height: 59, marginLeft: 2, marginRight: 2,borderRadius: 2}}>
                            <IconUrl path="ic-user-profile"/>
                        </Avatar>
                    </label>

                    <Box>
                        {loading ?
                            <>
                                <Skeleton width={130} variant="text"/>
                                <Skeleton variant="text"/>
                            </> : <>

                                <Typography variant="body1" color='primary.main'
                                            sx={{fontFamily: 'Poppins'}}>{name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {patient?.birthdate} (
                                    {patient?.birthdate
                                        ? moment().diff(moment(patient?.birthdate, "DD-MM-YYYY"), "years")
                                        : "--"}{" "}
                                    {t("year")})
                                </Typography></>}
                    </Box>

                    <Box onClick={() => {
                        dispatch(onOpenPatientDrawer({patientId: patient?.uuid}));
                    }}>
                        <IconButton size={"small"} sx={{position: "absolute", top: 20, right: 10}}>
                            <Icon path={'ic-duotone'}/>
                        </IconButton>
                    </Box>

                </Box>
                <Box className="contact" ml={2}>
                    <Typography component="div" textTransform="capitalize"
                                sx={{display: 'flex', alignItems: 'center', '& .react-svg': {mr: 1}, mb: (1.5)}}
                                variant="body1" color="text.primary"><Icon path="ic-doc"/>
                        {upperFirst(t("contact details"))}
                    </Typography>
                    <Box sx={{pl: 1}}>
                        {number && <Typography component="div"
                                               sx={{
                                                   display: 'flex',
                                                   alignItems: 'center',
                                                   '& .react-svg': {mr: 0.8},
                                                   mb: (0.3)
                                               }}
                                               variant="body2" color="text.secondary"><Icon path="ic-phone"/>
                            {(number.code ? number.code + ' ' : '') + number.value}
                        </Typography>}
                        <Typography component="div"
                                    sx={{display: 'flex', alignItems: 'center', '& .react-svg': {mr: 0.8}}}
                                    variant="body2" color="text.secondary"><Icon path="ic-message-contour"/>
                            {email ? email : t('addMail')}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box style={{
                display: "flex",
                alignItems: "center",
                marginLeft: '-30px',
                justifyContent: "center"
            }}>
            </Box>

            <Stack spacing={1} mb={1}>
                {/*{false && <Alert icon="ic-danger" color="warning" sx={{borderTopRightRadius: 0, borderBottomRightRadius: 0}}>
                    <Typography color="text.primary">{upperFirst(t(`duplicate detection`))}</Typography>
                </Alert>}*/}
                {/*<Button variant="consultationIP" startIcon={<PlayCircleFilledRoundedIcon/>}
                        sx={{borderTopRightRadius: 0, borderBottomRightRadius: 0, px: 1.5}}>
                    {upperFirst(t('consultation in progress'))}
                </Button>*/}
            </Stack>
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

            <CropImage
                open={open}
                img={picture}
                setOpen={setOpen}
                setPicture={setPicture}
                setFieldValue={null}
            />
        </ConsultationStyled>
    );
}

export default Consultation;
