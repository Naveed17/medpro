import React, {memo, useState} from "react";
import {Stack, Typography} from "@mui/material";
import {Player} from "@lottiefiles/react-lottie-player";
import IconUrl from "@themes/urlIcon";
import {styled} from "@mui/material/styles";
import {LoadingButton} from "@mui/lab";

const RootStyle = styled(Stack)(({theme}) => ({
    backgroundColor: theme.palette.common.white,
    padding: theme.spacing(2),
}));

export const LottiePlayer: any = memo(({src, ...props}: any) => {
    return (
        <Player src={src}
                {...props}/>
    );
})
LottiePlayer.displayName = "lottie-player";

function SuccessCard({...props}) {
    const {onClickTextButton, data} = props;
    const {title, description, buttons} = data;
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <RootStyle key={"success-card"} justifyContent="center" alignItems="center" height={1}>
            <LottiePlayer
                autoplay
                keepLastFrame
                src="/static/lotties/check-mark-success.json"
                style={{height: "133px", width: "133px"}}
            />
            <Typography variant="h6" gutterBottom sx={{my: 3}}>
                {title}
            </Typography>
            <Typography
                variant="body1"
                textAlign={{xs: "center", lg: "left"}}
                color="text.secondary"
            >
                {description}
            </Typography>
            {buttons &&
                <Stack direction={{
                    lg: (buttons.length > 2 && buttons.find((button: any) => button.disabled) ? "row" : "column"),
                    xs: "column"
                }} spacing={2} mt={5}>
                    {buttons.map((button: any, index: number) => (
                        <LoadingButton
                            key={`button-${index}`}
                            {...{loading}}
                            {...(button.variant && {variant: button.variant})}
                            {...(button.color && {color: button.color})}
                            {...(button.disabled && {disabled: button.disabled})}
                            startIcon={button.icon && <IconUrl path={button.icon} color={"white"}/>}
                            sx={button.sx}
                            onClick={() => {
                                setLoading(true);
                                onClickTextButton(button.action);
                            }}>
                            {button.title}
                        </LoadingButton>))}
                </Stack>
            }
        </RootStyle>
    );
}

export default React.memo(SuccessCard)
