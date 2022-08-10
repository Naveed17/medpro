import React, { useEffect } from 'react'
import { Tabs, Tab, Stack, Button, Menu, MenuItem } from '@mui/material'
import ConsultationIPToolbarStyled from './overrides/consultationIPToolbarStyle'
import StyledMenu from './overrides/menuStyle'
import { useTranslation } from 'next-i18next'
import { tabsData, documentButtonList } from './config'
import Icon from '@themes/urlIcon'
interface TabProps {
    selected: (value: number) => void
}
function ConsultationIPToolbar({ selected }: { selected: TabProps }) {
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })
    const [value, setValue] = React.useState(tabsData[0].value);
    const [tabs, setTabs] = React.useState(0);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    useEffect(() => {
        selected(tabs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabs])

    if (!ready) return <>loading translations...</>;
    return (
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
                        <MenuItem key={`document-button-list-${index}`} onClick={handleClose}>
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
    )
}

export default ConsultationIPToolbar