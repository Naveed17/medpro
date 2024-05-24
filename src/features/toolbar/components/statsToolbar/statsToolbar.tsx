import {a11yProps} from "@lib/hooks";
import {Tab, Tabs} from "@mui/material";
import {useTranslation} from "next-i18next";

const tabsData = ["tab_all", "tab_rdv", "tab_patients", "tab_working_time", "consultation_reasons"]

function StatsToolbar({...props}) {
    const {value, handleChange} = props;

    const {t} = useTranslation("stats", {keyPrefix: "sub-header"});

    return (
        <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            aria-label="basic tabs example"
            sx={{mt: 1.5}}>
            {tabsData.map((title: string, index: number) => (
                <Tab
                    key={`tabHeader-${index}`}
                    disableRipple
                    sx={{
                        "&.MuiTab-root": {color: 'text.secondary'},
                        '&.Mui-selected': {
                            "&.Mui-selected": {color: 'primary.main'}
                        }
                    }}
                    label={t(`tabs.${title}`)}

                    {...a11yProps(index)}

                />)
            )}
        </Tabs>
    )
}

export default StatsToolbar
