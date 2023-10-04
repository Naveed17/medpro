import {
    FormControlLabel,
    Link,
    ListItem,
    Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import React, {useEffect, useState} from "react";
import MedicalPrescriptionModelDialogStyled from "./overrides/medicalPrescriptionModelDialogStyled";
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {prescriptionSelector, setModelName, setParentModel} from "@features/dialog";

function MedicalPrescriptionModelDialog({...props}) {
    const {data: dialogData} = props;
    const {t, models, setOpenAddParentDialog, color = "primary"} = dialogData;
    const dispatch = useAppDispatch();

    const {parent} = useAppSelector(prescriptionSelector);

    const [selectedParent, setSelectedParent] = useState<string>("");
    const [value, setValue] = useState("");

    useEffect(() => {
        if (parent?.length > 0) {
            setSelectedParent(parent);
        }
    }, [parent]);

    return (
        <>
            <MedicalPrescriptionModelDialogStyled {...{color}}>
                {dialogData?.dose && (
                    <Stack>
                        <TextField
                            value={value}
                            onChange={(e) => {
                                setValue(e.target.value);
                                dispatch(setModelName(e.target.value));
                            }}
                            placeholder={t("new_model", {ns: "consultation"})}
                        />
                    </Stack>
                )}
                <Typography variant="body2" {...(dialogData?.dose && {mt: 2})} fontWeight={600}>
                    {dialogData?.t("file", {ns: "consultation"})}
                </Typography>
                <RadioGroup
                    aria-labelledby="prescription-group-label"
                    value={selectedParent}
                    onChange={event => dispatch(setParentModel(event.target.value))}
                    name="radio-buttons-group">
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
                                        <Typography>{item.isDefault ? "Répertoire par défaut" : item.name}</Typography>}
                                    control={<Radio icon={<FolderOpenRoundedIcon/>}
                                                    checkedIcon={<FolderRoundedIcon/>}/>}/>
                            </Stack>
                        </ListItem>
                    ))}
                </RadioGroup>
                <ListItem sx={{mt: 1}}>
                    <Link
                        underline="none"
                        sx={{cursor: "pointer"}}
                        onClick={() => setOpenAddParentDialog(true)}>
                        <Stack direction="row" alignItems="center">
                            <IconUrl path="ic-plus" className="ic-add"/>
                            <Typography
                                variant="body1"
                                color={`${color}.main`}>{t("new_file", {ns: "consultation"})}</Typography>
                        </Stack>
                    </Link>
                </ListItem>
            </MedicalPrescriptionModelDialogStyled>
        </>
    );
}

export default MedicalPrescriptionModelDialog;
