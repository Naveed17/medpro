import * as React from "react";
//material ui
import {Box, Typography, CardContent} from "@mui/material";
import {useTheme} from "@mui/material/styles";
//utils
import Icon from "@themes/urlIcon";
//component style
import TabsStyled from "./overrides/tabsStyle";
import {useEffect} from "react";

export default function SettingsTabs({...props}) {
    const {data, getIndex, initIndex = null, t, OnSelectTab = null} = props;
    const theme = useTheme();

    const [state, setstate] = React.useState({
        tabIndex: initIndex,
    });

    const handleClick = (props: number) => {
        setstate((pre: any) => ({...pre, tabIndex: props}));
        OnSelectTab && OnSelectTab(props);
    };

    useEffect(() => {
        getIndex((pre: any) => ({...pre, activeTab: state.tabIndex}));
    }, [getIndex, state.tabIndex]);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                m: -1,
                flexWrap: {lg: "nowrap", xs: "wrap"}
            }}>
            {data?.map((item: any, index: number) => (
                <Box
                    sx={{maxWidth: "33%", width: "100%", p: 1}}
                    key={`tab-${index}`}>
                    <TabsStyled
                        className={`${item.variant ? item.variant : ""} ${typeof item.icon !== "string" ? "img-background" : ""} ${state.tabIndex === index ? 'active' : ''}`}
                        onClick={() => handleClick(index)}
                        sx={{
                            backgroundColor:
                                state.tabIndex === index ? theme.palette.primary.main : "",
                            transition: "background-color 0.3s ease-in-out",
                        }}>
                        <CardContent
                            sx={{
                                display: "flex",
                                pl: item.icon === "ic-hosipital-bed" ? 1 : 0,
                            }}>
                            {typeof item.icon === "string" ? <Icon path={item.icon}/> : item.icon}
                            <Box sx={{ml: 3}}>
                                <Typography
                                    variant="body1"
                                    color={
                                        state.tabIndex === index ? "common.white" : "common.black"
                                    }
                                    sx={{
                                        fontFamily: "Poppins-SemiBold",
                                        mb: 1,
                                        mt: "6px",
                                    }}>
                                    {t(item.label)}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{mb: 26, display: "block"}}
                                    color={
                                        state.tabIndex === index ? "common.white" : "text.secondary"
                                    }>
                                    {t(item.content)}
                                </Typography>
                            </Box>
                        </CardContent>
                    </TabsStyled>
                </Box>
            ))}
        </Box>
    );
}
