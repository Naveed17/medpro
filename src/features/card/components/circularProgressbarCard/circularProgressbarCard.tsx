import {useState, forwardRef, useCallback, useEffect} from "react";
import {useSnackbar, SnackbarContent} from "notistack";
import Card from "@mui/material/Card";
import {Box, Button, Stack} from "@mui/material";
import CollapseCardStyled from "./overrides/circularProgressbarCardStyled";
import * as React from "react";
import {FacebookCircularProgress} from "@features/progressUI";
import {useTranslation} from "next-i18next";
import {LoadingScreen} from "@features/loadingScreen";

const CircularProgressbarCard = forwardRef<HTMLDivElement, any>(
    ({id, ...props}, ref) => {
        const {t, ready} = useTranslation("common");
        const [progress, setProgress] = useState(10);

        useEffect(() => {
            const timer = setInterval(() => {
                setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + 10));
            }, 800);
            return () => {
                clearInterval(timer);
            };
        }, []);

        const {closeSnackbar} = useSnackbar();
        const [expanded, setExpanded] = useState(false);

        const handleExpandClick = useCallback(() => {
            setExpanded((oldExpanded) => !oldExpanded);
        }, []);

        const handleDismiss = useCallback(() => {
            closeSnackbar(id);
        }, [id, closeSnackbar]);

        if (!ready) return (<LoadingScreen  button text={"loading-error"}/>);

        return (
            <SnackbarContent
                className={"notif-stack-progress"}
                {...(expanded && {style: {flexDirection: "row-reverse"}})}
                ref={ref}>
                <Card sx={{
                    "& .MuiPaper-root": {
                        backgroundColor: (theme) => theme.palette.background.paper
                    }
                }}>
                    <CollapseCardStyled>
                        <Stack onClick={() => setExpanded(!expanded)} direction={"row"} justifyContent={"center"}
                               alignItems={"center"}>
                            {!expanded && <Button size="small" color="primary">
                                {t("file-process-start")}
                            </Button>}
                            <Box className={"container-circular-progress"}>
                                <FacebookCircularProgress/>
                                {/*<CircularProgress variant="determinate" value={progress}/>
                                <Box
                                    sx={{
                                        top: 0,
                                        left: 0,
                                        bottom: 0,
                                        right: 0,
                                        position: 'absolute',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        component="div"
                                        color="text.secondary"
                                    >{`${Math.round(progress)}%`}</Typography>
                                </Box>*/}
                            </Box>
                        </Stack>
                    </CollapseCardStyled>
                </Card>
            </SnackbarContent>
        );
    }
);

CircularProgressbarCard.displayName = "circularProgressbarCard";

export default CircularProgressbarCard;
