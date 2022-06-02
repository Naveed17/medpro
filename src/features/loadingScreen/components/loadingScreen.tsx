import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Box, Typography, useTheme} from "@mui/material";
import {RootStyled} from "@features/loadingScreen";
import { motion } from "framer-motion";
import IconUrl from "@themes/urlIcon";

function LoadingScreen({ ...props }){
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
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

    useEffect(() => {
        const handleStart = () => setLoading(true);

        const handleComplete = () => setLoading(false);

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleComplete);
        router.events.on("routeChangeError", handleComplete);

        return () => {
            router.events.off("routeChangeStart", handleStart);
            router.events.off("routeChangeComplete", handleComplete);
            router.events.off("routeChangeError", handleComplete);
        };
    });
    const container = {
        hidden: { opacity: 1, scale: 0, repeat: Infinity, repeatDelay: 0.5 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.5,
            },
            repeat: Infinity,
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

    if (loading) {
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
                        <motion.path
                            d="M43.2264 0H9.77362C4.3758 0 0 4.3758 0 9.77362V43.2264C0 48.6242 4.3758 53 9.77362 53H43.2264C48.6242 53 53 48.6242 53 43.2264V9.77362C53 4.3758 48.6242 0 43.2264 0Z"
                            fill="#0096D6"
                            variants={Icon}
                            initial="hidden"
                            animate="visible"
                            transition={{
                                default: {
                                    duration: 1,
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                    repeatDelay: 0.5,
                                },
                                fill: {
                                    duration: 1,
                                    ease: [1, 0, 0.8, 1],
                                    repeat: Infinity,
                                    repeatDelay: 0.5,
                                },
                            }}
                        />

                        <path
                            d="M14.0157 28.4205C12.9612 24.6088 11.8712 20.8325 10.8179 17.0236C9.69421 17.0774 8.61462 16.9498 7.5491 17.0236C7.26722 17.0444 6.99584 17.1328 6.76124 17.2803C6.52663 17.4279 6.33676 17.6296 6.21001 17.8659C5.94684 18.3373 6.0056 19.0193 6.0056 19.7197V32H9.08097C9.09015 27.9874 9.062 23.9405 9.09444 19.9485C10.163 23.9748 11.2597 27.9766 12.3326 32H15.6681C16.7477 27.9743 17.8328 23.9571 18.9234 19.9485V32H22V17.0236H17.1455C16.0977 20.8176 15.0781 24.6391 14.0157 28.4205Z"
                            fill="white"
                        />
                        <path
                            d="M46.7006 17.5923C46.5818 17.4311 46.4287 17.2968 46.2518 17.1986C46.0748 17.1003 45.8781 17.0404 45.6752 17.023C45.1886 16.9664 44.6514 17.0354 44.0777 17.0105C44.0631 17.0105 44.0631 17.0303 44.0655 17.0484V21.9016C43.6266 21.2599 43.1138 20.7477 42.3645 20.4348C41.6088 20.1185 40.5438 20.0528 39.5863 20.2577C37.8714 20.6249 36.8401 21.729 36.353 23.3701C35.874 24.9824 35.874 27.366 36.4053 28.8685C36.9517 30.4123 38.1086 31.4286 39.8206 31.8112C41.7279 32.2373 43.9044 31.9153 45.1165 31.1151C46.4065 30.2623 47 28.7791 47 26.6914V18.8678C47 18.3251 46.9477 17.9165 46.7006 17.5923ZM41.664 29.5329C39.6253 29.6262 39.1317 28.1073 39.041 26.2342C38.9992 25.361 39.2474 24.3848 39.5607 23.8206C39.7235 23.5058 39.97 23.2392 40.2746 23.0487C40.5984 22.8478 40.9774 22.7448 41.4553 22.7205C43.3952 22.6198 44.0178 24.2167 44.0655 26.0322C44.1154 27.9161 43.4423 29.4531 41.664 29.5329Z"
                            fill="white"
                        />
                        <path
                            d="M28.1375 21.0097C25.5601 21.1138 24.0355 22.1914 23.3783 23.9744C23.0508 24.8677 22.9389 26.0249 23.0311 27.1593C23.2107 29.378 24.1528 30.8913 26.0653 31.5894C27.0326 31.9418 28.3171 32.0959 29.5968 31.9382C31.951 31.6493 33.2374 30.4285 33.794 28.5201C33.0919 28.5721 32.0582 28.4539 31.3471 28.5201C30.8227 28.569 30.5815 28.8704 30.2643 29.0901C29.6771 29.4977 28.784 29.8189 27.7796 29.5664C26.662 29.2895 26.2454 28.4212 26.1479 27.2181H33.9802C34.1981 23.3466 32.6418 20.8233 28.1375 21.0097ZM26.1856 25.3117C26.4005 24.1488 26.9338 23.2508 28.3776 23.1831C29.95 23.1107 30.5923 24.079 30.7437 25.3117H26.1856Z"
                            fill="white"
                        />
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
                        Veuillez patienter un instant le temps de chargement
                    </Typography>
                </Box>
            </RootStyled>
        );
    }
    return null;
}

export default LoadingScreen;
