// components
import React, {useEffect, useState} from 'react';
import ConsultationStyled from "./overrides/consultationStyled";
import {
    Box,
    Typography,
    Avatar,
    Button,
    Stack,
    List,
    ListItem,
    ListItemIcon,
    IconButton,
    Collapse
} from "@mui/material";
import PlayCircleFilledRoundedIcon from '@mui/icons-material/PlayCircleFilledRounded';
import {Alert} from "@features/alert";
import Icon from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import Content from "./content";
import {collapse as collapseData} from './config';
import {upperFirst} from "lodash";
import {useAppDispatch, useAppSelector} from "@app/redux/hooks";
import {consultationSelector} from "@features/toolbar/components/consultationIPToolbar/selectors";
import moment from "moment-timezone";
import {toggleSideBar} from "@features/sideBarMenu";

function Consultation() {
    const img = false;
    const [collapse, setCollapse] = useState<any>('');
    const {t, ready} = useTranslation('consultation', {keyPrefix: 'filter'});
    const {patient} = useAppSelector(consultationSelector);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (patient)
            dispatch(toggleSideBar(false));
        console.log(patient)
    }, [dispatch, patient])

    if (!ready) return <>loading translations...</>;
    return (
        <ConsultationStyled>
            <Box className="header">
                <Box className="about">
                    <Avatar {...(img ? {
                        src: 'xyz',
                        alt: "name",
                        sx: {bgcolor: 'transparent', mr: 1}
                    } : {sx: {bgcolor: theme => theme.palette.primary.main, mr: 1}})} />
                    <Box>
                        <Typography variant="body1" color='primary.main'
                                    sx={{fontFamily: 'Poppins'}}>{patient?.firstName + ' ' + patient?.lastName}</Typography>
                        <Typography variant="body2"
                                    color='text.secondary'>{patient?.birthdate} ({patient?.birthdate ? moment().diff(new Date(patient?.birthdate), "years") : '--'} {t('year')})</Typography>
                    </Box>

                </Box>
                <Box className="contact" ml={2}>
                    <Typography component="div" textTransform="capitalize"
                                sx={{display: 'flex', alignItems: 'center', '& .react-svg': {mr: 1}, mb: (1.5)}}
                                variant="body1" color="text.primary"><Icon path="ic-doc"/>
                        {upperFirst(t("contact details"))}
                    </Typography>
                    <Box sx={{pl: 1}}>
                        <Typography component="div"
                                    sx={{display: 'flex', alignItems: 'center', '& .react-svg': {mr: 0.8}, mb: (0.3)}}
                                    variant="body2" color="text.secondary"><Icon path="ic-phone"/>
                            +33 6 78 78 78 78
                        </Typography>
                        <Typography component="div"
                                    sx={{display: 'flex', alignItems: 'center', '& .react-svg': {mr: 0.8}}}
                                    variant="body2" color="text.secondary"><Icon path="ic-message-contour"/>
                            {patient?.email}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Stack spacing={1} mb={1}>
                <Alert icon="ic-danger" color="warning" sx={{borderTopRightRadius: 0, borderBottomRightRadius: 0}}>
                    <Typography color="text.primary">{upperFirst(t(`duplicate detection`))}</Typography>
                </Alert>
                <Button variant="consultationIP" startIcon={<PlayCircleFilledRoundedIcon/>}
                        sx={{borderTopRightRadius: 0, borderBottomRightRadius: 0, px: 1.5}}>
                    {upperFirst(t('consultation in progress'))}
                </Button>
            </Stack>
            <Stack ml={-1.25}>
                <List dense>
                    {
                        collapseData?.map((col, idx: number) => (
                            <React.Fragment key={`list-item-${idx}`}>
                                <ListItem
                                    className='list-parent'
                                    onClick={() => setCollapse(collapse === col.id ? "" : col.id)}>

                                    <ListItemIcon>
                                        <Icon path={col.icon}/>
                                    </ListItemIcon>
                                    <Typography fontWeight={700}>
                                        {upperFirst(t(col.title))}
                                        {
                                            col.id === 2 &&
                                            <Typography fontWeight={500} ml={1} component="span">12/12/12</Typography>
                                        }
                                    </Typography>
                                    <IconButton size="small" sx={{ml: 'auto'}}>
                                        <Icon path="ic-expand-more"/>
                                    </IconButton>
                                </ListItem>
                                <ListItem
                                    sx={{p: 0}}
                                >
                                    <Collapse in={collapse === col.id} sx={{width: 1}}>
                                        <Box px={1.5}>
                                            <Content id={col.id} patient={patient}/>
                                        </Box>
                                    </Collapse>
                                </ListItem>
                            </React.Fragment>
                        ))
                    }
                </List>
            </Stack>
            <Button variant="consultationIP" startIcon={<Icon path="ic-doc-color"/>}
                    sx={{borderTopRightRadius: 0, borderBottomRightRadius: 0,}}>
                {upperFirst(t('patient record'))}
            </Button>
        </ConsultationStyled>
    )
}

export default Consultation
