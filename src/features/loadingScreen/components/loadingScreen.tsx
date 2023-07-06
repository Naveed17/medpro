import {Box, Button, Stack, Theme, Typography, useMediaQuery, useTheme} from "@mui/material";
import {RootStyled} from "@features/loadingScreen";
import {motion} from "framer-motion";
import IconUrl from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import React from "react";
import MedProIcon from "@themes/overrides/icons/MedProIcon";
import {useRouter} from "next/router";
import {PaletteColor} from "@mui/material/styles";
import {clearBrowserCache} from "@lib/hooks";

function LoadingScreen({...props}) {
    const {text = "loading", button = false, color = "primary", OnClick = null} = props

    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));

    const {t} = useTranslation('common');

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
        <RootStyled {...props}>
            <Stack alignItems={"center"} maxWidth={280}>
                <Box
                    component={motion.svg}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    sx={{
                        width: isMobile ? 80 : 120,
                        overflow: "visible",
                        strokeWidth: 0.5,
                        strokeLinejoin: "round",
                        strokeLinecap: "round",
                        mb: 3,
                    }}
                >
                    <MedProIcon color={(theme.palette[color as keyof typeof theme.palette] as PaletteColor).main}/>
                </Box>
                {text === "loading" && <Box
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
                </Box>}
                {text !== "loading" && <Typography
                    variant="h6" mb={2} px={2} color="text.primary">
                    {t(`${text}.title`)}
                </Typography>}
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 300,
                        fontSize: 16
                    }}
                    {...(text === "loading" && {mt: 3})}
                    mb={2} px={2} color="text.primary">
                    {t(text !== "loading" ? `${text}.description` : text)}
                </Typography>
                {button &&
                    <Button
                        onClick={() => {
                            clearBrowserCache();
                            if (process.env.NODE_ENV !== 'development') {
                                router.replace("/dashboard/agenda");
                            }
                            if (OnClick) {
                                OnClick(color);
                            }
                        }}
                        {...{color}}
                        variant="contained">
                        <Typography>{t(`${text}.button`)}</Typography>
                    </Button>}
            </Stack>
        </RootStyled>
    )
        ;
}

export default LoadingScreen;
