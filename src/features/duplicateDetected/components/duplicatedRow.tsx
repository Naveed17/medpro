import {Checkbox, List, ListItem, ListSubheader, Stack, Typography} from "@mui/material";
import Icon from "@themes/urlIcon";
import React from "react";

function DuplicatedRow({...props}) {
    const {modalData, index, t, fields, handleChangeFiled} = props;

    return (
        <ListItem className={`list-item ${index !== "init" ? "except" + index : "first"}`}>
            <List className="child-list-main">
                <ListSubheader
                    disableSticky
                    disableGutters
                    className={`list-subheader ${index === "init" ? "first" : ""}`}>
                    <Typography sx={{visibility: index !== "init" ? "hidden" : ""}}>
                        {t("add-patient.dialog.selected")}
                    </Typography>
                </ListSubheader>

                <ListItem sx={{borderBottom: 1, borderColor: "divider"}}>
                    <Checkbox
                        checked={fields.includes(`gender-${index}`)}
                        onChange={handleChangeFiled}
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
                <ListItem sx={{borderBottom: 1, borderColor: "divider"}}>
                    <Checkbox
                        checked={fields.includes(`firstname-${index}`)}
                        onChange={handleChangeFiled}
                        name={`firstname-${index}`}
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
                <ListItem sx={{borderBottom: 1, borderColor: "divider"}}>
                    <Checkbox
                        checked={fields.includes(`lastname-${index}`)}
                        onChange={handleChangeFiled}
                        name={`lastname-${index}`}
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
                        bgcolor: (theme) => theme.palette.error.lighter,
                        "& .react-svg": {ml: "auto"},
                    }}
                >
                    <Checkbox
                        checked={fields.includes(`birthday-${index}`)}
                        onChange={handleChangeFiled}
                        name={`birthday-${index}`}
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
                    <Icon path="danger"/>
                </ListItem>
                <ListItem sx={{borderBottom: 1, borderColor: "divider"}}>
                    <Checkbox
                        checked={fields.includes(`contact-${index}`)}
                        onChange={handleChangeFiled}
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
                <ListItem sx={{borderBottom: 1, borderColor: "divider"}}>
                    <Checkbox
                        checked={fields.includes(`profession-${index}`)}
                        onChange={handleChangeFiled}
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
                <ListItem sx={{borderBottom: 1, borderColor: "divider"}}>
                    <Checkbox
                        checked={fields.includes(`maritalStatus-${index}`)}
                        onChange={handleChangeFiled}
                        name={`maritalStatus-${index}`}
                        sx={{mr: 1, visibility: index === "init" ? "hidden" : ""}}
                    />
                    <Stack>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            component="p"
                            gutterBottom
                        >
                            {t("add-patient.maritalStatus")}
                        </Typography>
                        {modalData.maritalStatus ? (
                            <Typography>{modalData.maritalStatus}</Typography>
                        ) : (
                            <Typography>--</Typography>
                        )}
                    </Stack>
                </ListItem>
                <ListItem sx={{borderBottom: 1, borderColor: "divider"}}>
                    <Checkbox
                        checked={fields.includes(`address-${index}`)}
                        onChange={handleChangeFiled}
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
                        {modalData.addresses && modalData.addresses.length > 0 ? (
                            <Typography>{modalData.addresses[0].street}</Typography>
                        ) : (
                            <Typography>--</Typography>
                        )}
                    </Stack>
                </ListItem>
                <ListItem sx={{borderBottom: 1, borderColor: "divider"}}>
                    <Checkbox
                        checked={fields.includes(`insurance-${index}`)}
                        onChange={handleChangeFiled}
                        name={`insurance-${index}`}
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
                        {(modalData.insurances && modalData.insurances.length > 0) ? (
                            modalData.insurances.map((insuranceData: any, index: number) => (
                                <Typography key={index}>{insuranceData.insurance.name}</Typography>))
                        ) : (
                            <Typography>--</Typography>
                        )}
                    </Stack>
                </ListItem>
                <ListItem sx={{borderBottom: 1, borderColor: "divider"}}>
                    <Checkbox
                        checked={fields.includes(`email-${index}`)}
                        onChange={handleChangeFiled}
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
                <ListItem>
                    <Checkbox
                        checked={fields.includes(`idCard-${index}`)}
                        onChange={handleChangeFiled}
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
