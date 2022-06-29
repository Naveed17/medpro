import React, { ChangeEvent } from "react";
import { useTranslation } from "next-i18next";
import {
  Box,
  Typography,
  Radio,
  Checkbox,
  List,
  ListSubheader,
  ListItem,
  Stack,
} from "@mui/material";
//utils
import Icon from "@themes/urlIcon";
import { RootStyled } from "@features/duplicateDetected";

function DuplicateDetected({ ...props }) {
  const { data: modalData } = props;
  const [selectedValue, setSelectedValue] = React.useState<string>("1");
  const [fields, setFields] = React.useState<string[]>([]);
  const handleChangeColumn = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };
  const handleChangeFiled = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFields(checked ? [...fields, name] : fields.filter((el) => el !== name));
  };
  const { t, ready } = useTranslation("patient");
  if (!ready) return <>loading translations...</>;
  return (
    <RootStyled>
      <Box className="modal-body">
        <List className="list-main">
          {Array.from({ length: 3 }, (_, i) => (
            <ListItem
              key={Math.random()}
              className={`list-item ${i > 0 ? "except" + i : "first"}`}
            >
              <List className="child-list-main">
                {i > 0 ? (
                  <ListSubheader
                    disableSticky
                    disableGutters
                    className="list-subheader"
                  >
                    <Radio
                      checked={selectedValue === `${i}`}
                      onChange={handleChangeColumn}
                      value={`${i}`}
                      name={`radio-${i}`}
                    />
                    {t("add-patient.dialog.selected")}
                  </ListSubheader>
                ) : (
                  <ListSubheader
                    disableSticky
                    disableGutters
                    className="list-subheader first"
                  >
                    {t("add-patient.dialog.selected")}
                  </ListSubheader>
                )}

                <ListItem sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Checkbox
                    checked={fields.includes(`gender-${i}`)}
                    onChange={handleChangeFiled}
                    name={`gender-${i}`}
                    sx={{ mr: 1 }}
                  />
                  <Stack>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="p"
                      gutterBottom
                    >
                      {t("filter.gender")}
                    </Typography>
                    {modalData.gender === "" ? (
                      <Typography>--</Typography>
                    ) : (
                      <Typography sx={{ textTransform: "capitalize" }}>
                        {modalData.gender}
                      </Typography>
                    )}
                  </Stack>
                </ListItem>
                <ListItem sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Checkbox
                    checked={fields.includes(`name-${i}`)}
                    onChange={handleChangeFiled}
                    name={`name-${i}`}
                    sx={{ mr: 1 }}
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
                    <Typography sx={{ textTransform: "capitalize" }}>
                      {modalData.name}
                    </Typography>
                  </Stack>
                </ListItem>
                <ListItem sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Checkbox
                    checked={fields.includes(`firstName-${i}`)}
                    onChange={handleChangeFiled}
                    name={`firstName-${i}`}
                    sx={{ mr: 1 }}
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
                    <Typography sx={{ textTransform: "capitalize" }}>
                      {modalData.firstName}
                    </Typography>
                  </Stack>
                </ListItem>
                <ListItem
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    bgcolor: (theme) => theme.palette.error.lighter,
                    "& .react-svg": { ml: "auto" },
                  }}
                >
                  <Checkbox
                    checked={fields.includes(`dob-${i}`)}
                    onChange={handleChangeFiled}
                    name={`dob-${i}`}
                    sx={{ mr: 1 }}
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
                      {modalData.dob.day}/{modalData.dob.month}/
                      {modalData.dob.year}
                    </Typography>
                  </Stack>
                  <Icon path="danger" />
                </ListItem>
                <ListItem sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Checkbox
                    checked={fields.includes(`phone-${i}`)}
                    onChange={handleChangeFiled}
                    name={`phone-${i}`}
                    sx={{ mr: 1 }}
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
                    <Typography>{modalData.phone}</Typography>
                  </Stack>
                </ListItem>
                <ListItem sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Checkbox
                    checked={fields.includes(`region-${i}`)}
                    onChange={handleChangeFiled}
                    name={`region-${i}`}
                    sx={{ mr: 1 }}
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
                    {modalData.region === "" ? (
                      <Typography>--</Typography>
                    ) : (
                      <Typography>{modalData.region}</Typography>
                    )}
                  </Stack>
                </ListItem>
                <ListItem sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Checkbox
                    checked={fields.includes(`address-${i}`)}
                    onChange={handleChangeFiled}
                    name={`address-${i}`}
                    sx={{ mr: 1 }}
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
                    {modalData.address === "" ? (
                      <Typography>--</Typography>
                    ) : (
                      <Typography>{modalData.address}</Typography>
                    )}
                  </Stack>
                </ListItem>
                <ListItem sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Checkbox
                    checked={fields.includes(`insurance-${i}`)}
                    onChange={handleChangeFiled}
                    name={`insurance-${i}`}
                    sx={{ mr: 1 }}
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
                <ListItem sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Checkbox
                    checked={fields.includes(`email-${i}`)}
                    onChange={handleChangeFiled}
                    name={`email-${i}`}
                    sx={{ mr: 1 }}
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
                    checked={fields.includes(`cin-${i}`)}
                    onChange={handleChangeFiled}
                    name={`cin-${i}`}
                    sx={{ mr: 1 }}
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
                    {modalData.cin === "" ? (
                      <Typography>--</Typography>
                    ) : (
                      <Typography>{modalData.cin}</Typography>
                    )}
                  </Stack>
                </ListItem>
              </List>
            </ListItem>
          ))}
        </List>
      </Box>
    </RootStyled>
  );
}
export default DuplicateDetected;
