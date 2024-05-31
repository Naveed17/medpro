import {
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineSeparator,
    timelineItemClasses
} from '@mui/lab'
import React, {useState} from 'react'
import CardStyled from './overrides/cardStyle'
import {
    Alert,
    Avatar,
    Card,
    CardHeader,
    IconButton,
    List,
    ListItem,
    MenuItem,
    Stack,
    Theme,
    Typography,
    useTheme
} from '@mui/material'
import {CustomIconButton} from '@features/buttons'
import IconUrl from '@themes/urlIcon'
import {Label} from '@features/label';
import {useTranslation} from 'next-i18next'
import {ActionMenu} from '@features/menu';
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

const data = [...Array.from({length: 2})]

function PrevRdvCard() {
    const theme = useTheme() as Theme;
    const {t} = useTranslation("common");
    const [contextMenu, setContextMenu] = useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);
    const handleCloseMenu = () => {
        setContextMenu(null);
    }

    const OnMenuActions = (action: string) => {
        handleCloseMenu();
        switch (action) {
            case "onDelete":

                break;
            case "onRetry":

                break;
        }
    }
    return (
        <>
            <CardStyled
                sx={{
                    px: 0,
                    [`& .${timelineItemClasses.root}:before`]: {
                        flex: 0,
                        padding: 0,
                    },
                }}
            >
                {data.map((_, idx) =>
                    <TimelineItem key={idx} {...(idx > 0 && {
                        sx: {mt: 1}
                    })}>
                        <TimelineSeparator>
                            <TimelineDot variant='outlined' color='success'/>
                            {
                                data.length - 1 !== idx && <TimelineConnector/>
                            }

                        </TimelineSeparator>
                        <TimelineContent>
                            <Stack spacing={1}>
                                <Stack direction='row' alignItems='center' spacing={1} width={1}>
                                    <Typography variant='subtitle2' fontWeight={600}>
                                        DD/MM/YYYY
                                    </Typography>
                                    <Label color='success'
                                           sx={{color: theme.palette["success"].main, fontWeight: 500, fontSize: 14}}>
                                        Confirmed
                                    </Label>
                                    <CustomIconButton sx={{"&.custom-icon-button": {ml: 'auto'}}}>
                                        <IconUrl path='ic-printer-outlined'/>
                                    </CustomIconButton>
                                </Stack>
                                <Stack spacing={.5}>
                                    <Typography color={theme.palette.grey[500]}
                                                fontWeight={500}>{t("rdv_reason")}</Typography>
                                    <Typography fontWeight={500} color={'text.secondary'}>
                                        Chest pain and shortness of breath
                                    </Typography>
                                </Stack>
                                <Stack spacing={.5}>
                                    <Typography color={theme.palette.grey[500]}
                                                fontWeight={500}>{t("observation")}</Typography>
                                    <Typography fontWeight={500} color={'text.secondary'}>
                                        The patient reports intermittent chest pains for about 2 weeks, especially after
                                        physical exertion or during stressful situations. He also complains of feeling
                                        short of breath when walking for more than a few minutes.
                                    </Typography>
                                </Stack>
                                <Stack spacing={.5}>
                                    <Typography color={theme.palette.grey[500]}
                                                fontWeight={500}>{t("diagnosis")}</Typography>
                                    <List disablePadding dense>
                                        <ListItem disablePadding sx={{color: 'text.secondary'}}>
                                            1. Hypertensive heart disease
                                        </ListItem>
                                        <ListItem disablePadding sx={{color: 'text.secondary'}}>
                                            2. Type 2 diabetes mellitus
                                        </ListItem>
                                        <ListItem disablePadding sx={{color: 'text.secondary'}}>
                                            3. Chronic obstructive pulmonary disease (COPD) likely due to chronic
                                            smoking
                                        </ListItem>
                                    </List>
                                </Stack>
                                <Stack spacing={.5}>
                                    <Typography color={theme.palette.grey[500]}
                                                fontWeight={500}>{t("disease")}</Typography>
                                    <Typography fontWeight={500} color={'text.secondary'}>
                                        The Allergic List is currently empty. To start documenting Allergic, simply
                                        click the Add button. Thank you!
                                    </Typography>
                                </Stack>
                                <Stack spacing={.5}>
                                    <Typography color={theme.palette.grey[500]}
                                                fontWeight={500}>{t("refferals")}</Typography>
                                    <Typography fontWeight={500} color={'text.secondary'}>
                                        Chest X-ray for evaluation of pulmonary status.
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack spacing={2} mt={2}>
                                <Stack spacing={.5}>
                                    <Stack direction='row' justifyContent='space-between' alignItems='center'>
                                        <Typography color={theme.palette.grey[500]}
                                                    fontWeight={500}>{t("treatment")}</Typography>
                                        <IconButton size='small'>
                                            <IconUrl path='document-download'/>
                                        </IconButton>
                                    </Stack>
                                    <Stack direction={{xs: 'column', sm: 'row'}}
                                           alignItems={{xs: 'stretch', sm: 'center'}} spacing={1}>
                                        <Alert variant='outlined' icon={false} className='item-treatment'>
                                            <Typography fontWeight={500}>Losartan 50mg tablets</Typography>
                                            <Typography variant='caption' color={theme.palette.grey[500]}>Take 1 tablet
                                                orally once daily for hypertension</Typography>
                                        </Alert>
                                        <Alert variant='outlined' icon={false} className='item-treatment'>
                                            <Typography fontWeight={500}>Losartan 50mg tablets</Typography>
                                            <Typography variant='caption' color={theme.palette.grey[500]}>Take 1 tablet
                                                orally once daily for hypertension</Typography>
                                        </Alert>
                                    </Stack>
                                </Stack>
                                <Stack spacing={.5}>
                                    <Stack direction='row' justifyContent='space-between' alignItems='center'>
                                        <Typography color={theme.palette.grey[500]}
                                                    fontWeight={500}>{t("documents")}</Typography>
                                        <IconButton size='small'>
                                            <IconUrl path='document-download'/>
                                        </IconButton>
                                    </Stack>
                                    <Stack direction='row' alignItems='center' spacing={1}>
                                        <Card className='doc-card'>
                                            <CardHeader
                                                avatar={
                                                    <Avatar>
                                                        <IconUrl path='document-file'/>
                                                    </Avatar>
                                                }
                                                title={<Typography fontWeight={500}>Rapport.pdf</Typography>}
                                                subheader={<Typography variant='caption'
                                                                       color={theme.palette.grey[500]}>1.2
                                                    Mb</Typography>}
                                                action={
                                                    <IconButton
                                                        onClick={event => {
                                                            event.stopPropagation();
                                                            setContextMenu(
                                                                contextMenu === null
                                                                    ? {
                                                                        mouseX: event.clientX + 2,
                                                                        mouseY: event.clientY - 6,
                                                                    } : null,
                                                            );
                                                        }}
                                                        disableRipple sx={{p: 0}}>
                                                        <IconUrl path="ic-Filled-more-vertical"/>
                                                    </IconButton>
                                                }
                                            />
                                        </Card>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </TimelineContent>
                    </TimelineItem>
                )}
            </CardStyled>
            <ActionMenu {...{contextMenu, handleClose: handleCloseMenu}}>
                {[
                    {
                        title: "delete-document",
                        icon: <DeleteOutlineRoundedIcon/>,
                        action: "onDelete",
                    },
                ].map(
                    (v: any, index) => (
                        <MenuItem
                            key={index}
                            className="popover-item"
                            onClick={() => {
                                OnMenuActions(v.action);
                            }}>
                            {v.icon}
                            <Typography fontSize={15} sx={{color: "#fff"}}>
                                {v.title}
                            </Typography>
                        </MenuItem>
                    )
                )}
            </ActionMenu>
        </>
    )
}

export default PrevRdvCard
