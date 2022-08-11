import React, { useEffect } from 'react'
import { Tabs, Tab, Stack, Button, MenuItem, DialogActions } from '@mui/material'
import ConsultationIPToolbarStyled from './overrides/consultationIPToolbarStyle'
import StyledMenu from './overrides/menuStyle'
import { useTranslation } from 'next-i18next'
import { tabsData, documentButtonList } from './config'
import { Dialog } from '@features/dialog';
import CloseIcon from "@mui/icons-material/Close";
import Icon from '@themes/urlIcon'
interface TabProps {
    selected: (value: number) => void
}
function ConsultationIPToolbar({ selected }: { selected: TabProps }) {
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [value, setValue] = React.useState(tabsData[0].value);
    const [info, setInfo] = React.useState('');
    const [tabs, setTabs] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (action: string) => {
        console.log(action)
        switch (action) {
            case "draw_up_an_order":
                setInfo('')
                break;
            case "assurance":
                setInfo(action)
                break;
            case "mode":
                setInfo(action)
                break;
            case "langues":
                setInfo(action)
                break;
            default:
                break;

        };
        setAnchorEl(null);


    };
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    const handleClickDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    }
    useEffect(() => {
        selected(tabs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabs])

    if (!ready) return <>loading translations...</>;
    return (
        <>
            <ConsultationIPToolbarStyled minHeight="inherit" width={1}>
                <Stack direction="row" spacing={1} mt={1.2} justifyContent="flex-end">
                    <Button variant="contained">
                        {t("RDV")}
                    </Button>
                    <Button variant="contained">
                        {t("vaccine")}
                    </Button>
                    <Button variant="contained">
                        {t("report")}
                    </Button>
                    <Button onClick={handleClick} variant="contained" color="warning">
                        {t('document')}
                    </Button>
                    <StyledMenu
                        id="basic-menu"
                        elevation={0}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {documentButtonList.map((item, index) => (
                            <MenuItem key={`document-button-list-${index}`} onClick={() => handleClose(item.label)}>
                                <Icon path={item.icon} />
                                {t(item.label)}
                            </MenuItem>
                        ))}
                    </StyledMenu>
                </Stack>
                <Stack direction='row' minHeight="inherit" alignItems="flex-end" width={1}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        textColor="primary"
                        indicatorColor="primary"
                        aria-label="patient_history">
                        {tabsData.map(({ label, value }, index) => (
                            <Tab onFocus={() => setTabs(index)} className='custom-tab' key={label} value={value} label={t(label)} />
                        ))}
                    </Tabs>
                    <Button variant="outlined" color="primary" className="action-button">
                        <Icon path="ic-check" />
                        {t("end_of_consultation")}
                    </Button>
                </Stack>
            </ConsultationIPToolbarStyled>
            <Dialog action={info}
                open={openDialog}
                data={null}
                change={false}
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
                            onClick={handleCloseDialog}

                            startIcon={<Icon
                                path='ic-dowlaodfile' />}>
                            fasdf
                        </Button>
                    </DialogActions>
                } />
        </>
    )
}

export default ConsultationIPToolbar