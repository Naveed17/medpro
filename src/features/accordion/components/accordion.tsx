import React from "react";
import {Box, Typography} from "@mui/material";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Icon from "@themes/urlIcon";
import RootStyled from "./overrides/accordionStyled";
import {upperFirst} from "lodash";
import {LoadingScreen} from "@features/loadingScreen";

function Accordion({...props}) {
    const {
        children,
        data,
        setData,
        badge,
        translate,
    } = props;

    const {t, ready} = translate;

    const handleChange = React.useCallback(
        (panel: number) => (event: any, newExpanded: boolean) => {
            const updatedData = [...data];
            updatedData[panel].expanded = newExpanded;
            setData(updatedData)
        },
        [data, setData]
    );
    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        data.map((item: any, index: number) => (
            <RootStyled
                autoSave={"off"}
                disableGutters
                elevation={0}
                square
                expanded={item.expanded} //state.expanded === item.heading.title
                onChange={handleChange(index)}
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
