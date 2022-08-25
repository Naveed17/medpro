import React, {useEffect, useState} from 'react';
import ConsultationModalStyled from './overrides/modalConsultationStyle'
import ClickAwayListener from '@mui/base/ClickAwayListener';
import {
    Stack, Typography, CardContent, Paper, MenuList, MenuItem, ListItemIcon, ListItemText, Button, DialogActions, Box
} from '@mui/material'
import CloseIcon from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import {Dialog} from '@features/dialog';
import {alpha} from '@mui/material/styles'
import Icon from '@themes/urlIcon'
import {useTranslation} from "next-i18next";
import {motion} from 'framer-motion'
import {modalConfig} from './config'
import {ModelDot} from "@features/modelDot";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRequestMutation} from "@app/axios";
import dynamic from "next/dynamic";
import {useAppDispatch} from "@app/redux/hooks";
import {SetEnd, SetFiche} from "@features/toolbar/components/consultationIPToolbar/actions";

const FormBuilder: any = dynamic(() => import("@formio/react").then((mod: any) => mod.Form
), {
    ssr: false,
});
const variants = {
    initial: {opacity: 0},
    animate: {
        opacity: 1
    }
};

function ModalConsultation() {
    const {data: session, status} = useSession();
    const loading = status === 'loading';
    let medical_entity: MedicalEntityModel | null = null;
    const [open, setOpen] = useState(false);
    const [change, setChange] = useState(false);
    const [models, setModels] = useState<ModalModel[]>([]);
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const [openDialog, setOpenDialog] = useState(false);
    const dispatch = useAppDispatch();
    const [value, setValue] = useState<ModalModel>({
        color: "#FEBD15",
        hasData: false,
        isEnabled: true,
        label: "fiche 2",
        structure: [],
        uuid: "8a536913-5593-4f29-a123-46b4f5f2ce37"
    });

    const {trigger} = useRequestMutation(null, "/consultation/", {revalidate: true, populateCache: false});


    useEffect(() => {
        if (medical_entity !== null) {
            trigger({
                method: "GET",
                url: "/api/medical-entity/" + medical_entity.uuid + "/modals/",
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                }
            }, {revalidate: true, populateCache: true}).then(r => {
                if (r) setModels((r.data as HttpResponse).data)
            });
        }
    }, [medical_entity, session?.accessToken, trigger]);


    const handleClickAway = () => {
        setOpen(false);
    };
    const handleClick = (prop: ModalModel) => {
        setValue(prop);
        console.log(prop)
        setOpen(false);
    };
    const handleClickDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setChange(false)
    }
    const handleChange = () => {
        setChange(true)
    }

    if (!ready || loading) return <>loading translations...</>;
    const {data: user} = session as Session;
    medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    return (
        <>
            <ClickAwayListener onClickAway={handleClickAway}>
                <ConsultationModalStyled>
                    <Stack spacing={1} p={2} direction="row" alignItems="center" className="card-header"
                           bgcolor={alpha(value.color, 0.3)}>
                        <Stack onClick={() => setOpen(prev => !prev)} spacing={1} direction="row" alignItems="center"
                               width={1} sx={{cursor: 'pointer'}}>
                            <ModelDot color={value.color} selected={false}/>
                            <Typography fontWeight={500}>
                                Données de suivi : {value.label}
                            </Typography>
                            <Icon path="ic-flesh-bas-y"/>
                        </Stack>
                        <Button onClick={handleClickDialog} className='btn-filter' variant='text-black'>
                            <Icon path="ic-setting"/>
                        </Button>
                    </Stack>
                    <CardContent sx={{
                        bgcolor: alpha(value.color, 0.1)
                    }}>
                        <Box>
                            {value.color !== "#FEBD15" && <FormBuilder
                                onSubmit={(ev:any)=>{dispatch(SetFiche(ev.data))}}
                                onError={console.log}
                                //submission={{ data: {taille:'3',imc:30} }}
                                form={
                                    {
                                        display: "form",
                                        components: value.structure
                                    }
                                }
                            />}


                        </Box>
                        <motion.div
                            hidden={!open}
                            variants={variants}
                            initial="initial"
                            animate={open ? "animate" : 'initial'}
                            exit="initial">
                            <Paper className="menu-list">
                                <MenuList>
                                    {models.map((item, index) => (
                                        <MenuItem key={index} onClick={() => handleClick(item)}>
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
            </ClickAwayListener>
            <Dialog action={'consultation-modal'}
                    open={openDialog}
                    data={{data: modalConfig, change}}
                    change={change}
                    max
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
                    }/>
        </>
    )
}

export default ModalConsultation