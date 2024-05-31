import React, {useState} from 'react';
import {
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Stack,
    Typography,
    useTheme
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {useInsurances} from "@lib/hooks/rest";
import {SocialInsured} from "@lib/constants";
import {Theme} from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import Icon from "@themes/urlIcon";

const CardInsurance = ({...props}) => {

    const {pi, t, setSelectedInsurance, deleteInsurance} = props;
    const {insurances} = useInsurances()

    const [openDelete,setOpenDelete] = useState(false)

    const theme = useTheme();

    return (
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Stack>
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <Typography className={"name"}>{pi.insurance.name}</Typography>
                    <Typography
                        className={"title"}>{t(`social_insured.${SocialInsured.find(si => si.value == pi.type)?.label}`, {ns: "common"})}</Typography>
                </Stack>
                <Stack direction={"row"} spacing={1}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img width={25} height={25}
                         src={insurances.find(insurance => pi.insurance.uuid === insurance.uuid)?.logoUrl.url ?insurances.find(insurance => pi.insurance.uuid === insurance.uuid)?.logoUrl.url : "/static/icons/ic-assurance.svg"}
                         alt={"insurance image"}/>
                    <Stack>
                        <Typography className={"number"}>{pi.insuranceNumber}</Typography>
                        {pi.insuranceBook?.endDate && <Typography
                            className={"expireIn"}>{t('insurance.expire', {ns: "patient"})} {pi.insuranceBook.endDate}</Typography>}
                    </Stack>
                </Stack>
            </Stack>
            <Stack direction={"row"} spacing={1} style={{height: "fit-content"}}>
                <IconButton
                    onClick={event => {
                        event.stopPropagation();
                        setSelectedInsurance(pi.insurance.uuid)
                    }}
                    size="small">
                    <IconUrl path="ic-edit-pen" color={theme.palette.text.secondary}/>
                </IconButton>
                <IconButton
                    onClick={event => {
                        event.stopPropagation();
                        setOpenDelete(true)
                    }}
                    size="small">
                    <IconUrl path="ic-delete" color={theme.palette.text.secondary}/>
                </IconButton>
            </Stack>

            <Dialog onClose={() => setOpenDelete(false)}
                    PaperProps={{
                        sx: {
                            width: "100%"
                        }
                    }} maxWidth="sm" open={openDelete}>
                <DialogTitle sx={{
                    bgcolor: (theme: Theme) => theme.palette.error.main,
                    px: 1,
                    py: 2,

                }}>
                    {t("insurance.title_delete")}
                </DialogTitle>
                <DialogContent style={{paddingTop: 20}}>
                    <Typography>
                        {t("insurance.desc_delete")}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{borderTop: 1, borderColor: "divider", px: 1, py: 2}}>
                    <Stack direction="row" spacing={1}>
                        <Button
                            onClick={() => {
                                setOpenDelete(false);
                            }}
                            startIcon={<CloseIcon/>}>
                            {t("insurance.cancel")}
                        </Button>
                        <LoadingButton
                            variant="contained"
                            color="error"
                            onClick={() => deleteInsurance(pi.uuid)}
                            startIcon={<Icon path="setting/icdelete" color="white"/>}>
                            {t("insurance.delete")}
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </Dialog>
        </Stack>
    );
}

export default CardInsurance;
