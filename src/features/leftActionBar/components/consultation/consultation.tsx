// components
import ConsultationStyled from "./overrides/consultationStyled";
import { Box, Typography, Avatar, Button, Stack, ListItem, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import PlayCircleFilledRoundedIcon from '@mui/icons-material/PlayCircleFilledRounded';
import { Alert } from "@features/alert";
import { Accordion } from "@features/accordion";
import Icon from "@themes/urlIcon";
import { useTranslation } from "next-i18next";
import { Theme } from "@mui/material/styles";
import React from "react";
import { upperFirst } from "lodash";
const list = [
    {
        heading: {
            title: "way of life",
            icon: "ic-doc",
        },
        sublist: ["alcohol", "tobacco", "add a way of life"],
    },
    {
        heading: {
            title: "background",
            icon: "ic-medicament",
        },
        sublist: [
            { text: "diabetes", icon: "ic-diabete" },
            { text: "hypertension", icon: "ic-cardio" },
            "add history",
        ],
    },
    {
        heading: {
            title: "allergies",
            icon: "ic-medicament",
        },
        sublist: ["add allergies"],
    },
];
const data = [
    {
        heading: {
            id: "background",
            icon: "ic-edit-file2",
            title: "background",
        },

    },

];
const Content = () => {
    const { t, ready } = useTranslation('consultation', { keyPrefix: 'filter' });
    return (
        <React.Fragment>
            {list.map((list, j) =>
                <React.Fragment key={`list-${j}`}>
                    <Typography component="div" sx={{ "&::first-letter": { textTransform: "uppercase" }, display: 'flex', alignItems: 'center', '& .react-svg': { mr: 1.4 }, mt: j !== 0 ? 2 : 0 }} variant="body1" color="text.primary"><Icon path={list.heading.icon} />
                        {upperFirst(t(list.heading.title))}
                    </Typography>
                    <List sx={{ ml: 1 }}>
                        {list?.sublist.map((sub, k) =>
                            <ListItem disablePadding key={`sublist-${k}`}>
                                {list.sublist.length - 1 !== k ?
                                    <ListItemButton disableRipple sx={{ ':hover': { backgroundColor: 'transparent' }, p: 0, '& .react-svg svg': { width: 12, height: 12 } }}>
                                        {typeof sub === "object" ?
                                            <ListItemIcon sx={{ minWidth: '14px' }}>
                                                <Icon path={sub.icon} />
                                            </ListItemIcon>
                                            : null
                                        }
                                        <ListItemText sx={{ '& span': { fontSize: (theme: Theme) => theme.typography.caption, color: 'text.secondary' } }} primary={typeof sub === "object" ? upperFirst(t(sub.text)) : upperFirst(t(sub))} />
                                    </ListItemButton>
                                    : <ListItemButton disableRipple sx={{ ':hover': { backgroundColor: 'transparent' }, p: 0, '& .react-svg svg': { width: 12, height: 12, '& path': { fill: (theme: Theme) => theme.palette.primary.main } } }}>
                                        <ListItemIcon sx={{ minWidth: '14px' }}>
                                            <Icon path="ic-plus" />
                                        </ListItemIcon>
                                        <ListItemText sx={{ '& span': { fontSize: (theme: Theme) => theme.typography.caption }, color: (theme: Theme) => theme.palette.primary.main }} primary={typeof sub === "object" ? upperFirst(t(sub.text)) : upperFirst(t(sub))} />
                                    </ListItemButton>
                                }
                            </ListItem>
                        )}

                    </List>
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

function Consultation() {
    const img = false;
    const { t, ready } = useTranslation('consultation', { keyPrefix: 'filter' });
    if (!ready) return <>loading translations...</>;
    return (
        <ConsultationStyled>
            <Box className="header">
                <Box className="about">
                    <Avatar {...(img ? { src: 'xyz', alt: "name", sx: { bgcolor: 'transparent', mr: 1 } } : { sx: { bgcolor: theme => theme.palette.primary.main, mr: 1 } })} />
                    <Box>
                        <Typography variant="body1" color='primary.main' sx={{ fontFamily: 'Poppins' }}>Name</Typography>
                        <Typography variant="body2" color='text.secondary'>29/06/1989 (31{t('year')})</Typography>
                    </Box>

                </Box>
                <Box className="contact" ml={2}>
                    <Typography component="div" textTransform="capitalize" sx={{ display: 'flex', alignItems: 'center', '& .react-svg': { mr: 1 }, mb: (1.5) }} variant="body1" color="text.primary"><Icon path="ic-doc" />
                        {upperFirst(t("contact details"))}
                    </Typography>
                    <Box sx={{ pl: 1 }}>
                        <Typography component="div" sx={{ display: 'flex', alignItems: 'center', '& .react-svg': { mr: 0.8 }, mb: (0.3) }} variant="body2" color="text.secondary"><Icon path="ic-phone" />
                            +33 6 78 78 78 78
                        </Typography>
                        <Typography component="div" sx={{ display: 'flex', alignItems: 'center', '& .react-svg': { mr: 0.8 } }} variant="body2" color="text.secondary"><Icon path="ic-message-contour" />
                            Khadija.eha@gmail.com
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Stack spacing={1} mb={1}>
                <Alert icon="ic-danger" color="warning" sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
                    <Typography color="text.primary">{upperFirst(t(`duplicate detection`))}</Typography>
                </Alert>
                <Button variant="consultationIP" startIcon={<PlayCircleFilledRoundedIcon />} sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}>
                    {upperFirst(t('consultation in progress'))}
                </Button>
            </Stack>
            <Stack ml={-1.25}>
                <Accordion
                    translate={{
                        t: t,
                        ready: ready,
                    }}
                    badge={null}
                    defaultValue={"background"}
                    data={data}
                >
                    <Content />
                </Accordion>
            </Stack>
            <Button variant="consultationIP" startIcon={<Icon path="ic-doc-color" />} sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, }}>
                {upperFirst(t('patient record'))}
            </Button>
        </ConsultationStyled>
    )
}

export default Consultation
