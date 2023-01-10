import React, {useEffect, useState} from "react";
import {Box, Typography} from "@mui/material";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Icon from "@themes/urlIcon";
import RootStyled from "./overrides/accordionStyled";
import {upperFirst} from "lodash";
import {LoadingScreen} from "@features/loadingScreen";

interface statetype {
    expanded: boolean | any;
}


function Accordion({...props}) {
    const {
        children,
        data,
        badge,
        translate,
        defaultValue,
    } = props;

    const {t, ready} = translate;
    const [state, setstate] = useState<statetype>({
        expanded: defaultValue,
    });

    useEffect(() => {
        setstate({...state, expanded: defaultValue});
    }, [defaultValue]);// eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = React.useCallback(
        (panel: Boolean) => (event: any, newExpanded: boolean) => {
            setstate({...state, expanded: newExpanded ? panel : ""});
        },
        [state]
    );
    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

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
                                    bgcolor={theme => theme.palette.warning.main}
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
                            <Icon path="ic-expand-more"/>
                        </>
                    }
                >
                    <Box sx={{display: "flex", alignItems: "center"}}>
                        <Icon path={item.heading.icon}/>
                        <Typography
                            variant="body1"
                            sx={{color: "text.secondary", ml: 1}}
                        >
                            {upperFirst(t(item.heading.title))}
                        </Typography>
                    </Box>
                </MuiAccordionSummary>
                <MuiAccordionDetails>
                    {item.children || children}
                </MuiAccordionDetails>
            </RootStyled>
        ))
    );
}

export default Accordion;
