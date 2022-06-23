import {Box, Typography, useTheme} from "@mui/material";
import {RootStyled} from "@features/loadingScreen";
import { motion } from "framer-motion";
import IconUrl from "@themes/urlIcon";
import {useTranslation} from "next-i18next";
import React from "react";

function LoadingScreen({ ...props }){
    const theme = useTheme();
    const { t, ready } = useTranslation('common');
    if (!ready) return (<>loading translations...</>);

    const Icon = {
        hidden: {
            opacity: 0,
            pathLength: 0,
            fill: "rgba(255, 255, 255, 0)",
        },
        visible: {
            opacity: 1,
            pathLength: 1,
            fill: theme.palette.primary.main,
        },
    };

    const container = {
        hidden: { opacity: 1, scale: 0, repeat: "Infinity", repeatDelay: 0.5 },
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
        hidden: { y: 20, opacity: 0 },
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
                        width: "120px",
                        overflow: "visible",
                        stroke: theme.palette.primary.main,
                        strokeWidth: 0.5,
                        strokeLinejoin: "round",
                        strokeLinecap: "round",
                        mb: 3,
                    }}
                >



                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                         width="54" height="54" viewBox="0 0 192.000000 192.000000"
                         preserveAspectRatio="xMidYMid meet" fill="#0096d6">

                        <g transform="translate(0.000000,192.000000) scale(0.100000,-0.100000)"
                            stroke="none">
                            <path d="M149 1905 c-25 -8 -61 -31 -82 -52 -69 -69 -68 -47 -65 -914 3 -856
0 -810 69 -877 64 -63 53 -62 889 -62 844 0 825 -1 893 66 20 20 42 53 49 73
19 52 19 1589 0 1642 -7 20 -27 51 -45 69 -67 68 -19 65 -882 67 -650 2 -788
0 -826 -12z m398 -865 c23 -85 42 -157 43 -160 1 -3 20 67 43 155 l42 160 78
3 77 3 0 -236 0 -235 -50 0 -50 0 -1 163 -1 162 -41 -163 -42 -163 -54 3 -55
3 -36 145 c-20 80 -39 152 -42 160 -2 8 -4 -57 -4 -145 l1 -160 -50 0 -50 0 0
218 c0 254 -2 250 95 245 l55 -3 42 -155z m1010 130 c15 -30 17 -264 3 -324
-18 -78 -66 -117 -155 -123 -71 -6 -132 27 -163 87 -20 38 -23 56 -19 115 4
82 25 128 70 155 42 26 116 27 148 1 l24 -19 -3 55 c-5 75 0 85 45 81 28 -2
41 -9 50 -28z m-436 -93 c45 -30 69 -80 69 -144 l0 -53 -114 0 -115 0 11 -30
c14 -42 51 -50 99 -22 22 13 55 22 79 22 38 0 41 -2 34 -22 -12 -40 -42 -75
-80 -93 -47 -22 -134 -16 -172 11 -99 73 -95 282 8 336 51 26 138 24 181 -5z"/>
                            <path d="M1343 984 c-21 -33 -21 -115 1 -149 20 -31 67 -34 96 -5 25 25 28
124 4 158 -23 33 -78 30 -101 -4z"/>
                            <path d="M992 1004 c-41 -29 -28 -44 38 -44 60 0 61 0 49 23 -22 40 -50 47
-87 21z"/>
                        </g>
                    </svg>

                </Box>
                <Box
                    display="flex"
                    sx={{
                        ul: { listStyleType: "none", display: "contents", p: 0 },
                        svg: { mx: 0.7 },
                    }}
                >
                    <motion.ul
                        className="container"
                        variants={container}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.li variants={item}>
                            <IconUrl path="color/ic-doctor-gris" />
                        </motion.li>
                        <motion.li variants={item}>
                            <IconUrl path="color/ic-pharmacie-gris" />
                        </motion.li>
                        <motion.li variants={item}>
                            <IconUrl path="color/ic-medicament-gris" />
                        </motion.li>
                        <motion.li variants={item}>
                            <IconUrl path="color/ic-agenda-gris" />
                        </motion.li>
                        <motion.li variants={item}>
                            <IconUrl path="color/ic-question-gris" />
                        </motion.li>
                        <motion.li variants={item}>
                            <IconUrl path="color/ic-magazine-gris" />
                        </motion.li>
                    </motion.ul>
                </Box>
                <Typography variant="body1" mt={3} px={2} color="text.primary">
                    {t('loading')}
                </Typography>
            </Box>
        </RootStyled>
    );
}

export default LoadingScreen;
