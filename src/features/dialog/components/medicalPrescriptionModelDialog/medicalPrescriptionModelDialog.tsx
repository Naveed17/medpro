import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Link,
    ListItem,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Theme,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import IconUrl from "@themes/urlIcon";
import React, {useState} from "react";
import MedicalPrescriptionModelDialogStyled from "./overrides/medicalPrescriptionModelDialogStyled";
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import {useRequestMutation} from "@app/axios";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {useRouter} from "next/router";
import {useSWRConfig} from "swr";

function MedicalPrescriptionModelDialog({...props}) {
    const {data: dialogData} = props;
    const {setPrescriptionModel, t, models} = dialogData;
    const {data: session} = useSession();
    const router = useRouter();
    const {mutate} = useSWRConfig();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {trigger: triggerPrescriptionParent} = useRequestMutation(null, "/prescription/model/parent");

    const [selectedParent, setSelectedParent] = useState<any>(models[0]?.uuid);
    const [value, setValue] = useState("");
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAddParentModel = () => {
        if (name) {
            setLoading(true);
            const form = new FormData();
            form.append("name", name);
            triggerPrescriptionParent({
                method: "POST",
                url: `/api/medical-entity/${medical_entity.uuid}/prescriptions/modals/parents/${router.locale}`,
                data: form,
                headers: {Authorization: `Bearer ${session?.accessToken}`},
            }).then(() => {
                mutate(`/api/medical-entity/${medical_entity.uuid}/prescriptions/modals/parents/${router.locale}`).then(
                    (result) => {
                        const models = (result?.data as HttpResponse)?.data as PrescriptionParentModel[];
                        setSelectedParent(models[models.length - 1]?.uuid);
                        setOpen(false);
                        setLoading(false);
                    });
            });
        } else {
            setError(true);
        }
    }

    return (
        <>
            <MedicalPrescriptionModelDialogStyled>
                {dialogData?.dose && (
                    <Stack>
                        <TextField
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                setPrescriptionModel(e.target.value);
                            }}
                            placeholder={t("new_model", {ns: "consultation"})}
                        />
                        <Typography variant="body2" mt={2} fontWeight={600}>
                            {dialogData?.t("file", {ns: "consultation"})}
                        </Typography>
                    </Stack>
                )}
                <RadioGroup
                    aria-labelledby="prescription-group-label"
                    value={selectedParent}
                    onChange={event => setSelectedParent(event.target.value)}
                    name="radio-buttons-group"
                >
                    {models.map((item: any) => (
                        <ListItem
                            key={item.uuid}>
                            <Stack
                                width={1}
                                sx={{
                                    borderRadius: 0.5,
                                }}
                                direction="row"
                                alignItems="center"
                                spacing={0.5}>
                                <FormControlLabel
                                    value={item.uuid}
                                    label={
                                        <Typography>{item.name === "default" ? "Répertoire par défaut" : item.name}</Typography>}
                                    control={<Radio icon={<FolderOpenRoundedIcon/>}
                                                    checkedIcon={<FolderRoundedIcon color={"primary"}/>}/>}/>
                            </Stack>
                        </ListItem>
                    ))}
                </RadioGroup>
                <ListItem sx={{mt: 1}}>
                    <Link
                        underline="none"
                        sx={{cursor: "pointer"}}
                        onClick={() => {
                            setOpen(true);
                            setError(false);
                        }}>
                        <Stack direction="row" alignItems="center">
                            <IconUrl path="ic-plus" className="ic-add"/>
                            {t("new_file", {ns: "consultation"})}
                        </Stack>
                    </Link>
                </ListItem>
            </MedicalPrescriptionModelDialogStyled>
            <Dialog
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        width: "100%",
                    },
                }}
                onClose={() => setOpen(false)}
                open={open}>
                <DialogTitle
                    sx={{
                        bgcolor: (theme: Theme) => theme.palette.primary.main,
                        mb: 2,
                    }}>
                    {t("add_group_model", {ns: "consultation"})}
                </DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        {t("group_model_name", {ns: "consultation"})}
                    </Typography>
                    <TextField
                        fullWidth
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setError(false);
                        }}
                        placeholder={t("group_model_name_placeholder", {ns: "consultation"})}
                        error={error}
                        helperText={
                            error && t("name_is_required", {ns: "consultation"})
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Stack
                        width={1}
                        spacing={2}
                        direction="row"
                        justifyContent="flex-end">
                        <Button
                            variant="text-black"
                            onClick={() => {
                                setName("doc");
                                setOpen(false);
                            }}
                            startIcon={<CloseIcon/>}>
                            {t("cancel", {ns: "consultation"})}
                        </Button>
                        <LoadingButton
                            {...{loading}}
                            disabled={name.length === 0}
                            onClick={handleAddParentModel}
                            startIcon={<IconUrl path="ic-dowlaodfile"/>}
                            variant="contained">
                            {t("save", {ns: "consultation"})}
                        </LoadingButton>
                    </Stack>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default MedicalPrescriptionModelDialog;
