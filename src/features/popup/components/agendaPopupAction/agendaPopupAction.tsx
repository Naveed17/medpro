import AgendaPopupActionStyled from "./overrides/agendaPopupActionStyled";
import {
    Card,
    CardContent,
    List,
    ListItem,
    Typography,
    Stack,
    Avatar,
    Box,
    Link,
    Button
} from '@mui/material'
import IconUrl from "@themes/urlIcon";
import CheckIcon from '@mui/icons-material/Check';
import {useTranslation} from "next-i18next";
import React from "react";
import {pxToRem} from "@themes/formatFontSize";
import {LoadingScreen} from "@features/loadingScreen";
import CallIcon from "@mui/icons-material/Call";

function AgendaPopupAction({...props}) {
    const {data, OnEdit, OnConfirm} = props;

    const {t, ready} = useTranslation("common");

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <AgendaPopupActionStyled>
            <CardContent>
                <Typography gutterBottom variant="subtitle2" fontWeight={600}>
                    {t("dialogs.confirm-dialog.title")}
                </Typography>
                <Card>
                    <List>
                        <ListItem>
                            <Stack spacing={1} direction='row' alignItems="flex-start">
                                <Box
                                    component="img"
                                    src={
                                        data?.gender === 1
                                            ? "/static/icons/men-avatar.svg"
                                            : "/static/icons/women-avatar.svg"
                                    }
                                    width={pxToRem(42)}
                                    height={pxToRem(42)}
                                    sx={{borderRadius: pxToRem(6), mb: pxToRem(10), mr: .5}}
                                />
                                <Box>
                                    <Typography fontWeight={700} gutterBottom>
                                        {data.name}
                                    </Typography>
                                    <Stack spacing={0.2} direction='row' alignItems="center">
                                        <IconUrl path='ic-tel' className="ic-tel"/>
                                        <Link underline="none" href={`tel:`} sx={{ml: 1, fontSize: 12}}
                                              color="text.primary" fontWeight={400}>
                                            {data.phone}
                                        </Link>
                                    </Stack>
                                </Box>
                            </Stack>
                        </ListItem>
                        <ListItem>
                            <Typography fontWeight={400}>
                                {t("dialogs.confirm-dialog.sub-title")}
                            </Typography>
                            <Stack spacing={4} direction="row" alignItems='center'>
                                <Stack spacing={0.5} direction="row" alignItems='center'>
                                    <IconUrl className='ic-callander' path="ic-calendar"/>
                                    <Typography fontWeight={600}>
                                        {data.date}
                                    </Typography>
                                </Stack>
                                <Stack spacing={0.5} direction="row" alignItems='center'>
                                    <IconUrl className='ic-time' path="setting/ic-time"/>
                                    <Typography fontWeight={700}>
                                        {data.time}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </ListItem>
                    </List>
                </Card>
                <Stack mt={1} spacing={2} direction={{xs: 'column', md: "row"}}>
                    <Button fullWidth
                            onClick={OnEdit}
                            variant="white" startIcon={<IconUrl path="ic-setting"/>}>
                        {t("dialogs.confirm-dialog.edit")}
                    </Button>
                    <Button
                        onClick={OnConfirm}
                        fullWidth
                        variant="contained" startIcon={<CheckIcon/>}>
                        {t("dialogs.confirm-dialog.confirm")}
                    </Button>
                    <Button
                        href={`tel:${data.phone.replaceAll(" ", "")}`}
                        fullWidth
                        variant="contained"
                        startIcon={<CallIcon/>}>
                        {t("dialogs.confirm-dialog.call")}
                    </Button>
                </Stack>
            </CardContent>
        </AgendaPopupActionStyled>
    )
}

export default AgendaPopupAction;
