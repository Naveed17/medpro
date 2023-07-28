import {
    Checkbox,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    ListSubheader,
    Stack,
    Typography,
    useTheme
} from "@mui/material";
import Icon from "@themes/urlIcon";
import React from "react";
import {useAppSelector} from "@lib/redux/hooks";
import {duplicatedSelector} from "@features/duplicateDetected";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

function DuplicatedRow({...props}) {
    const {modalData, index, t, fields, handleChangeFiled, handleSelectedDuplication, handlePatientRef} = props;
    const theme = useTheme();

    const {duplications} = useAppSelector(duplicatedSelector);

    const similarField = (value: string | null, field: string, dups?: any[]) => {
        const updatedDup = (dups ?? duplications)?.filter((data: any) => field?.length > 0 && data[field]).map((data: any) => data[field]) ?? [];
        return updatedDup.some(item => item !== value);
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
                    {...(similarField(modalData.fiche_id, "fiche_id") && {secondaryAction: <Icon path="danger"/>})}
                    sx={{borderBottom: 1, borderColor: "divider"}}>
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
                    {...(similarField(modalData.gender, "gender") && {secondaryAction: <Icon path="danger"/>})}
                    sx={{borderBottom: 1, borderColor: "divider"}}>
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
                    {...(similarField(modalData.firstName, "firstName") && {secondaryAction: <Icon path="danger"/>})}
                    sx={{borderBottom: 1, borderColor: "divider"}}>
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
                    {...(similarField(modalData.lastName, "lastName") && {secondaryAction: <Icon path="danger"/>})}
                    sx={{borderBottom: 1, borderColor: "divider"}}>
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
                    {...(similarField(modalData.birthdate, "birthdate") && {secondaryAction: <Icon path="danger"/>})}
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        //bgcolor: (theme) => theme.palette.error.lighter,
                        "& .react-svg": {ml: "auto"},
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
                    {...((duplications && similarField(
                        modalData?.contact?.map((data: ContactModel) => `${data.code}${data.value}`).join(","),
                        "value",
                        duplications?.map(dup => dup?.contact))) && {secondaryAction: <Icon path="danger"/>})}
                    sx={{borderBottom: 1, borderColor: "divider"}}>
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
                    {...(similarField(modalData.profession, "profession") && {secondaryAction: <Icon path="danger"/>})}
                    sx={{borderBottom: 1, borderColor: "divider"}}>
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
                    {...((duplications && modalData?.nationality && similarField(
                        modalData?.nationality.code,
                        "code",
                        duplications?.reduce((unique: any[], item) =>
                                (!item?.nationality ? unique : [...unique, item]),
                            []))) && {secondaryAction: <Icon path="danger"/>})}
                    sx={{borderBottom: 1, borderColor: "divider"}}>
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
                    {...((duplications && similarField(
                        modalData?.address?.map((data: AddressModel) => data.street).join(","),
                        "street",
                        duplications?.map(dup => dup?.address))) && {secondaryAction: <Icon path="danger"/>})}
                    sx={{borderBottom: 1, borderColor: "divider"}}>
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
                    {...((duplications && similarField(
                        modalData?.insurances?.map((data: any) => data.insurance?.name).join(","),
                        "name",
                        duplications?.map(dup => dup?.insurances))) && {secondaryAction: <Icon path="danger"/>})}
                    sx={{borderBottom: 1, borderColor: "divider"}}>
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
                    {...(similarField(modalData.email, "email") && {secondaryAction: <Icon path="danger"/>})}
                    sx={{borderBottom: 1, borderColor: "divider"}}>
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
                        secondaryAction: <Icon path="danger"/>
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
