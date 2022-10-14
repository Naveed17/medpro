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
    Typography
} from "@mui/material";
import {alpha} from "@mui/material/styles";
import {ModelDot} from "@features/modelDot";
import ConsultationModalStyled from './overrides/modalConsultationStyle'
import {useTranslation} from "next-i18next";
import IconUrl from "@themes/urlIcon";
import {motion} from "framer-motion";

const Form: any = dynamic(() => import("@formio/react").then((mod: any) => mod.Form
), {
    ssr: false,
});
const variants = {
    initial: {opacity: 0},
    animate: {
        opacity: 1
    }
};

const WidgetForm: any = memo(({src, ...props}: any) => {

    let cmp: any[] = [];
    const {modal} = props
    if (modal) {
        cmp = [...modal]
    }

    return (
        <>
            <Form
                onChange={(ev: any) => {
                    console.log('changes detected', ev.data)
                    localStorage.setItem('Modeldata', JSON.stringify(ev.data))
                }}
                // @ts-ignore
                submission={{data: JSON.parse(localStorage.getItem('Modeldata'))}}
                form={
                    {
                        display: "form",
                        components: cmp
                    }
                }
            />

        </>
    )
})
WidgetForm.displayName = "widget-form";

function Widget({...props}) {

    const {modal, setModal, models} = props
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
        uuid: ""
    });

    useEffect(() => {
        if (modal)
            setValue(modal.default_modal);
    }, [modal])

    const handleClickAway = () => {
        setOpen(!open);
    };
    const handleClick = (prop: ModalModel) => {
        modal.default_modal = prop
        setModal(modal)
        console.log(modal)
        setValue(prop);
        setOpen(false);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setChange(false)
    }
    const handleChange = () => {
        setChange(true)
    }
    return (
        <>
            <ConsultationModalStyled>
                <Stack spacing={1} p={2} direction="row" alignItems="center" className="card-header"
                       bgcolor={alpha(value?.color, 0.3)}>
                    <Stack spacing={1}
                           direction="row"
                           alignItems="center"
                           width={1}
                           onClick={() => {
                               handleClickAway()
                           }}
                           sx={{cursor: 'pointer'}}>
                        <ModelDot color={value?.color} selected={false}/>
                        <Typography fontWeight={600}>
                            Données de suivi : {value?.label}
                        </Typography>
                        <IconUrl path="ic-flesh-bas-y"/>
                    </Stack>
                </Stack>
                <CardContent sx={{bgcolor: alpha(value?.color, 0.1)}}>
                    <Box>

                        {
                            models.map((m: any) => (
                                m.uuid === modal.default_modal.uuid && <WidgetForm key={m.uuid} modal={m.structure}></WidgetForm>
                            ))
                        }
                        {
                            pageLoading &&
                            Array.from({length: 3}).map((_, idx) =>
                                <Box key={`loading-box-${idx}`}>
                                    <Typography alignSelf="center" marginBottom={2} marginTop={2}>
                                        <Skeleton width={130} variant="text"/>
                                    </Typography>
                                    <Card className='loading-card'>
                                        <Stack spacing={2}>
                                            <List style={{marginTop: 25}}>
                                                {
                                                    Array.from({length: 4}).map((_, idx) =>
                                                        <ListItem key={`skeleton-item-${idx}`} sx={{py: .5}}>
                                                            <Skeleton width={'40%'} variant="text"/>
                                                            <Skeleton sx={{ml: 1}} width={'50%'} variant="text"/>
                                                        </ListItem>
                                                    )
                                                }

                                            </List>
                                        </Stack>
                                    </Card>
                                </Box>)
                        }
                    </Box>
                    <motion.div
                        hidden={!open}
                        variants={variants}
                        initial="initial"
                        animate={open ? "animate" : 'initial'}
                        exit="initial">
                        <Paper className="menu-list">
                            <MenuList>
                                {models && models.map((item: any, idx: number) => (
                                    <MenuItem key={`model-item-${idx}`} onClick={() => handleClick(item)}>
                                        <ListItemIcon>
                                            <ModelDot color={item.color} selected={false} size={21} sizedot={13}
                                                      padding={3}/>
                                        </ListItemIcon>
                                        <ListItemText>{item.label}</ListItemText>
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Paper>
                    </motion.div>
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