import React, { useState } from 'react'
import { Typography, Box, Paper } from "@mui/material";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Icon from '@themes/urlIcon';
import RootStyled from './overrides/accordionStyled';
interface statetype {
    expanded: boolean | any;
}
type Translate = {
    t: Function;
    ready: boolean;
}

function Accordion({ data, badge, translate }: { data: any, badge: any, translate: Translate }) {
    const { t, ready } = translate;
    const [state, setstate] = useState<statetype>({
        expanded: false,
    });

    const handleChange = React.useCallback(
        (panel: Boolean) => (event: any, newExpanded: boolean) => {
            setstate({ ...state, expanded: newExpanded ? panel : false });
        },
        [state]
    );
    if (!ready) return (<>loading translations...</>);

    return (
        data.map((item: any, index: number) => (
            <RootStyled
                disableGutters
                elevation={0}
                square
                expanded={state.expanded === item.heading.title}
                onChange={handleChange(item.heading.title)}
                key={`collapse-${index}`}
            >
                <MuiAccordionSummary
                    expandIcon={
                        <>
                            {badge && (
                                <Box
                                    bgcolor="#FFD400"
                                    sx={{
                                        height: 15,
                                        width: 14,
                                        fontSize: 10,
                                        textAlign: "center",
                                        borderRadius: 2.688,
                                        mr: 1,
                                    }}
                                >
                                    {badge}
                                </Box>
                            )}
                            <Icon path="ic-expand-more" />
                        </>
                    }
                >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Icon path={item.heading.icon} />
                        <Typography
                            variant="body1"
                            sx={{ color: "text.secondary", ml: 1 }}
                        >
                            {t(item.heading.title)}
                        </Typography>
                    </Box>
                </MuiAccordionSummary>
                <MuiAccordionDetails>
                    {item.children}
                </MuiAccordionDetails>
            </RootStyled>
        ))

    );
}

export default Accordion