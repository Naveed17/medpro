import {useState, forwardRef, useCallback, useEffect} from "react";
import {useSnackbar, SnackbarContent} from "notistack";
import Card from "@mui/material/Card";
import {Box, Button, CircularProgress, Stack, Typography} from "@mui/material";
import CollapseCardStyled from "./overrides/circularProgressbarCardStyled";
import Icon from "@themes/urlIcon";
import * as React from "react";

const CircularProgressbarCard = forwardRef<HTMLDivElement, any>(
    ({id, ...props}, ref) => {
        const {t} = props;
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

        return (
            <SnackbarContent
                className={"notif-stack-progress"}
                {...(expanded && {style: {flexDirection: "row-reverse"}})}
                ref={ref}>
                <Card>
                    <CollapseCardStyled>
                        <Stack onClick={() => setExpanded(!expanded)} direction={"row"} justifyContent={"center"}
                               alignItems={"center"}>
                            {!expanded && <Button size="small" color="primary">
                                <Icon path="ic-upload"/>
                                {t("file-process-start")}
                            </Button>}
                            <Box className={"container-circular-progress"}>
                                <CircularProgress variant="determinate" value={progress}/>
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
                                </Box>
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
