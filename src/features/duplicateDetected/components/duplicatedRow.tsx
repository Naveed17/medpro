import {
    Checkbox, Chip,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    ListSubheader,
    Stack,
    Typography,
    useTheme
} from "@mui/material";
import React from "react";
import {useAppSelector} from "@lib/redux/hooks";
import {duplicatedSelector} from "@features/duplicateDetected";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

function DuplicatedRow({...props}) {
    const {modalData, index, t, fields, handleChangeFiled, handleSelectedDuplication, handlePatientRef} = props;
    const theme = useTheme();

    const {duplications, duplicationInit} = useAppSelector(duplicatedSelector);

    const similarField = (value: string | null, field: string, dups?: any[]) => {
        const patientSource = duplicationInit as any;
        const key = field?.length > 0 && dups ? field.split(".") : field;
        const idKey = Array.isArray(key) ? key[0] : key;
        const duplicationsArray = [(dups ? (Array.isArray(patientSource[idKey]) ? patientSource[idKey][0] : patientSource[idKey]) : duplicationInit),
            ...(dups ?? (duplications as PatientModel[]))];
        const updatedDup = field?.length > 0 ? (duplicationsArray?.reduce((dataDup: string[], data: any) => {
            let updatedField = "";
            const deepKey = Array.isArray(key) ? key[key.length - 1] : key;
            if (data && data[deepKey]) {
                switch (idKey) {
                    case "contact":
                        updatedField = `${data.code}${data.value}`;
                        break;
                    case "insurances":
                        updatedField = data[deepKey].name;
                        break;
                    default:
                        updatedField = data[deepKey];
                        break;
                }
                return [...(dataDup ?? []), updatedField];
            }
            return dataDup;
        }, []) ?? []) : [];

        return updatedDup.some((item: string) => !item.includes(value as string));
    }

    return modalData && (
        <ListItem className={`list-item ${index !== "init" ? "except" + index : "first"}`}>
            <List className="child-list-main">
                <ListSubheader
                    disableSticky
                    disableGutters
                    className={`list-subheader ${index === "init" ? "first" : "second"}`}>
                    {index === "init" ?
                        <Typography>{t("add-patient.dialog.selected")}</Typography> :
                        <FormControlLabel sx={{padding: ".5rem"}}
                                          label={t("add-patient.dialog.selected")} control={<Checkbox
                            checked={modalData.checked ?? true}
                            onChange={event => handleSelectedDuplication(event, modalData)}
                            name={`patient-${index}`}
                        />}/>
                    }
                    {(index !== "init" && (modalData.nextAppointment || modalData.previousAppointments)) &&
                        <Chip
                            sx={{
                                position: "absolute",
                                mb: "-2rem",
                                ml: 4,
                                fontSize: 10,
                                height: 14
                            }}
                            color={"error"}
                            label="Le patient a des rendez-vous"
                            size="small"
                        />}
                    <IconButton
                        onClick={event => {
                            event.stopPropagation();
                            handlePatientRef(modalData.uuid);
                        }}
                        sx={{position: "absolute", right: 1}}>
                        <OpenInNewIcon style={{
                            color: index === "init" ? "white" : theme.palette.text.secondary,
                            fontSize: 20
                        }}/>
                    </IconButton>
                </ListSubheader>

                <ListItem
                    sx={{
                        ...(similarField(modalData.fiche_id, "fiche_id") && {bgcolor: (theme) => theme.palette.error.lighter}),
                        borderBottom: 1,
                        borderColor: "divider"
                    }}>
                    <Checkbox
                        checked={fields.includes(`fiche_id-${index}`)}
                        onChange={event => handleChangeFiled(event, modalData)}
                        name={`fiche_id-${index}`}
                        sx={{mr: 1, visibility: index === "init" ? "hidden" : ""}}
                    />
                    <Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            component="p"
                            gutterBottom
                        >
                            {t("add-patient.fiche")}
                        </Typography>
                        {modalData.fiche_id ? (
                            <Typography>{modalData.fiche_id}</Typography>
                        ) : (
                            <Typography>--</Typography>
                        )}
                    </Stack>
                </ListItem>
                <ListItem
                    sx={{
                        ...(similarField(modalData.gender, "gender") && {bgcolor: (theme) => theme.palette.error.lighter}),
                        borderBottom: 1,
                        borderColor: "divider"
                    }}>
                    <Checkbox
                        checked={fields.includes(`gender-${index}`)}
                        onChange={event => handleChangeFiled(event, modalData)}
                        name={`gender-${index}`}
                        sx={{mr: 1, visibility: index === "init" ? "hidden" : ""}}
                    />
                    <Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            component="p"
                            gutterBottom
                        >
                            {t("add-patient.gender")}
                        </Typography>
                        {modalData.gender === "" ? (
                            <Typography>--</Typography>
                        ) : (
                            <Typography sx={{textTransform: "capitalize"}}>
                                {modalData.gender === "M" ? "Mr" : "Ms"}
                            </Typography>
                        )}
                    </Stack>
                </ListItem>
                <ListItem
                    sx={{
                        ...(similarField(modalData.firstName, "firstName") && {bgcolor: (theme) => theme.palette.error.lighter}),
                        borderBottom: 1, borderColor: "divider"
                    }}>
                    <Checkbox
                        checked={fields.includes(`firstName-${index}`)}
                        onChange={event => handleChangeFiled(event, modalData)}
                        name={`firstName-${index}`}
                        sx={{mr: 1, visibility: index === "init" ? "hidden" : ""}}
                    />
                    <Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            component="p"
                            gutterBottom
                        >
                            {t("add-patient.name")}
                        </Typography>
                        {modalData.firstName ? (
                            <Typography sx={{textTransform: "capitalize"}}>
                                {modalData.firstName}
                            </Typography>
                        ) : (
                            <Typography>--</Typography>
                        )}
                    </Stack>
                </ListItem>
                <ListItem
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        ...(similarField(modalData.lastName, "lastName") && {bgcolor: (theme) => theme.palette.error.lighter})
                    }}>
                    <Checkbox
                        checked={fields.includes(`lastName-${index}`)}
                        onChange={event => handleChangeFiled(event, modalData)}
                        name={`lastName-${index}`}
                        sx={{mr: 1, visibility: index === "init" ? "hidden" : ""}}
                    />
                    <Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            component="p"
                            gutterBottom
                        >
                            {t("add-patient.first-name")}
                        </Typography>
                        {modalData.lastName ? (
                            <Typography sx={{textTransform: "capitalize"}}>
                                {modalData.lastName}
                            </Typography>
                        ) : (
                            <Typography>--</Typography>
                        )}
                    </Stack>
                </ListItem>
                <ListItem
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        ...(similarField(modalData.birthdate, "birthdate") && {bgcolor: (theme) => theme.palette.error.lighter})
                    }}>
                    <Checkbox
                        checked={fields.includes(`birthdate-${index}`)}
                        onChange={event => handleChangeFiled(event, modalData)}
                        name={`birthdate-${index}`}
                        sx={{mr: 1, visibility: index === "init" ? "hidden" : ""}}
                    />
                    <Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            component="p"
                            gutterBottom
                        >
                            {t("add-patient.date-of-birth")}
                        </Typography>
                        {modalData.birthdate ? (
                            <Typography>
                                {modalData.birthdate}
                            </Typography>
                        ) : (
                            <Typography>--</Typography>
                        )}
                    </Stack>
                </ListItem>
                <ListItem
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        ...((duplications && similarField(
                            modalData?.contact?.map((data: ContactModel) => `${data.code}${data.value}`).join(","),
                            "contact.value",
                            duplications?.reduce((DupContact: ContactModel[], dup) => [...(DupContact ?? []), ...dup?.contact], []))) && {bgcolor: (theme) => theme.palette.error.lighter})
                    }}>
                    <Checkbox
                        checked={fields.includes(`contact-${index}`)}
                        onChange={event => handleChangeFiled(event, modalData)}
                        name={`contact-${index}`}
                        sx={{mr: 1, visibility: index === "init" ? "hidden" : ""}}
                    />
                    <Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            component="p"
                            gutterBottom
                        >
                            {t("add-patient.telephone")}
                        </Typography>
                        {modalData.contact && modalData.contact.length > 0 ? (
                            <Typography>{`${modalData.contact[0].code} ${modalData.contact[0].value}`}</Typography>
                        ) : (
                            <Typography>--</Typography>
                        )}
                    </Stack>
                </ListItem>
                <ListItem
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        ...(similarField(modalData.profession, "profession") && {bgcolor: (theme) => theme.palette.error.lighter})
                    }}>
                    <Checkbox
                        checked={fields.includes(`profession-${index}`)}
                        onChange={event => handleChangeFiled(event, modalData)}
                        name={`profession-${index}`}
                        sx={{mr: 1, visibility: index === "init" ? "hidden" : ""}}
                    />
                    <Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            component="p"
                            gutterBottom
                        >
                            {t("add-patient.profession")}
                        </Typography>
                        {modalData.profession ? (
                            <Typography>{modalData.profession}</Typography>
                        ) : (
                            <Typography>--</Typography>
                        )}
                    </Stack>
                </ListItem>
                <ListItem
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        ...((duplications && modalData?.nationality && similarField(
                            modalData?.nationality.code,
                            "nationality.code",
                            duplications?.reduce((unique: any[], item) =>
                                    (!item?.nationality ? unique : [...unique, item.nationality]),
                                []))) && {bgcolor: (theme) => theme.palette.error.lighter})
                    }}>
                    <Checkbox
                        checked={fields.includes(`nationality-${index}`)}
                        onChange={event => handleChangeFiled(event, modalData)}
                        name={`nationality-${index}`}
                        sx={{mr: 1, visibility: index === "init" ? "hidden" : ""}}
                    />
                    <Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            component="p"
                            gutterBottom
                        >
                            {t("add-patient.nationality")}
                        </Typography>
                        {modalData.nationality ? (
                            <Typography sx={{textTransform: "uppercase"}}>{modalData.nationality.code}</Typography>
                        ) : (
                            <Typography>--</Typography>
                        )}
                    </Stack>
                </ListItem>
                <ListItem
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        ...((duplications && similarField(
                            modalData?.address?.map((data: AddressModel) => data.street).join(","),
                            "address.street",
                            duplications?.reduce((DupAddress: AddressModel[], dup) => [...(DupAddress ?? []), ...(dup?.address as AddressModel[])], []))) && {bgcolor: (theme) => theme.palette.error.lighter})
                    }}>
                    <Checkbox
                        checked={fields.includes(`address-${index}`)}
                        onChange={event => handleChangeFiled(event, modalData)}
                        name={`address-${index}`}
                        sx={{mr: 1, visibility: index === "init" ? "hidden" : ""}}
                    />
                    <Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            component="p"
                            gutterBottom
                            mb={0.56}
                        >
                            {t("add-patient.address")}
                        </Typography>
                        {modalData.address && modalData.address.length > 0 ? (
                            <Typography>{modalData.address[0]?.street?.length > 0 ? modalData.address[0].street : "--"}</Typography>
                        ) : (
                            <Typography>--</Typography>
                        )}
                    </Stack>
                </ListItem>
                <ListItem
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        ...((duplications && similarField(
                            modalData?.insurances?.map((data: any) => data.insurance?.name).join(","),
                            "insurances.insurance",
                            duplications?.reduce((DupInsurance: PatientInsuranceModel[], dup) => [...(DupInsurance ?? []), ...dup?.insurances], []))) && {bgcolor: (theme) => theme.palette.error.lighter})
                    }}>
                    <Checkbox
                        checked={fields.includes(`insurances-${index}`)}
                        onChange={event => handleChangeFiled(event, modalData)}
                        name={`insurances-${index}`}
                        sx={{mr: 1, visibility: index === "init" ? "hidden" : ""}}
                    />
                    <Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            component="p"
                            gutterBottom>
                            {t("add-patient.assurance")}
                        </Typography>
                        {(modalData.insurances && modalData.insurances.length > 0) ?
                            <Typography> {modalData.insurances.map((insuranceData: any) => insuranceData.insurance?.name).join(",")}</Typography>
                            :
                            <Typography>--</Typography>
                        }
                    </Stack>
                </ListItem>
                <ListItem
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        ...(similarField(modalData.email, "email") && {bgcolor: (theme) => theme.palette.error.lighter})
                    }}>
                    <Checkbox
                        checked={fields.includes(`email-${index}`)}
                        onChange={event => handleChangeFiled(event, modalData)}
                        name={`email-${index}`}
                        sx={{mr: 1, visibility: index === "init" ? "hidden" : ""}}
                    />
                    <Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            component="p"
                            gutterBottom
                        >
                            {t("add-patient.email")}
                        </Typography>
                        {modalData.email ? (
                            <Typography>{modalData.email}</Typography>
                        ) : (
                            <Typography>--</Typography>
                        )}
                    </Stack>
                </ListItem>
                <ListItem
                    {...(similarField(modalData.idCard, "idCard") && {
                        sx: {bgcolor: (theme) => theme.palette.error.lighter}
                    })}>
                    <Checkbox
                        checked={fields.includes(`idCard-${index}`)}
                        onChange={event => handleChangeFiled(event, modalData)}
                        name={`idCard-${index}`}
                        sx={{mr: 1, visibility: index === "init" ? "hidden" : ""}}
                    />
                    <Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            component="p"
                            gutterBottom
                        >
                            {t("add-patient.cin")}
                        </Typography>
                        {modalData.idCard ? (
                            <Typography>{modalData.idCard}</Typography>
                        ) : (
                            <Typography>--</Typography>
                        )}
                    </Stack>
                </ListItem>
            </List>
        </ListItem>
    )
}

export default DuplicatedRow;
