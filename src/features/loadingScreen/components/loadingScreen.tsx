import {Box, Button, Theme, Typography, useMediaQuery, useTheme} from "@mui/material";
import {RootStyled} from "@features/loadingScreen";
import {motion} from "framer-motion";
import IconUrl from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import React from "react";
import MedProIcon from "@themes/overrides/icons/MedProIcon";
import {useRouter} from "next/router";

function LoadingScreen({...props}) {
    const {text = "loading", iconNote = null, button = null, error = false, OnClick = null} = props

    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
    const {t, ready} = useTranslation('common');
    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    const container = {
        hidden: {opacity: 1, scale: 0, repeat: "Infinity", repeatDelay: 0.5},
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.5,
            },
            repeat: "Infinity",
            repeatDelay: 0.5,
        },
    };

    const item = {
        hidden: {y: 20, opacity: 0},
        visible: {
            y: 0,
            opacity: 1,
        },
    };


    return (
        <RootStyled {...props} className="test">
            <Box textAlign="center" maxWidth={240}>
                <Box
                    component={motion.svg}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 54 54"
                    className="item"
                    sx={{
                        width: isMobile ? 80 : 120,
                        overflow: "visible",
                        // stroke: theme.palette.primary.main,
                        strokeWidth: 0.5,
                        strokeLinejoin: "round",
                        strokeLinecap: "round",
                        mb: 3,
                    }}
                >
                    <MedProIcon color={error ? theme.palette.error.main : theme.palette.primary.main}/>
                </Box>
                <Box
                    display="flex"
                    sx={{
                        ul: {listStyleType: "none", display: "contents", p: 0},
                        svg: {mx: 0.7},
                    }}
                >
                    <motion.ul
                        className="container"
                        variants={container}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.li variants={item}>
                            <IconUrl path="color/ic-doctor-gris"/>
                        </motion.li>
                        <motion.li variants={item}>
                            <IconUrl path="color/ic-pharmacie-gris"/>
                        </motion.li>
                        <motion.li variants={item}>
                            <IconUrl path="color/ic-medicament-gris"/>
                        </motion.li>
                        <motion.li variants={item}>
                            <IconUrl path="color/ic-agenda-gris"/>
                        </motion.li>
                        <motion.li variants={item}>
                            <IconUrl path="color/ic-question-gris"/>
                        </motion.li>
                        <motion.li variants={item}>
                            <IconUrl path="color/ic-magazine-gris"/>
                        </motion.li>
                    </motion.ul>
                </Box>
                <Typography variant="body1" mt={3} mb={2} px={2} color="text.primary">
                    {t(text)}
                </Typography>
                {button &&
                    <Button onClick={() => {
                        // router.push("/dashboard/agenda");
                        if (OnClick) {
                            OnClick(error);
                        }
                    }}
                            color={error ? "error" : "primary"} variant="contained">
                        <Typography>{t(button)}</Typography>
                    </Button>}
            </Box>
        </RootStyled>
    );
}

export default LoadingScreen;
