// components
import {
    Typography,
    ListItem,
    Drawer,
    List,
    Stack,
    Box,
    ListItemIcon,
    CardContent,
    IconButton,
    Button,
    DialogActions
} from "@mui/material";
import Icon from "@themes/urlIcon";
import { useTranslation } from "next-i18next";
import ContentStyled from "./overrides/contantStyle";
import CircleIcon from '@mui/icons-material/Circle';
import { Dialog } from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import Add from "@mui/icons-material/Add";
import { data1, data2, data3, data4 } from './config'
import { useAppSelector, useAppDispatch } from "@app/redux/hooks";
import { configSelector } from "@features/base";
import { agendaSelector, openDrawer, setConfig, setStepperIndex } from "@features/calendar";
import { CustomStepper } from "@features/customStepper";
import { EventType, TimeSchedule, Patient, Instruction, setAppointmentDate } from "@features/tabPanel";
const EventStepper = [
    {
        title: "steppers.tabs.tab-1",
        children: EventType,
        disabled: false
    }, {
        title: "steppers.tabs.tab-2",
        children: TimeSchedule,
        disabled: true
    }, {
        title: "steppers.tabs.tab-3",
        children: Patient,
        disabled: true
    }, {
        title: "steppers.tabs.tab-4",
        children: Instruction,
        disabled: true
    }
];
const Content = ({ ...props }) => {
    const { id } = props;
    const { t, ready } = useTranslation('consultation', { keyPrefix: 'filter' });
    const { direction } = useAppSelector(configSelector);
    const { openAddDrawer, currentStepper } = useAppSelector(agendaSelector);
    const dispatch = useAppDispatch();
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [info, setInfo] = React.useState<null | string>('');
    const handleClickDialog = () => {
        setOpenDialog(true);

    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setInfo(null)
    }
    const handleOpen = (action: string) => {
        if (action === "consultation") {
            dispatch(openDrawer({ type: "add", open: true }));
            return
        }
        switch (action) {
            case "add_treatment":
                setInfo(action)
                break;
            case "balance_sheet_pending":
                setInfo(action)
                break;
            case "life_style":
                setInfo(action)
                break;
            case "family_history":
                setInfo(action)
                break;
            case "surgical_history":
                setInfo(action)
                break;
            default:
                setInfo(null)
                break;

        };
        handleClickDialog()

    };
    const handleStepperChange = (index: number) => {
        dispatch(setStepperIndex(index));
    };
    const submitStepper = (index: number) => {
        if (EventStepper.length !== index) {
            EventStepper[index].disabled = false;
        }
    }
    if (!ready) return <>loading translations...</>;
    return (
        <React.Fragment>
            {
                id !== 4 ?
                    <ContentStyled>
                        <CardContent>
                            {id === 1 &&
                                <Stack spacing={1} alignItems="flex-start">
                                    <List dense>
                                        {
                                            data1.map((list, index) =>
                                                <ListItem key={index}>
                                                    <ListItemIcon>
                                                        <CircleIcon />
                                                    </ListItemIcon>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {list.name} / {list.duration} {t(list.dosage)}
                                                    </Typography>
                                                    <IconButton size="small" sx={{ ml: 'auto' }}>
                                                        <Icon path="setting/icdelete" />
                                                    </IconButton>
                                                </ListItem>
                                            )
                                        }

                                    </List>
                                    <Button onClick={() => handleOpen("add_treatment")} size="small" startIcon={
                                        <Add />
                                    }>
                                        {t('add')}
                                    </Button>
                                </Stack>
                            }
                            {id === 2 &&
                                <Stack spacing={2} alignItems="flex-start">
                                    <List dense>
                                        {
                                            data2.map((list, index) =>
                                                <ListItem key={index}>
                                                    <ListItemIcon>
                                                        <CircleIcon />
                                                    </ListItemIcon>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {list.name}
                                                    </Typography>
                                                </ListItem>
                                            )
                                        }

                                    </List>
                                    <Stack direction="row" spacing={2}>
                                        <Button onClick={() => handleOpen("balance_sheet_pending")} size="small" startIcon={
                                            <Add />
                                        }>
                                            {t('add_result')}
                                        </Button>
                                        <Button color="error" size="small" startIcon={
                                            <Icon path="setting/icdelete" />
                                        }>
                                            {t('ignore')}
                                        </Button>
                                    </Stack>
                                </Stack>
                            }
                            {id === 3 &&
                                <Stack spacing={1} alignItems="flex-start">
                                    <List dense>
                                        {
                                            data3.map((list, index) =>
                                                <ListItem key={index}>
                                                    <ListItemIcon>
                                                        <CircleIcon />
                                                    </ListItemIcon>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {list.date}
                                                    </Typography>
                                                </ListItem>
                                            )
                                        }

                                    </List>
                                    <Stack mt={2}>
                                        <Button onClick={() => handleOpen("consultation")} size="small" startIcon={
                                            <Add />
                                        }>
                                            {t('add')}
                                        </Button>
                                    </Stack>
                                </Stack>
                            }

                        </CardContent>


                    </ContentStyled> :
                    data4.map((card, idx) =>
                        <ContentStyled key={`card-${idx}`}>
                            <CardContent>
                                <Typography fontWeight={600}>
                                    {t(card.title)}

                                </Typography>
                                <List dense>
                                    {
                                        card.list.map((item, index) =>
                                            <ListItem key={`list-${index}`}>
                                                <ListItemIcon>
                                                    <CircleIcon />
                                                </ListItemIcon>
                                                <Typography variant="body2" color="text.secondary">
                                                    {item.name}
                                                </Typography>
                                                <IconButton size="small" sx={{ ml: 'auto' }}>
                                                    <Icon path="setting/icdelete" />
                                                </IconButton>
                                            </ListItem>
                                        )
                                    }

                                </List>
                                <Stack mt={2} alignItems="flex-start">
                                    <Button onClick={() => handleOpen(card.title)} size="small" startIcon={
                                        <Add />
                                    }>
                                        {card.title === "life_style" ? t('add') : t("add_history")}
                                    </Button>
                                </Stack>
                            </CardContent>
                        </ContentStyled>
                    )

            }
            {
                info &&
                <Dialog action={info}
                    open={openDialog}
                    data={null}
                    change={false}
                    max
                    direction={'ltr'}
                    actions={true}
                    title={t(info)}
                    dialogClose={handleCloseDialog}
                    actionDialog={
                        <DialogActions>
                            <Button onClick={handleCloseDialog}
                                startIcon={<CloseIcon />}>
                                {t('cancel')}
                            </Button>
                            <Button variant="contained"
                                onClick={handleCloseDialog}

                                startIcon={<Icon
                                    path='ic-dowlaodfile' />}>
                                {t('save')}
                            </Button>
                        </DialogActions>
                    } />
            }
            <Drawer
                anchor={"right"}
                open={openAddDrawer}
                dir={direction}
                onClose={() => {
                    dispatch(openDrawer({ type: "add", open: false }));

                }}
            >
                <Box height={"100%"}>
                    <CustomStepper
                        currentIndex={currentStepper}
                        OnTabsChange={handleStepperChange}
                        OnSubmitStepper={submitStepper}
                        stepperData={EventStepper}
                        scroll
                        t={t}
                        minWidth={726}
                    />
                </Box>
            </Drawer>
        </React.Fragment>
    )
}
export default Content


