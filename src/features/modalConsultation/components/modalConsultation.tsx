import { useState } from 'react';
import ConsultationModalStyled from './overrides/modalConsultationStyle'
import ClickAwayListener from '@mui/base/ClickAwayListener';
import {
    Stack, Box, Typography, CardContent, Paper, MenuList, MenuItem, ListItemIcon, ListItemText, Button, DialogActions
} from '@mui/material'
import CloseIcon from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";
import { Dialog } from '@features/dialog';
import CircleIcon from '@mui/icons-material/Circle';
import { alpha } from '@mui/material/styles'
import Icon from '@themes/urlIcon'
import { useTranslation } from "next-i18next";
import { motion } from 'framer-motion'
import { data, modalConfig } from './config'
const variants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,

    }
};
function ModalConsultation() {
    const [open, setOpen] = useState(false);
    const [change, setChange] = useState(false);
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })
    const [openDialog, setOpenDialog] = useState(false);
    const [value, setValue] = useState({
        label: data[0].label,
        color: data[0].color
    });
    const handleClickAway = () => {
        setOpen(false);
    };
    const handleClick = (prop: { label: string, color: string }) => {
        setValue(prop);
        setOpen(false)
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
    if (!ready) return <>loading translations...</>;
    return (
        <>
            <ClickAwayListener onClickAway={handleClickAway}>
                <ConsultationModalStyled>
                    <Stack spacing={1} p={2} direction="row" alignItems="center" className="card-header" bgcolor={alpha(value.color, 0.4)}>
                        <Stack onClick={() => setOpen(prev => !prev)} spacing={1} direction="row" alignItems="center" width={1} sx={{ cursor: 'pointer' }}>
                            <Box className='icon-wrapper'><CircleIcon sx={{ color: value.color }} /></Box>
                            <Typography fontWeight={500}>
                                Données de suivi : {value.label}
                            </Typography>
                            <Icon path="ic-flesh-bas-y" />
                        </Stack>
                        <Button onClick={handleClickDialog} className='btn-filter' variant='text-black'>
                            <Icon path="ic-setting" />
                        </Button>
                    </Stack>
                    <CardContent sx={{
                        bgcolor: alpha(value.color, 0.1)
                    }}>
                        <motion.div
                            hidden={!open}
                            variants={variants}
                            initial="initial"
                            animate={open ? "animate" : 'initial'}
                            exit="initial"
                        >
                            <Paper className="menu-list">
                                <MenuList>
                                    {data.map((item, index) => (
                                        <MenuItem key={index} onClick={() => handleClick(item)}>
                                            <ListItemIcon>
                                                <CircleIcon sx={{ color: item.color }} />
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
                data={{ data: modalConfig, change }}
                change={change}
                max
                direction={'ltr'}
                title={'Personaliser les données de suivi'}
                dialogClose={handleCloseDialog}
                actionDialog={
                    <DialogActions>
                        <Button onClick={handleCloseDialog}
                            startIcon={<CloseIcon />}>
                            {t('cancel')}
                        </Button>
                        <Button variant="contained"
                            {...(!change ? { onClick: handleChange } : { onClick: handleCloseDialog })}

                            startIcon={<IconUrl
                                path='ic-dowlaodfile'></IconUrl>}>
                            {change ? t('save') : t('apply')}

                        </Button>
                    </DialogActions>
                } />
        </>
    )
}

export default ModalConsultation