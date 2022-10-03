import React, {memo} from "react";
import {Button, Stack, Typography} from "@mui/material";
import {Player} from "@lottiefiles/react-lottie-player";
import IconUrl from "@themes/urlIcon";
import {styled} from "@mui/material/styles";

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
                <Stack direction={{lg: "row", xs: "column"}} spacing={2} mt={5}>
                    {buttons.map((button: any, index: number) => (
                        <Button
                            key={`button-${index}`}
                            {...(button.variant && {variant: button.variant})}
                            {...(button.color && {color: button.color})}
                            {...(button.disabled && {disabled: button.disabled})}
                            startIcon={button.icon && <IconUrl path={button.icon} color={"white"}/>}
                            sx={button.sx}
                            onClick={() => onClickTextButton(button.action)}>
                            {button.title}
                        </Button>))}
                </Stack>
            }
        </RootStyle>
    );
}

export default React.memo(SuccessCard)
