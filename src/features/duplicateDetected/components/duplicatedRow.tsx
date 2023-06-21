import {Checkbox, List, ListItem, ListSubheader, Stack, Typography} from "@mui/material";
import Icon from "@themes/urlIcon";
import React from "react";

function DuplicatedRow({...props}) {
    const {modalData, index, t, fields, handleChangeFiled} = props;

    return (
        <ListItem
            key={Math.random()}
            className={`list-item ${index !== "init" ? "except" + index : "first"}`}
        >
            <List className="child-list-main">
                <ListSubheader
                    disableSticky
                    disableGutters
                    className={`list-subheader ${index === "init" ? "first" : ""}`}
                >
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
                        {modalData.firstname ? (
                            <Typography sx={{textTransform: "capitalize"}}>
                                {modalData.firstname}
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
                        {modalData.lastname ? (
                            <Typography sx={{textTransform: "capitalize"}}>
                                {modalData.lastname}
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
                        {modalData.birthday ? (
                            <Typography>
                                {modalData.birthday.date.split(" ")[0]}
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
                        {modalData.contact ? (
                            <Typography>{modalData.contact}</Typography>
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
                        {modalData.address ? (
                            <Typography>{modalData.address}</Typography>
                        ) : (
                            <Typography>--</Typography>
                        )}
                    </Stack>
                </ListItem>
                <ListItem sx={{borderBottom: 1, borderColor: "divider"}}>
                    <Checkbox
                        checked={fields.includes(`city-${index}`)}
                        onChange={handleChangeFiled}
                        name={`city-${index}`}
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
                            {t("add-patient.region")}
                        </Typography>
                        {modalData.city ? (
                            <Typography>{modalData.city}</Typography>
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
                            gutterBottom
                        >
                            {t("add-patient.assurance")}
                        </Typography>
                        {modalData.insurance ? (
                            <Typography>{modalData.insurance.insuranceNumber}</Typography>
                            /*modalData.insurance?.map(
                                (assurance: { name: string; number: number }) => (
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        key={Math.random()}
                                    >
                                        <Typography>{assurance.name}</Typography>:
                                        <Typography>{assurance.insuranceNumber}</Typography>
                                    </Stack>
                                )
                            )*/
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
