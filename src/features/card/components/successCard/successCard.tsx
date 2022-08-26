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
    const {title, description, icon, addPatient, addRDV} = props.data;
    return (
        <RootStyle
            justifyContent="center"
            alignItems="center"
            height={1}
        >
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
            {addPatient && addRDV && (
                <Stack direction={{lg: "row", xs: "column"}} spacing={2} mt={5}>
                    <Button variant="text-primary">{addPatient}</Button>
                    <Button
                        variant="contained"
                        color="warning"
                        sx={{
                            "& svg": {
                                "& path": {fill: (theme) => theme.palette.text.primary},
                            },
                        }}
                        startIcon={<Icon path={icon}/>}
                    >
                        {addRDV}
                    </Button>
                </Stack>
            )}
        </RootStyle>
    );
}

export default SuccessCard;
