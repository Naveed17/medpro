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
                                {modalData.gender}
                            </Typography>
                        )}
                    </Stack>
                </ListItem>
                <ListItem sx={{borderBottom: 1, borderColor: "divider"}}>
                    <Checkbox
                        checked={fields.includes(`firstName-${index}`)}
                        onChange={handleChangeFiled}
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
                        <Typography sx={{textTransform: "capitalize"}}>
                            {modalData.firstName}
                        </Typography>
                    </Stack>
                </ListItem>
                <ListItem sx={{borderBottom: 1, borderColor: "divider"}}>
                    <Checkbox
                        checked={fields.includes(`lastName-${index}`)}
                        onChange={handleChangeFiled}
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
                        <Typography sx={{textTransform: "capitalize"}}>
                            {modalData.lastName}
                        </Typography>
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
                        checked={fields.includes(`birthdate-${index}`)}
                        onChange={handleChangeFiled}
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
                        <Typography>
                            {modalData.birthdate}
                        </Typography>
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
                        <Typography>{modalData.contact[0].value}</Typography>
                    </Stack>
                </ListItem>
                <ListItem sx={{borderBottom: 1, borderColor: "divider"}}>
                    <Checkbox
                        checked={fields.includes(`region-${index}`)}
                        onChange={handleChangeFiled}
                        name={`region-${index}`}
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
                        {modalData.address.length === 0 ? (
                            <Typography>--</Typography>
                        ) : (
                            <Typography>{modalData.address}</Typography>
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
                        >
                            {t("add-patient.address")}
                        </Typography>
                        {modalData.address.length === 0 ? (
                            <Typography>--</Typography>
                        ) : (
                            <Typography>{modalData.address}</Typography>
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
                        {modalData.insurance?.length > 0 ? (
                            modalData.insurance?.map(
                                (assurance: { name: string; number: number }) => (
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        key={Math.random()}
                                    >
                                        <Typography>{assurance.name}</Typography>:
                                        <Typography>{assurance.number}</Typography>
                                    </Stack>
                                )
                            )
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
                        {modalData.email === "" ? (
                            <Typography>--</Typography>
                        ) : (
                            <Typography>{modalData.email}</Typography>
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
                        {modalData.idCard === "" ? (
                            <Typography>--</Typography>
                        ) : (
                            <Typography>{modalData.idCard}</Typography>
                        )}
                    </Stack>
                </ListItem>
            </List>
        </ListItem>
    )
}

export default DuplicatedRow;
