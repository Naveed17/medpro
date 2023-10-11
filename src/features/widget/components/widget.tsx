import React, {memo, useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {
    Box,
    Button,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Stack,
    Typography,
    useTheme,
} from "@mui/material";
import {alpha} from "@mui/material/styles";
import {ModelDot} from "@features/modelDot";
import ConsultationModalStyled from "./overrides/modalConsultationStyle";
import IconUrl from "@themes/urlIcon";
import {motion} from "framer-motion";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import TeethWidget from "@features/widget/components/teethWidget";
import {useTranslation} from "next-i18next";
import TeethPreview from "@features/widget/components/teethPreview";
import ReactDOM from "react-dom/client";
import {useRouter} from "next/router";
import {useRequestQueryMutation} from "@lib/axios";
import OphtPreview from "@features/widget/components/ophtPreview";

const Form: any = dynamic(
    () => import("@formio/react").then((mod: any) => mod.Form),
    {
        ssr: false,
    }
);

const variants = {
    initial: {opacity: 0},
    animate: {
        opacity: 1,
    },
};

const WidgetForm: any = memo(({src, ...props}: any) => {
    let cmp: any[] = [];
    const {
        modal,
        appuuid,
        data,
        changes,
        setChanges,
        previousData,
        selectedModel,
        trigger,
        autoUpdate,
        mutateSheetData,
        showToolbar,
        url
    } = props;

    if (modal) {
        if (previousData && modal.length > 0) {
            modal[0].components.map((mc: { key: string; description: string; }) => {
                const index = Object.keys(previousData).findIndex(pdata => pdata === mc.key);
                if (index > -1 && !mc.description?.includes('(') && previousData[mc.key]) {
                    const unity = mc.description ? mc.description : "";
                    mc.description = ` (${previousData[mc.key]} ${unity}) `
                }
            })
            cmp = [...modal];
        } else
            cmp = [...modal];
    }

    return (
        <>
            <Form
                onChange={(ev: any) => {
                    if (Object.keys(ev.data).length !== 0) {
                        localStorage.setItem(`Modeldata${appuuid}`, JSON.stringify({...JSON.parse(localStorage.getItem(`Modeldata${appuuid}`) as string), ...ev.data}));
                        const item = changes.find(
                            (change: { name: string }) => change.name === "patientInfo"
                        );
                        item.checked =
                            Object.values(ev.data).filter((val) => val !== "").length > 0;
                        setChanges([...changes]);
                    }
                }}
                {...(autoUpdate && {
                    onBlur: (ev: { data: any; }) => {
                        const form = new FormData();
                        form.append("modal_data", JSON.stringify({...JSON.parse(localStorage.getItem(`Modeldata${appuuid}`) as string), ...ev.data}));
                        form.append("modal_uuid", selectedModel?.default_modal.uuid);
                        trigger({
                            method: "PUT",
                            url,
                            data: form
                        }, {
                            onSuccess: () => mutateSheetData()
                        });
                    }
                })}
                // @ts-ignore
                submission={{
                    data
                    /*: localStorage.getItem(`Modeldata${appuuid}`)
                    ? JSON.parse(localStorage.getItem(`Modeldata${appuuid}`) as string)
                    : data,*/
                }}
                form={{
                    display: "form",
                    components: cmp,
                }}
            />
        </>
    );
});
WidgetForm.displayName = "widget-form";

function Widget({...props}) {
    const {
        modal,
        setModal,
        data,
        models,
        appuuid,
        changes,
        expandButton = true,
        setChanges,
        autoUpdate,
        isClose,
        handleClosePanel,
        previousData,
        showToolbar,
        acts, setActs, selectedModel,
        url, mutateSheetData,printGlasses
    } = props;
    const router = useRouter();
    const theme = useTheme();

    const {t, ready} = useTranslation("consultation", {keyPrefix: "widget"});

    const [open, setOpen] = useState(false);
    const [openTeeth, setOpenTeeth] = useState("");
    const [updated, setUpdated] = useState(false);

    const [closePanel, setClosePanel] = useState<boolean>(isClose);
    const [closeMobilePanel, setCloseMobilePanel] = useState<boolean>(true);
    const [defaultModal, setDefaultModal] = useState<ModalModel>({
        color: "#FEBD15",
        hasData: false,
        isEnabled: true,
        label: "--",
        structure: [],
        uuid: "",
    });

    const {trigger: triggerAppointmentEdit} = useRequestQueryMutation("appointment/edit");

    useEffect(() => {
        if (modal) {
            setDefaultModal(modal.default_modal);
        }
    }, [modal]);

    useEffect(() => {
        if (ready) {
            checkTeethWidget()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ready])

    const checkTeethWidget = () => {
        setTimeout(() => {
            const adultTeeth = document.getElementById('adultTeeth');
            const childTeeth = document.getElementById('childTeeth');
            if (adultTeeth) {
                const root = ReactDOM.createRoot(adultTeeth);
                root.render(<TeethPreview {...{
                    acts,
                    setActs,
                    t,
                    of: 'adult',
                    previousData,
                    setOpenTeeth,
                    updated,
                    appuuid,
                    local: router.locale
                }}/>)
            }
            if (childTeeth) {
                const root = ReactDOM.createRoot(childTeeth);
                root.render(<TeethPreview {...{
                    acts,
                    setActs,
                    t,
                    of: 'child',
                    previousData,
                    setOpenTeeth,
                    updated,
                    appuuid,
                    local: router.locale
                }}/>)
            }

            const ophtalmo = document.getElementById('opht');
            if (ophtalmo) {
                const root = ReactDOM.createRoot(ophtalmo);
                root.render(<OphtPreview {...{t,printGlasses,appuuid,url,triggerAppointmentEdit,data}}/>)
            }
        }, 1000)
    }
    const handleClickAway = () => {
        setOpen(!open);
    };
    const handleClick = (prop: ModalModel) => {
        modal.default_modal = prop;
        setModal(modal);

        setDefaultModal(prop);

        const form = new FormData();
        form.append("modal_data", JSON.stringify({...JSON.parse(localStorage.getItem(`Modeldata${appuuid}`) as string)}));
        form.append("modal_uuid", modal?.default_modal.uuid);
        triggerAppointmentEdit({
            method: "PUT",
            url,
            data: form
        })

        localStorage.setItem(
            `Model-${appuuid}`,
            JSON.stringify({
                data: {},
                default_modal: prop,
            })
        );
        setOpen(false);
        checkTeethWidget()
    };

    const handleClose = () => {
        setOpenTeeth("");
    };

    useEffect(() => {
        checkTeethWidget()
    }, [updated]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <ConsultationModalStyled
                sx={{
                    //height: {xs: closeMobilePanel ? "50px" : "30vh", md: "40.3rem"},
                    position: "relative",
                    width: closePanel ? 50 : "auto",
                    overflowX: "hidden"
                }}>
                {showToolbar && <Stack
                    spacing={1}
                    p={2}
                    py={1}
                    direction="row"
                    alignItems="center"
                    className="card-header"
                    sx={{
                        position: closePanel ? "absolute" : "static",
                        transform: closePanel ? "rotate(90deg)" : "rotate(0)",
                        transformOrigin: "left",
                        width: closePanel ? "44.5rem" : "auto",
                        left: 23,
                        top: -26,
                    }}
                    bgcolor={alpha(defaultModal?.color, 0.3)}>
                    {expandButton && <IconButton
                        sx={{display: {xs: "none", md: "flex"}}}
                        onClick={() => {
                            setClosePanel(!closePanel);
                            handleClosePanel(!closePanel);
                        }}
                        className="btn-collapse"
                        disableRipple>
                        <ArrowBackIosIcon/>
                    </IconButton>}
                    {expandButton && <IconButton
                        sx={{display: {xs: "flex", md: "none"}}}
                        onClick={() => {
                            setCloseMobilePanel(!closeMobilePanel);
                            handleClosePanel(!closePanel);
                        }}
                        className="btn-collapse-mobile"
                        disableRipple>
                        <KeyboardArrowDownRoundedIcon/>
                    </IconButton>}
                    <Stack
                        spacing={1}
                        direction="row"
                        alignItems="center"
                        width={1}
                        onClick={() => {
                            handleClickAway();
                        }}
                        sx={{cursor: "pointer"}}>
                        <ModelDot color={defaultModal?.color} selected={false}/>
                        <Typography fontWeight={600}>
                            {t('tracking_data')} : {defaultModal?.label}
                        </Typography>
                        {!closePanel && <IconUrl path="ic-flesh-bas-y"/>}
                    </Stack>
                </Stack>}

                <CardContent
                    sx={{
                        bgcolor: alpha(defaultModal?.color, 0.1),
                        overflowX: "scroll",
                        display: closePanel ? "none" : "block",
                    }}>
                    <motion.div
                        hidden={!open}
                        variants={variants}
                        initial="initial"
                        animate={open ? "animate" : "initial"}
                        exit="initial">
                        <Paper className="menu-list">
                            <MenuList>
                                {models?.map((item: any, idx: number) => (
                                    <Box key={"widgt-x-" + idx}>
                                        {item.isEnabled && (
                                            <MenuItem
                                                key={`model-item-${idx}`}
                                                onClick={() => handleClick(item)}>
                                                <ListItemIcon>
                                                    <ModelDot
                                                        color={item.color}
                                                        selected={false}
                                                        size={21}
                                                        sizedot={13}
                                                        padding={3}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    style={{
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                    }}>
                                                    {item.label}
                                                </ListItemText>
                                            </MenuItem>
                                        )}
                                    </Box>
                                ))}
                            </MenuList>
                        </Paper>
                    </motion.div>
                    <Box>
                        {models?.map(
                            (m: any) =>
                                m.uuid === modal.default_modal.uuid && (
                                    <WidgetForm
                                        {...{
                                            appuuid,
                                            changes,
                                            setChanges,
                                            data,
                                            acts,
                                            autoUpdate,
                                            setActs,
                                            previousData,
                                            selectedModel,
                                            trigger: triggerAppointmentEdit,
                                            mutateSheetData,
                                            showToolbar,
                                            url
                                        }}
                                        key={m.uuid}
                                        modal={m.structure}></WidgetForm>
                                )
                        )}
                    </Box>
                </CardContent>
            </ConsultationModalStyled>
            <Dialog
                open={openTeeth !== ""}
                fullWidth
                onClose={handleClose}
                scroll={"paper"}
                maxWidth={"sm"}>
                <DialogTitle style={{
                    marginBottom: 15,
                    borderBottom: "1px solid #eeeff1",
                    color: theme.palette.primary.main
                }}
                             id="draggable-dialog-title">
                    {t('title')}
                    <Typography fontSize={12} style={{color: "rgb(115, 119, 128)"}}>{t('subtitle')}</Typography>
                </DialogTitle>
                <DialogContent style={{overflow: "hidden"}}>
                    <TeethWidget {...{
                        acts,
                        setActs,
                        t,
                        of: openTeeth,
                        previousData,
                        appuuid,
                        local: router.locale
                    }}/>
                </DialogContent>
                <DialogActions style={{borderTop: "1px solid #eeeff1"}}>
                    <Button onClick={() => {
                        setOpenTeeth("")
                        setUpdated(!updated)

                        const form = new FormData();
                        form.append("modal_data",(localStorage.getItem(`Modeldata${appuuid}`) as string));
                        form.append("modal_uuid", selectedModel?.default_modal.uuid);
                        triggerAppointmentEdit({
                            method: "PUT",
                            url,
                            data: form
                        }, {
                            onSuccess: () => mutateSheetData()
                        });
                    }
                    }>{t('save')}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default Widget;
