// material
import {
    Grid,
    Typography,
    IconButton,
    Box,
    Stack,
    DialogActions,
    Button,
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import DetailCardStyled from "./overrides/detailCardStyle";
import CircleIcon from "@mui/icons-material/Circle";
import {Dialog} from "@features/dialog";
import React, {useState} from "react";
import CloseIcon from "@mui/icons-material/Close";
import IconUrl from "@themes/urlIcon";

export default function DetailsCard({...props}) {
    const {rows, waitingRoom, t, handleEvent} = props;
    const theme = useTheme();
    const [info, setInfo] = useState<null | string>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [actions, setActions] = useState<boolean>(false);

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setInfo(null);
    };

    const DialogAction = () => {
        return (
            <DialogActions>
                <Button onClick={handleCloseDialog} startIcon={<CloseIcon/>}>
                    {t("table.cancel")}
                </Button>
                <Button
                    variant="contained"
                    onClick={handleCloseDialog}
                    startIcon={<IconUrl path="ic-check"/>}>
                    {t("table.end_consultation")}
                </Button>
            </DialogActions>
        );
    };

    return (
        <>
            {rows?.map((item: any, i: number) => (
                <DetailCardStyled
                    key={i}
                    sx={{
                        borderLeft: `6px solid ${
                            item.status === "completed"
                                ? theme.palette.success.main
                                : item?.status === "canceled"
                                    ? theme.palette.error.main
                                    : item.status === "success"
                                        ? theme.palette.success.main
                                        : theme.palette.primary.main
                        }`,
                    }}>
                    {waitingRoom && (
                        <Grid container spacing={1}>
                            <Grid item md={10} sm={10} xs={11}>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center">
                                    {item.consultation_reason && (
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <CircleIcon
                                                fontSize="small"
                                                sx={{
                                                    border: 1,
                                                    borderColor: "divider",
                                                    borderRadius: "50%",
                                                    p: 0.2,
                                                }}
                                                color="primary"
                                            />
                                            <Typography color="primary">
                                                {item.consultation_reason.name}
                                            </Typography>
                                        </Stack>
                                    )}
                                </Box>
                                <Stack spacing={0.5}>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Typography
                                            color="primary"
                                            fontWeight={700}
                                            sx={{}}
                                            lineHeight={1}
                                            variant="body1">
                                            {item.patient.firstName} {item.patient.lastName}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                svg: {
                                                    height: 14,
                                                    width: 14,
                                                    mr: 0.5,
                                                    path: {
                                                        fill: theme.palette.text.primary,
                                                    },
                                                },
                                            }}>
                                            <IconUrl path="ic-time"/>
                                            <Typography component="span" fontWeight={600}>
                                                {item.arrive_time}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                    {item.patient.contact?.length > 0 &&
                                        <Stack direction="row" alignItems="center" spacing={0.5}>
                                            <IconUrl path="ic-tel" className="ic-tel"/>
                                            <Typography variant="body2">
                                                {item.patient.contact[0].value}
                                            </Typography>
                                        </Stack>}
                                    <Typography>{item.appointment_type.name}</Typography>
                                </Stack>
                            </Grid>
                            <Grid item md={2} sm={2} xs={1}>
                                <Stack spacing={1}>
                                    <IconButton
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleEvent({action: "OPEN-POPOVER", row: item, event});
                                        }}
                                        sx={{display: "block", ml: "auto"}}
                                        size="small">
                                        <IconUrl path="more-vert"/>
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        className="btn-phone"
                                        LinkComponent="a"
                                        {...(item.patient.contact?.length > 0 && {href: `tel:${item.patient.contact[0].value}`})}
                                        onClick={(event) => event.stopPropagation()}>
                                        <IconUrl path="ic-tel"/>
                                    </IconButton>
                                </Stack>
                            </Grid>
                        </Grid>
                    )}
                </DetailCardStyled>
            ))}
            {info && (
                <Dialog
                    action={info}
                    open={openDialog}
                    size={"lg"}
                    color={
                        info === "secretary_consultation_alert" && theme.palette.error.main
                    }
                    direction={"ltr"}
                    title={t("table.end_consultation")}
                    dialogClose={handleCloseDialog}
                    onClose={handleCloseDialog}
                    {...(actions && {
                        actionDialog: <DialogAction/>,
                        onClose: false,
                    })}
                />
            )}
        </>
    );
}
