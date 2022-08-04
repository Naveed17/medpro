import React, { useEffect } from 'react'
import { Tabs, Tab, Stack, Button } from '@mui/material'
import ConsultationIPToolbarStyled from './overrides/consultationIPToolbarStyle'
import { useTranslation } from 'next-i18next'
import { tabsData } from './config'
import Icon from '@themes/urlIcon'
interface TabProps {
    selected: (value: number) => void
}
function ConsultationIPToolbar({ selected }: { selected: TabProps }) {
    const { t, ready } = useTranslation("consultation", { keyPrefix: "consultationIP" })
    const [value, setValue] = React.useState(tabsData[0].value);
    const [tabs, setTabs] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };
    useEffect(() => {
        selected(tabs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabs])

    if (!ready) return <>loading translations...</>;
    return (
        <ConsultationIPToolbarStyled direction="row" minHeight="inherit" alignItems="flex-end" width={1}>
            <Tabs
                value={value}
                onChange={handleChange}
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
        </ConsultationIPToolbarStyled>
    )
}

export default ConsultationIPToolbar