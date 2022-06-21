import {FormikProvider, Form, useFormik} from "formik";
import {
    Avatar, Box, Checkbox,
    FormControl,
    FormControlLabel,
    IconButton,
    Input, InputLabel, List, ListItem, ListItemText, MenuItem,
    Radio,
    RadioGroup, Select,
    Stack, TextField,
    Typography
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import MultiSelect from "@themes/overrides/MultiSelect";
import React, {useState} from "react";
import LabelStyled from "./overrides/labelStyled";
import {CropImage} from "@features/cropImage";
import {InputStyled} from "@features/steppers";

function StepperInfo() {

    const secondarySpecialties = [
        "Spécialité  1",
        "Spécialité  2",
        "Spécialité  3",
        "Spécialité  4",
        "Spécialité  5",
        "Spécialité  6",
        "Spécialité  7",
        "Spécialité  8",
    ];
    const multipleLanguage = [
        { title: "Français" },
        { title: "Anglais" },
        { title: "Espagnol" },
        { title: "Allemand" },
        { title: "Italien" },
        { title: "Russe" },
        { title: "Japonais" },
        { title: "Chinois" },
    ];

    const formik = useFormik({
        initialValues: {
            file: null,
            person: {
                gender: "",
                profession: "",
                firstName: "",
                name: "",
            },
            specialty: "",
            secondarySpecialties: [],
            languages: [],
        },
        onSubmit: async (values) => {
            console.log(values);
        },
    });
    const { values, handleSubmit, getFieldProps, setFieldValue } = formik;
    const [open, setOpen] = useState(false);
    const handleDrop = (acceptedFiles: any) => {
        const file = acceptedFiles[0];
        setFieldValue("file", URL.createObjectURL(file));
        setOpen(true);
    };

    const handleChangeFiled = (event: React.MouseEvent<unknown>) => {
        const { name, checked } : any = event.target;
        setFieldValue(
            "secondarySpecialties",
            checked
                ? [...values.secondarySpecialties, name]
                : values.secondarySpecialties.filter((el) => el !== name)
        );
    };

    return (
      <>
          <FormikProvider value={formik}>
              <Stack
                  spacing={2}
                  component={Form}
                  autoComplete="off"
                  noValidate
                  onSubmit={handleSubmit}
              >
                  <Typography variant="h6"  gutterBottom>
                      Information personnelle
                  </Typography>
                  <Stack
                      spacing={2}
                      direction={{ xs: "column", lg: "row" }}
                      alignItems={{ xs: "center", lg: "stretch" }}
                      sx={{
                          "& > label": {
                              position: "relative",
                              zIndex: 1,
                              cursor: "pointer",
                          },
                      }}
                  >
                      <label htmlFor="contained-button-file">
                          <InputStyled
                              id="contained-button-file"
                              onChange={(e: any) => handleDrop(e.target.files)}
                              type="file"
                          />
                          <Avatar
                              src={values.file}
                              sx={{ width: 164, height: 164 }}
                              children={<IconUrl path="ic-user-profile" />}
                          />
                          <IconButton
                              color="primary"
                              type="button"
                              sx={{
                                  position: "absolute",
                                  bottom: 10,
                                  right: 10,
                                  zIndex: 1,
                                  pointerEvents: "none",
                                  bgcolor: "#fff !important",
                              }}
                          >
                              <IconUrl path="ic-return-photo" />
                          </IconButton>
                      </label>
                      <Stack
                          spacing={2}
                          sx={{
                              width: "100%",
                              "& .MuiBox-root": {
                                  width: "100%",
                              },
                          }}
                          alignSelf="stretch"
                      >
                          <Typography
                              variant="subtitle1"
                              sx={{ textAlign: { xs: "center", lg: "left" } }}
                              color="text.primary"
                              fontWeight={600}
                          >
                              Vous êtes?
                          </Typography>
                          <FormControl component="fieldset">
                              <RadioGroup
                                  row
                                  aria-label="gender"
                                  name="row-radio-buttons-group"
                                  {...getFieldProps("person.gender")}
                                  sx={{
                                      "& .MuiFormControlLabel-label": {
                                          fontSize: (theme) =>
                                              `${theme.typography.body1.fontSize} !important`,
                                      },
                                  }}
                              >
                                  <FormControlLabel
                                      value="Male"
                                      control={<Radio size="small" />}
                                      label="Homme"
                                  />
                                  <FormControlLabel
                                      value="Female"
                                      control={<Radio size="small" />}
                                      label="Femme"
                                  />
                              </RadioGroup>
                          </FormControl>
                          <Stack direction={{ xs: "column", lg: "row" }} spacing={2}>
                              <Box>
                                  <LabelStyled>Titre</LabelStyled>
                                  <FormControl fullWidth>
                                      <Select
                                          labelId="demo-simple-select-label"
                                          id={"profession"}
                                          size="small"
                                          {...getFieldProps("person.profession")}
                                          value={values.person.profession}
                                          displayEmpty={true}
                                          renderValue={(value) =>
                                              value?.length
                                                  ? Array.isArray(value)
                                                      ? value.join(", ")
                                                      : value
                                                  : "Profession"
                                          }
                                      >
                                          <MenuItem value="Professor">Professor</MenuItem>
                                          <MenuItem value="2">2</MenuItem>
                                          <MenuItem value="3">3</MenuItem>
                                      </Select>
                                  </FormControl>
                              </Box>
                              <Box>
                                  <LabelStyled>Prénom</LabelStyled>
                                  <TextField
                                      variant="outlined"
                                      placeholder=" "
                                      size="small"
                                      fullWidth
                                      {...getFieldProps("person.firstName")}
                                  />
                              </Box>
                              <Box>
                                  <LabelStyled>Nom</LabelStyled>
                                  <TextField
                                      variant="outlined"
                                      placeholder=" "
                                      size="small"
                                      fullWidth
                                      {...getFieldProps("person.name")}
                                  />
                              </Box>
                          </Stack>
                      </Stack>
                  </Stack>
                  <Box sx={{ mt: "40px !important" }}>
                      <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                          Votre spécialité
                      </Typography>
                      <FormControl fullWidth>
                          <Select
                              labelId="demo-simple-select-label"
                              id={"specialty"}
                              size="small"
                              {...getFieldProps("specialty")}
                              value={values.specialty}
                              displayEmpty={true}
                              renderValue={(value) =>
                                  value?.length
                                      ? Array.isArray(value)
                                          ? value.join(", ")
                                          : value
                                      : "Specialty"
                              }
                          >
                              <MenuItem value="Généraliste">Généraliste</MenuItem>
                              <MenuItem value="2">2</MenuItem>
                              <MenuItem value="3">3</MenuItem>
                          </Select>
                      </FormControl>
                  </Box>
                  <Box sx={{ mt: "22px !important" }}>
                      <Typography variant="subtitle1" sx={{ mb: 2 }} fontWeight={600}>
                          Spécialités secondaire
                      </Typography>
                      <List dense={true} sx={{ display: "flex", flexWrap: "wrap" }}>
                          {secondarySpecialties.map((el, index) => (
                              <ListItem
                                  key={`secondarySpecialties-${index}`}
                                  sx={{
                                      width: secondarySpecialties.length > 3 ? "50%" : "100%",
                                      px: { xs: "0", lg: "1rem" },
                                      "& label": {
                                          cursor: "pointer",
                                          display: "flex",
                                          alignItems: "center",
                                      },
                                  }}
                              >
                                  <label htmlFor={`secodary-specialties-${index}`}>
                                      <Checkbox
                                          checked={values.secondarySpecialties.includes(el)}
                                          onChange={() => handleChangeFiled}
                                          name={el}
                                          id={`secodary-specialties-${index}`}
                                      />
                                      <ListItemText primary={el} />
                                  </label>
                              </ListItem>
                          ))}
                      </List>
                  </Box>
                  <Box sx={{ mt: "40px !important" }}>
                      <Typography variant="subtitle1" sx={{ mb: 2 }} fontWeight={600}>
                          Spécialités secondaire
                      </Typography>
                      {/*<MultiSelect*/}
                      {/*    data={multipleLanguage}*/}
                      {/*    placeholder="Commencez à taper pour rechercher les langues"*/}
                      {/*    getData={(value: any) => setFieldValue("languages", value)} />*/}
                  </Box>
                  <CropImage
                      open={open}
                      img={values.file}
                      setOpen={setOpen}
                      setFieldValue={setFieldValue}
                  />
              </Stack>
          </FormikProvider>
      </>
  );
}
export default StepperInfo;
