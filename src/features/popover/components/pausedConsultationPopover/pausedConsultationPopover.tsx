import {
    Avatar,
    Badge,
    Box,
    Divider,
    List,
    ListItem, Stack,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {Theme} from "@mui/material/styles";
import React from "react";
import PausedConsultationPopoverStyled from "./overrides/pausedConsultationPopoverStyled";
import {Label} from "@features/label";
import {useTranslation} from "next-i18next";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {a11yProps} from "@lib/hooks";

function PausedConsultationPopover({...props}) {
    const {pausedConsultation} = props;
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
    const theme = useTheme();

    const {t} = useTranslation("common");

    return (
        <PausedConsultationPopoverStyled
            sx={{
                width: isMobile ? 320 : 400
            }}>

            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={0}
                      aria-label="basic tabs example">
                    <Tab className={"tab-item"} label={t("En pause")} {...a11yProps(0)} />
                </Tabs>
            </Box>
            <List>
                {pausedConsultation.map((paused: any, index: number) => <ListItem key={index}>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                        badgeContent={
                            <Avatar
                                className={"avatar-badge"}
                                alt="avatar"
                                src={'/static/icons/ic-pause-mate.svg'}
                            />
                        }>
                        <Avatar
                            className={"round-avatar"}
                            sx={{
                                borderRadius: 20,
                                border: `2px solid ${theme.palette.background.paper}`
                            }}
                            variant={"circular"}
                            src={`/static/icons/men-avatar.svg`}/>
                    </Badge>
                    <Stack direction={"row"}
                           sx={{width: "100%"}}
                           justifyContent={"space-between"}
                           alignItems={"center"}>
                        <Stack>
                            <Typography
                                fontSize={14}
                                fontWeight={600}>{paused.patient.firstName} {paused.patient.lastName}</Typography>
                            <Label
                                variant="filled"
                                sx={{
                                    width: "64px",
                                    "& .MuiSvgIcon-root": {
                                        width: 16,
                                        height: 16,
                                        pl: 0,
                                    },
                                }}
                                color={paused?.status?.classColor}>
                                <Typography
                                    sx={{
                                        fontSize: 10,
                                        ml: 0.5
                                    }}>
                                    {t(`appointment-status.${paused?.status?.key}`)}
                                </Typography>
                            </Label>
                        </Stack>
                        <Stack direction={"row"}>
                            <Avatar
                                alt="Small avatar"
                                variant={"square"}
                                src={'/static/icons/ic-stop.svg'}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    mr: 3,
                                    bgcolor: "white",
                                    border: `2px solid ${theme.palette.background.paper}`,
                                    "& .MuiAvatar-img": {
                                        width: 20,
                                        height: 20
                                    }
                                }}/>

                            <Avatar
                                alt="Small avatar"
                                variant={"square"}
                                src={'/static/icons/ic-play-paused.svg'}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    mr: 3,
                                    bgcolor: theme.palette.text.primary,
                                    border: `2px solid ${theme.palette.background.paper}`,
                                    "& .MuiAvatar-img": {
                                        color: theme.palette.warning.main,
                                        width: 20,
                                        height: 20
                                    }
                                }}/>
                        </Stack>
                    </Stack>
                </ListItem>)}
            </List>
        </PausedConsultationPopoverStyled>
    )
}

export default PausedConsultationPopover;
