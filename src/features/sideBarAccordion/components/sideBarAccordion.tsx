import {BoxStyled} from "@features/sideBarAccordion";
import { rightActionData } from './config'
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import {Fragment, useState} from "react";
import IconUrl from "@themes/urlIcon";
import {Box, Checkbox, FormControlLabel, Typography, useTheme} from "@mui/material";
import {pxToRem} from "@themes/formatFontSize";
import {useTranslation} from "next-i18next";

function SideBarAccordion(){
    const theme = useTheme();
    const { collapse } = rightActionData;
    const [state, setstate] = useState({
        expanded: false
    });

    const { t, ready } = useTranslation('agenda');
    if (!ready) return (<>loading translations...</>);

    const handleChange = (panel: any) => (event: any, newExpanded: any) => {
        setstate({ ...state, expanded: newExpanded ? panel : false });
    };

    return(
        <BoxStyled>
            { collapse.map((item: any, i) =>
                <MuiAccordion elevation={0}
                              square
                              expanded={state.expanded === item.heading.title}
                              onChange={handleChange(item.heading.title)}
                              key={`collapse-${i}`}>
                    <MuiAccordionSummary
                        expandIcon={<IconUrl path="ic-expand-more" />}
                        id={''}>
                        <Box sx={{ display: 'flex', alignItems: 'center', '& .react-svg svg': { width: '14px', height: '14px' } }}>
                            <IconUrl path={item.heading.icon} />
                            <Typography  variant="body1" sx={{ color: 'text.secondary', ml: 1 }}>{t(item.heading.title)}</Typography>
                        </Box>
                    </MuiAccordionSummary>
                    <MuiAccordionDetails sx={{ pl: `${pxToRem(32)} !important`, pt: '0 !important', pr: '8px !important' }}>
                        <Fragment>
                            {item.data.map((res: any, resInd: any) =>
                                <Box key={`resourse-${resInd}`} sx={{ display: 'inline-flex', flexDirection: 'column', mt: resInd > 0 ? 1.5 : 0 }}>
                                    {res.list.map((re: any, ind: any) => (
                                        <FormControlLabel key={`resourse-list-${ind}`} control={<Checkbox />} label={re} />
                                    ))}
                                </Box>
                            )}
                        </Fragment>
                    </MuiAccordionDetails>
                </MuiAccordion>
            )}
        </BoxStyled>)
}

export default SideBarAccordion;
