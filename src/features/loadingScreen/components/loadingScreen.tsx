import {
    Box,
    Button,
    Stack,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {RootStyled} from "@features/loadingScreen";
import {motion, AnimatePresence} from "framer-motion";
import {useTranslation} from "next-i18next";
import React from "react";
import MedProIcon from "@themes/overrides/icons/MedProIcon";
import {useRouter} from "next/router";
import {PaletteColor} from "@mui/material/styles";
import {clearBrowserCache} from "@lib/hooks";

const icons = [
    "ic-doctor",
    "ic-pharmacie",
    "ic-medicament",
    "ic-agenda",
    "ic-question",
    "ic-magazine",
];

function LoadingScreen({...props}) {
    const {
        text = "loading",
        button = false,
        color = "primary",
        OnClick = null,
    } = props;
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down("sm")
    );
    const {t} = useTranslation("common");

    const container = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.3,
                staggerDirection: 1
            },
        },
    };

    const item = {
        hidden: {opacity: 0.4, filter: "grayscale(100%)"},
        visible: {
            opacity: 1,
            filter: "grayscale(0)",

        },
    };

    return (
        <AnimatePresence mode="popLayout">
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
                        }}>
                        <MedProIcon
                            color={
                                (
                                    theme.palette[
                                        color as keyof typeof theme.palette
                                        ] as PaletteColor
                                ).main
                            }
                        />
                    </Box>

                    {text === "loading" && (
                        <Box>
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="visible">
                                {icons.map((icon, index) => (
                                    <motion.img
                                        key={index}
                                        src={`/static/icons/color/${icon}.svg`}
                                        variants={item}
                                        alt={`Image ${index + 1}`}
                                        style={{
                                            width: "30px",
                                            height: "30px",
                                            marginRight: "12px",

                                        }}
                                    />
                                ))}
                            </motion.div>
                        </Box>
                    )}

                    {text !== "loading" && (
                        <Typography variant="h6" mb={2} px={2} color="text.primary">
                            {t(`${text}.title`)}
                        </Typography>
                    )}
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 300,
                            fontSize: 16,
                        }}
                        {...(text === "loading" && {mt: 3})}
                        mb={2}
                        px={2}
                        color="text.primary">
                        {t(text !== "loading" ? `${text}.description` : text)}
                    </Typography>
                    {(button && text !== "loading") && (
                        <Button
                            onClick={() => {
                                if (process.env.NODE_ENV !== "development") {
                                    clearBrowserCache().then(() => router.reload());
                                    router.replace("/dashboard/agenda");
                                }
                                if (OnClick) {
                                    OnClick(color);
                                }
                            }}
                            {...{color}}
                            variant="contained">
                            <Typography>{t(`${text}.button`)}</Typography>
                        </Button>
                    )}
                </Stack>
            </RootStyled>
        </AnimatePresence>
    );
}

export default LoadingScreen;
