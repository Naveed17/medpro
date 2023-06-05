import {useEffect, useRef, useState} from "react";
import {Button, Fade, Stack, Typography, TextField} from '@mui/material'
import {Player} from '@lottiefiles/react-lottie-player';
import AppLookStyled from "./overrides/appLookStyled";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {appLockSelector} from "@features/appLock/selectors";
import {setLock} from "@features/appLock/actions";
import {useTranslation} from "next-i18next";
import {LoadingScreen} from "@features/loadingScreen";


function AppLock() {
    const dispatch = useAppDispatch();

    const {t, ready} = useTranslation('common', {keyPrefix: "appLock"});

    const {lock} = useAppSelector(appLockSelector);

    const [value, setValue] = useState('');

    const reactLottieRef = useRef(null);

    useEffect(() => {
        if (value === localStorage.getItem("app_lock")) {
            (reactLottieRef.current as any)?.play();
        } else {
            (reactLottieRef.current as any)?.stop();
        }
    }, [value]);

    const onKeyDown = (e: any) => {
        if (e.keyCode === 13) {
            if (value === localStorage.getItem("app_lock")) {
                localStorage.setItem('lock-on', "false");
                dispatch(setLock(false));
            }
            setValue('');
        }
    };

    if (!ready) return (<LoadingScreen color={"error"} button text={"loading-error"}/>);

    return (
        <Fade in={lock} timeout={1000}>
            <AppLookStyled>
                <Stack spacing={2} alignItems="center" maxWidth={340} width={1}>
                    <Player
                        ref={reactLottieRef}
                        autoplay={false}
                        loop
                        src={"/static/lotties/applock.json"}
                        style={{height: "183px", width: '183px'}}/>
                    <Typography variant="h6" color="text.primary" fontWeight={700} mb={2}>
                        {t("title")}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight={400}>
                        {t("sub-title")}
                    </Typography>
                    <TextField
                        onKeyDown={onKeyDown}
                        onChange={(e) => setValue(e.target.value)} value={value} fullWidth type='password'
                        placeholder={t("text-placeholder")} variant="outlined"/>
                    <Button
                        onClick={() => {
                            dispatch(setLock(false));
                            setValue('');
                        }}
                        disabled={localStorage.getItem("app_lock") !== value}
                        variant="contained" color="primary" fullWidth>
                        {t("button")}
                    </Button>
                </Stack>
            </AppLookStyled>
        </Fade>
    )
}

export default AppLock;
