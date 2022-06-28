import React, { ChangeEvent } from "react";
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
import { styled } from "@mui/material/styles";
//utils
import Icon from "@themes/urlIcon";

const Modal = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    width: 890,
  },
  "& .modal-header": {
    backgroundColor: theme.palette.primary.main,
    padding: "1rem" + " " + "2rem",
    "& h6": {
      fontWeight: theme.typography.fontWeightMedium,
      color: theme.palette.common.white,
    },
  },
  "& .modal-body": {
    minHeight: "13.5rem",
    overflow: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    [theme.breakpoints.down("sm")]: {
      maxHeight: "100%",
      "& > .MuiList-root": {
        borderLeft: "none",
      },
    },
  },
}));
export default function DuplicateDetected(props: any) {
  const modalData = props.data;
  const [selectedValue, setSelectedValue] = React.useState<string>("1");
  const [fields, setFields] = React.useState<string[]>([]);
  const handleChangeColumn = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };
  const handleChangeFiled = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFields(checked ? [...fields, name] : fields.filter((el) => el !== name));
  };
  const isMatch = true;
  return (
    <Modal>
      <Box className="modal-body">
        <List
          sx={{
            display: "inline-flex",
            py: 0,
            px: 0,
            border: 1,
            borderColor: "divider",
            borderRadius: 0.7,
            overflow: "hidden",
          }}
        >
          <ListItem
            sx={{
              width: 262,
              py: 0,
              px: 0,
              display: {
                md: "block",
                xs: "none",
              },
            }}
          >
            <List
              sx={{
                py: 0,
                width: "100%",
                bgcolor: (theme) => theme.palette.background.default,
                "& li": { px: 1 },
              }}
            >
              <ListSubheader
                disableSticky
                disableGutters
                sx={{
                  display: "flex",
                  lineHeight: "80%",
                  alignItems: "center",
                  bgcolor: (theme) => theme.palette.primary.main,
                  px: "1rem",
                  py: "1rem",
                  color: (theme) => theme.palette.common.white,
                  fontWeight: (theme) => "normal",
                  fontFamily: "Roboto",
                }}
              >
                Patient selected
              </ListSubheader>
              <ListItem
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="p"
                  gutterBottom
                >
                  gender
                </Typography>
                {modalData.gender === "" ? (
                  <Typography>--</Typography>
                ) : (
                  <Typography sx={{ textTransform: "capitalize" }}>
                    {modalData.gender}
                  </Typography>
                )}
              </ListItem>
              <ListItem
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="p"
                  gutterBottom
                >
                  Name
                </Typography>
                <Typography sx={{ textTransform: "capitalize" }}>
                  {modalData.name}
                </Typography>
              </ListItem>
              <ListItem
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="p"
                  gutterBottom
                >
                  First name
                </Typography>
                <Typography sx={{ textTransform: "capitalize" }}>
                  {modalData.firstName}
                </Typography>
              </ListItem>
              <ListItem
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="p"
                  gutterBottom
                >
                  Date of Birth
                </Typography>
                <Typography>
                  {modalData.dob.day}/{modalData.dob.month}/{modalData.dob.year}
                </Typography>
              </ListItem>
              <ListItem
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="p"
                  gutterBottom
                >
                  Phone number
                </Typography>
                <Typography>{modalData.phone}</Typography>
              </ListItem>
              <ListItem
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="p"
                  gutterBottom
                >
                  Region
                </Typography>
                <Typography sx={{ textTransform: "capitalize" }}>
                  {modalData.region}
                </Typography>
              </ListItem>
              <ListItem
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="p"
                  gutterBottom
                >
                  Adresse
                </Typography>
                {modalData.address === "" ? (
                  <Typography>--</Typography>
                ) : (
                  <Typography>{modalData.address}</Typography>
                )}
              </ListItem>
              <ListItem
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="p"
                  gutterBottom
                >
                  Assurance
                </Typography>
                {modalData.insurance?.length > 0 ? (
                  modalData.insurance?.map(
                    (
                      assurance: {
                        name: string;
                        number: number;
                      },
                      index: number
                    ) => (
                      <Stack direction="row" spacing={1} key={index + 10}>
                        <Typography>{assurance.name}</Typography>:
                        <Typography>{assurance.number}</Typography>
                      </Stack>
                    )
                  )
                ) : (
                  <Typography>--</Typography>
                )}
              </ListItem>
              <ListItem
                sx={{
                  flexDirection: "column",
                  alignItems: "flex-start",
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="p"
                  gutterBottom
                >
                  Email
                </Typography>
                {modalData.email === "" ? (
                  <Typography>--</Typography>
                ) : (
                  <Typography>{modalData.email}</Typography>
                )}
              </ListItem>
              <ListItem
                sx={{ flexDirection: "column", alignItems: "flex-start" }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="p"
                  gutterBottom
                >
                  CIN
                </Typography>
                {modalData.cin === "" ? (
                  <Typography>--</Typography>
                ) : (
                  <Typography>{modalData.cin}</Typography>
                )}
              </ListItem>
            </List>
          </ListItem>
          {Array.from({ length: 2 }, (_, i) => (
            <ListItem
              sx={{
                width: 262,
                py: 0,
                px: 0,
                borderLeft: 1,
                borderColor: "divider",
                alignItems: "flex-start",
              }}
            >
              <List sx={{ py: 0, width: "100%", "& li": { pl: 0, pr: 1 } }}>
                <ListSubheader
                  disableSticky
                  disableGutters
                  sx={{
                    display: "flex",
                    lineHeight: "80%",
                    alignItems: "center",
                    color: "text.primary",
                    bgcolor: (theme) => theme.palette.background.default,
                    px: "1rem",
                    py: "3px",
                    fontWeight: (theme) => "normal",
                    fontFamily: "Roboto",
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <Radio
                    checked={selectedValue === `${i}`}
                    onChange={handleChangeColumn}
                    value={`${i}`}
                    name={`radio-${i}`}
                  />
                  Patient selected
                </ListSubheader>
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
                      gender
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
                      Name
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
                      First name
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
                    ...(isMatch && {
                      bgcolor: (theme) => theme.palette.error.lighter,
                    }),
                    ...(isMatch && { "& .react-svg": { ml: "auto" } }),
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
                      Date of Birth
                    </Typography>
                    <Typography>
                      {modalData.dob.day}/{modalData.dob.month}/
                      {modalData.dob.year}
                    </Typography>
                  </Stack>
                  {isMatch && <Icon path="danger" />}
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
                      Phone number
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
                    >
                      Region
                    </Typography>
                    <Typography sx={{ textTransform: "capitalize" }}>
                      {modalData.region}
                    </Typography>
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
                      Adresse
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
                      Assurance
                    </Typography>
                    {modalData.insurance?.length > 0 ? (
                      modalData.insurance?.map(
                        (
                          assurance: {
                            name: string;
                            number: number;
                          },
                          index: number
                        ) => (
                          <Stack direction="row" spacing={1} key={index + 30}>
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
                      Email
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
                      CIN
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
    </Modal>
  );
}
