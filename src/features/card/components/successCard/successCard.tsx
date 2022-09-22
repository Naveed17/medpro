import React from "react";
import {Button, Stack, Typography} from "@mui/material";
import {Player, Controls} from "@lottiefiles/react-lottie-player";
import Icon from "@themes/urlIcon";
import {styled} from "@mui/material/styles";

const RootStyle = styled(Stack)(({theme}) => ({
    backgroundColor: theme.palette.common.white,
    padding: theme.spacing(2),
}));

function SuccessCard({...props}) {
    const {onClickTextButton, data} = props;
    const {title, description, icon, buttons} = data;
    return (
        <RootStyle justifyContent="center" alignItems="center" height={1}>
            <Player
                autoplay
                keepLastFrame
                src="/static/lotties/check-mark-success.json"
                style={{height: "133px", width: "133px"}}
            >
                <Controls
                    visible={false}
                    buttons={["play", "repeat", "frame", "debug"]}
                />
            </Player>
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
                            startIcon={button.icon && <Icon path={button.icon}/>}
                            sx={button.sx}
                            onClick={() => onClickTextButton(button.action)}>
                            {button.title}
                        </Button>))}
                </Stack>
            }
        </RootStyle>
    );
}

export default SuccessCard;
