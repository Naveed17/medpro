import {
    Checkbox,
    Link,
    List,
    ListItem,
    Stack,
    TextField,
    Theme,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button, FormControlLabel, Radio, RadioGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import IconUrl from "@themes/urlIcon";
import React, {useState} from "react";
import MedicalPrescriptionModelDialogStyled from "./overrides/medicalPrescriptionModelDialogStyled";
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';

function MedicalPrescriptionModelDialog({...props}) {
    const {data: dialogData} = props;
    const {setPrescriptionModel, t, dose} = dialogData;
    const [selected, setSelected] = useState<any>("1");
    const [value, setValue] = useState("");
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("doc");
    const [error, setError] = useState(false);
    const [data, setData] = useState<any[]>([
        {id: 1, name: "Répertoire par défaut"}
    ]);

    const handleAdd = () => {
        if (name) {
            const lastItem = data[data.length - 1];
            setName("doc");
            setData([
                ...data,
                {
                    id: lastItem.id + 1,
                    name,
                },
            ]);
            setOpen(false);
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
                    value={selected}
                    onChange={event => setSelected(event.target.value)}
                    name="radio-buttons-group"
                >
                    {data.map((item: any, idx: number) => (
                        <ListItem
                            key={item.id}>
                            <Stack
                                width={1}
                                sx={{
                                    borderRadius: 0.5,
                                }}
                                direction="row"
                                alignItems="center"
                                spacing={0.5}>
                                <FormControlLabel
                                    value={item.id}
                                    label={<Typography>{item.name}</Typography>}
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
                        placeholder={t("add_name", {ns: "consultation"})}
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
                            onClick={() => {
                                handleAdd();
                            }}
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
