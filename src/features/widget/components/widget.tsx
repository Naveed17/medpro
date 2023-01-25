import React, {memo, useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {
    Box,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Skeleton,
    Stack,
    Typography,
} from "@mui/material";
import {alpha} from "@mui/material/styles";
import {ModelDot} from "@features/modelDot";
import ConsultationModalStyled from "./overrides/modalConsultationStyle";
import IconUrl from "@themes/urlIcon";
import {motion} from "framer-motion";

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
    const {modal, appuuid, changes, setChanges} = props;
    if (modal) {
        cmp = [...modal];
    }

    /* Previous data
    cmp.map(spec => {
         spec.components.map(composant =>{
             const old = composant.description? composant.description :''
             composant.description = `${old} (90${old})`
         })
     })
     console.log(cmp)*/

    return (
        <>
            <Form
                onChange={(ev: any) => {
                    console.log("model", ev.data);
                    localStorage.setItem("Modeldata" + appuuid, JSON.stringify(ev.data));

                    const item = changes.find((change: { name: string }) => change.name === "patientInfo")
                    item.checked = Object.values(ev.data).filter(val => val !== '').length > 0;
                    setChanges([...changes]);
                }}
                // @ts-ignore
                submission={{data: JSON.parse(localStorage.getItem("Modeldata" + appuuid))}}
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
    const {modal, setModal, models, appuuid, changes, setChanges} = props;
    const [open, setOpen] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [change, setChange] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [value, setValue] = useState<ModalModel>({
        color: "#FEBD15",
        hasData: false,
        isEnabled: true,
        label: "--",
        structure: [],
        uuid: "",
    });

    useEffect(() => {
        if (modal) setValue(modal.default_modal);
        console.log(models);
    }, [modal]);

    const handleClickAway = () => {
        setOpen(!open);
    };
    const handleClick = (prop: ModalModel) => {
        modal.default_modal = prop;
        setModal(modal);
        console.log(modal);
        setValue(prop);
        setOpen(false);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setChange(false);
    };
    const handleChange = () => {
        setChange(true);
    };
    return (
        <>
            <ConsultationModalStyled sx={{height: {xs: '30vh', md: '43.7rem'}}}>
                <Stack
                    spacing={1}
                    p={2}
                    py={1}
                    direction="row"
                    alignItems="center"
                    className="card-header"
                    bgcolor={alpha(value?.color, 0.3)}>
                    <Stack
                        spacing={1}
                        direction="row"
                        alignItems="center"
                        width={1}
                        onClick={() => {
                            handleClickAway();
                        }}
                        sx={{cursor: "pointer"}}>
                        <ModelDot color={value?.color} selected={false}/>
                        <Typography fontWeight={600}>
                            Données de suivi : {value?.label}
                        </Typography>
                        <IconUrl path="ic-flesh-bas-y"/>
                    </Stack>

                </Stack>

                <CardContent sx={{bgcolor: alpha(value?.color, 0.1), overflowX: 'scroll'}}>
                    <motion.div
                        hidden={!open}
                        variants={variants}
                        initial="initial"
                        animate={open ? "animate" : "initial"}
                        exit="initial">
                        <Paper className="menu-list">
                            <MenuList>
                                {models &&
                                    models.map((item: any, idx: number) => (
                                        <>
                                            {item.isEnabled && <MenuItem
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
                                                <ListItemText style={{
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden'
                                                }}>{item.label}</ListItemText>
                                            </MenuItem>}
                                        </>
                                    ))}
                            </MenuList>
                        </Paper>
                    </motion.div>
                    <Box>
                        {models.map(
                            (m: any) =>
                                m.uuid === modal.default_modal.uuid && (
                                    <WidgetForm key={m.uuid} modal={m.structure} appuuid={appuuid} changes={changes}
                                                setChanges={setChanges}></WidgetForm>
                                )
                        )}
                        {pageLoading &&
                            Array.from({length: 3}).map((_, idx) => (
                                <Box key={`loading-box-${idx}`}>
                                    <Typography alignSelf="center" marginBottom={2} marginTop={2}>
                                        <Skeleton width={130} variant="text"/>
                                    </Typography>
                                    <Card className="loading-card">
                                        <Stack spacing={2}>
                                            <List style={{marginTop: 25}}>
                                                {Array.from({length: 4}).map((_, idx) => (
                                                    <ListItem
                                                        key={`skeleton-item-${idx}`}
                                                        sx={{py: 0.5}}>
                                                        <Skeleton width={"40%"} variant="text"/>
                                                        <Skeleton
                                                            sx={{ml: 1}}
                                                            width={"50%"}
                                                            variant="text"
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Stack>
                                    </Card>
                                </Box>
                            ))}
                    </Box>
                </CardContent>
            </ConsultationModalStyled>
            {/* <Dialog action={'consultation-modal'}
                    open={openDialog}
                    data={{data: modalConfig, change}}
                    change={change}
                    max
                    size={"lg"}
                    direction={'ltr'}
                    title={'Personaliser les données de suivi'}
                    dialogClose={handleCloseDialog}
                    actionDialog={
                        <DialogActions>
                            <Button onClick={handleCloseDialog}
                                    startIcon={<CloseIcon/>}>
                                {t('cancel')}
                            </Button>
                            <Button variant="contained"
                                    {...(!change ? {onClick: handleChange} : {onClick: handleCloseDialog})}
                                    startIcon={<IconUrl
                                        path='ic-dowlaodfile'></IconUrl>}>
                                {change ? t('save') : t('apply')}
                            </Button>
                        </DialogActions>
                    }/>*/}
        </>
    );
}

export default React.memo(Widget);
