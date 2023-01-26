// material
import {
    Grid,
    Typography,
    IconButton,
    Box,
    Stack, DialogActions, Button
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import Icon from "@themes/urlIcon";
import DetailCardStyled from "./overrides/detailCardStyle";
import CircleIcon from '@mui/icons-material/Circle';
import {Dialog} from "@features/dialog";
import React, {useState} from "react";
import CloseIcon from "@mui/icons-material/Close";

export default function DetailsCard({...props}) {
    const {rows, waitingRoom, t, handleEvent} = props;
    const theme = useTheme();

    const [info, setInfo] = useState<null | string>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [actions, setActions] = useState<boolean>(false);

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setInfo(null)
    }

    const DialogAction = () => {
        return (
            <DialogActions>
                <Button onClick={handleCloseDialog}
                        startIcon={<CloseIcon/>}>
                    {t('table.cancel')}
                </Button>
                <Button variant="contained"
                        onClick={handleCloseDialog}
                        startIcon={<Icon
                            path='ic-check'/>}>
                    {t('table.end_consultation')}
                </Button>
            </DialogActions>
        )
    }

    return (
        <>
            {rows?.map((item: any, i: number) => (
                <DetailCardStyled
                    key={i}
                    sx={{
                        borderLeft: `6px solid ${item.status === "completed"
                            ? theme.palette.success.main
                            : item?.status === "canceled"
                                ? theme.palette.error.main
                                : item.status === "success"
                                    ? theme.palette.success.main
                                    : theme.palette.primary.main
                        }`,
                    }}
                >
                    {waitingRoom &&
                        <Grid container>
                            <Grid item md={10} sm={10} xs={11}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box sx={{
                                        display: "flex", alignItems: "center",
                                        color: theme.palette.success.main,
                                        svg: {
                                            height: 14,
                                            width: 14,
                                            mr: 0.5,
                                            path: {
                                                fill: theme.palette.success.main,
                                            }
                                        }
                                    }}>
                                        <Icon path="ic-time"/>
                                        <span>
                                            {item.arrive_time}
                                        </span>
                                    </Box>
                                    {item.consultation_reason && <Stack direction="row"
                                                                        alignItems="center"
                                                                        spacing={1}
                                    >
                                        <CircleIcon fontSize="small" sx={{
                                            border: 1,
                                            borderColor: 'divider',
                                            borderRadius: '50%',
                                            p: 0.2,
                                        }}
                                                    color='primary'
                                        />
                                        <Typography color="primary">
                                            {item.consultation_reason.name}
                                        </Typography>
                                    </Stack>}
                                </Box>
                                <Stack direction='row' alignItems="center">
                                    <Typography
                                        color="primary"
                                        sx={{
                                            mt: 1
                                        }}
                                        lineHeight={1}
                                        variant="body1"
                                    >
                                        {item.patient.firstName} {item.patient.lastName}
                                    </Typography>
                                </Stack>

                            </Grid>
                            <Grid item md={2} sm={2} xs={1}>
                                <Box display="flex" alignItems="center" height="100%">
                                    <IconButton
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleEvent({action: "OPEN-POPOVER", row: item, event});
                                        }}
                                        sx={{display: "block", ml: "auto"}}
                                        size="small">
                                        <Icon path="more-vert"/>
                                    </IconButton>
                                </Box>
                            </Grid>
                        </Grid>
                    }
                </DetailCardStyled>
            ))}
            {info &&
                <Dialog action={info}
                        open={openDialog}
                        size={"lg"}
                        color={info === "secretary_consultation_alert" && theme.palette.error.main}
                        direction={'ltr'}
                        title={t("table.end_consultation")}
                        dialogClose={handleCloseDialog}
                        onClose={handleCloseDialog}
                        {...(actions && {
                            actionDialog: <DialogAction/>,
                            onClose: false,
                        })}

                />
            }
        </>
    );
}
