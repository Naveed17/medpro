import React, { useEffect, useState } from 'react'
import { Tabs, Tab, Stack, Button, MenuItem, DialogActions } from '@mui/material'
import ConsultationIPToolbarStyled from './overrides/consultationIPToolbarStyle'
import StyledMenu from './overrides/menuStyle'
import { useTranslation } from 'next-i18next'
import { tabsData, documentButtonList } from './config'
import { Dialog } from '@features/dialog';
import CloseIcon from "@mui/icons-material/Close";
import Icon from '@themes/urlIcon'
import { useAppDispatch } from "@app/redux/hooks";
import { SetEnd } from "@features/toolbar/components/consultationIPToolbar/actions";
function ConsultationIPToolbar({ selected }: any) {
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [value, setValue] = useState(tabsData[0].value);
    const [info, setInfo] = useState<null | string>('');
    const [action, setactions] = useState<boolean>(false);
    const [tabs, setTabs] = useState(0);
    const [dialogData, setDialogData] = useState<any>(null)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const dispatch = useAppDispatch();


    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (action: string) => {
        switch (action) {
            case "draw_up_an_order":
                setInfo('medical_prescription')
                break;
            case "balance_sheet_request":
                setInfo('balance_sheet_request')
                break;
            case "upload_document":
                setInfo('add_a_document')
                break;
            default:
                setInfo(null)
                break;

        }
        setAnchorEl(null);
        handleClickDialog();
        setactions(true)

    };
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    const handleClickDialog = () => {
        setOpenDialog(true);

    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setInfo(null)
    }
    useEffect(() => {
        selected(tabs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabs]);
    if (!ready) return <>loading translations...</>;
    return (
        <>
            <ConsultationIPToolbarStyled minHeight="inherit" width={1}>
                <Stack direction="row" spacing={1} mt={1.2} justifyContent="flex-end">
                    <Button variant="contained"
                        onClick={() => {
                            setInfo("document_detail");
                            handleClickDialog();
                            setactions(false)
                        }
                        }
                    >
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
                            <Tab onFocus={() => setTabs(index)} className='custom-tab' key={label} value={value}
                                label={t(label)} />
                        ))}
                    </Tabs>
                    <Button variant="outlined" color="primary" onClick={() => {
                        const btn = document.getElementsByClassName('sub-btn')[1];
                        (btn as HTMLElement)?.click();
                        dispatch(SetEnd(true))
                    }} className="action-button">
                        <Icon path="ic-check" />
                        {t("end_of_consultation")}
                    </Button>
                </Stack>
            </ConsultationIPToolbarStyled>
            {
                info &&
                <Dialog action={info}
                    open={openDialog}
                    data={dialogData}
                    size={"lg"}
                    direction={'ltr'}
                    sx={{ p: 0 }}
                    title={t(info === "document_detail" ? "doc_detail_title" : info)}
                    {
                    ...(info === "document_detail" && {
                        onClose: handleCloseDialog
                    })
                    }
                    dialogClose={handleCloseDialog}
                    actionDialog={
                        action ? <DialogActions>
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
                            : null

                    } />
            }

        </>
    )
}

export default ConsultationIPToolbar
