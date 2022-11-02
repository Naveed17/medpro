import { Box, Typography, Paper, TextField } from "@mui/material";
import { Select } from "@features/forms";
import RootStyled from "./overrides/rootStyle";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];
function PractitionerForm({ ...props }) {
  const { t, formik } = props;
  const { values, getFieldProps, setFieldValue } = formik;
  const { practitioner } = values;

  return (
    <RootStyled>
      <Typography variant="body2" mb={1} mt={2}>
        {t("practitioner")}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Typography
            sx={{ minWidth: 140, textAlign: "right" }}
            mr={2}
            variant="caption"
            color="text.secondary">
            {t("practitionerSpecialty")}
          </Typography>
          <Select
            value={practitioner.specialty}
            placeholder={t("placeholderSpecialty")}
            list={names}
            getData={(v: any) => setFieldValue("practitioner.specialty", v)}
          />
        </Box>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Typography
            sx={{ minWidth: 140, textAlign: "right" }}
            mr={2}
            variant="caption"
            color="text.secondary">
            {t("practitioner")}
          </Typography>
          <Select
            placeholder={t("selectPractitioner")}
            value={practitioner.practitioner}
            list={names}
            getData={(v: any) => setFieldValue("practitioner.practitioner", v)}
          />
        </Box>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Typography
            sx={{ minWidth: 140, textAlign: "right" }}
            mr={2}
            variant="caption"
            color="text.secondary">
            {t("location")}
          </Typography>
          <Select
            placeholder={t("placeOfConsultation")}
            value={practitioner.location}
            list={names}
            getData={(v: any) => setFieldValue("practitioner.location", v)}
          />
        </Box>

        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Typography
            sx={{ minWidth: 140, textAlign: "right" }}
            mr="14.5px"
            variant="caption"
            color="text.secondary">
            {t("patientBase")}
          </Typography>
          <TextField
            {...getFieldProps("practitioner.patientBase")}
            variant="outlined"
            size="small"
            fullWidth
            placeholder={t("placeholderPatientBase")}
          />
        </Box>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "9.5px" }}>
          <Typography
            sx={{ minWidth: 132, width: 132, textAlign: "right" }}
            mr="14.5px"
            variant="caption"
          />
        </Box>
      </Paper>
      <Typography variant="body2" mb={1} mt={4}>
        {t("agenda")}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Typography
            sx={{ minWidth: 140, textAlign: "right" }}
            mr="14.5px"
            variant="caption"
            color="text.secondary">
            {t("name")}
          </Typography>
          <TextField
            {...getFieldProps("practitioner.agenda")}
            variant="outlined"
            size="small"
            fullWidth
            placeholder={t("placeholderName")}
          />
        </Box>
      </Paper>
      <Typography variant="body2" mb={1} mt={4}>
        {t("rightsOfAgenda")}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Typography
            sx={{ maxWidth: { lg: 140, xs: "100%" }, width: "100%" }}
            mr="14.5px"
            variant="caption"
            color="text.secondary">
            {t("clone_existing_rights")}
          </Typography>
          <Select
            placeholder={t("clone_existing_rights_placeholder")}
            value={practitioner.rightsOnAgenda.cloneExistingRights}
            list={names}
            getData={(v: any) =>
              setFieldValue(
                "practitioner.rightsOnAgenda.cloneExistingRights",
                v
              )
            }
          />
        </Box>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Box
            sx={{ maxWidth: { lg: 140, xs: "100%" }, width: "100%" }}
            mr="14.5px">
            <FormControlLabel
              control={
                <Switch
                  {...getFieldProps(
                    "practitioner.rightsOnAgenda.lamiaBarnat.status"
                  )}
                  checked={practitioner.rightsOnAgenda.lamiaBarnat.status}
                />
              }
              label={t("lamia_barnat")}
            />
          </Box>
          <Select
            placeholder={t("no_access")}
            list={names}
            value={practitioner.rightsOnAgenda.lamiaBarnat.value}
            getData={(v: any) =>
              setFieldValue("practitioner.rightsOnAgenda.lamiaBarnat.value", v)
            }
          />
        </Box>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Box
            sx={{ maxWidth: { lg: 140, xs: "100%" }, width: "100%" }}
            mr="14.5px">
            <FormControlLabel
              control={
                <Switch
                  {...getFieldProps(
                    "practitioner.rightsOnAgenda.medicalSecretary.status"
                  )}
                  checked={practitioner.rightsOnAgenda.medicalSecretary.status}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label={t("medical_secretary")}
            />
          </Box>
          <Select
            placeholder={t("no_access")}
            list={names}
            value={practitioner.rightsOnAgenda.medicalSecretary.value}
            getData={(v: any) =>
              setFieldValue(
                "practitioner.rightsOnAgenda.medicalSecretary.value",
                v
              )
            }
          />
        </Box>
        <Box
          className="form-label-main"
          sx={{ display: "flex", alignItems: "center", mb: "1.25rem" }}>
          <Box
            sx={{ maxWidth: { lg: 140, xs: "100%" }, width: "100%" }}
            mr="14.5px">
            <FormControlLabel
              control={
                <Switch
                  {...getFieldProps(
                    "practitioner.rightsOnAgenda.aliTounsi.status"
                  )}
                  checked={practitioner.rightsOnAgenda.aliTounsi.status}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="Ali Tounsi"
            />
          </Box>
          <Select
            placeholder={t("no_access")}
            value={practitioner.rightsOnAgenda.aliTounsi.value}
            list={names}
            getData={(v: any) =>
              setFieldValue("practitioner.rightsOnAgenda.aliTounsi.value", v)
            }
          />
        </Box>
      </Paper>
    </RootStyled>
  );
}

export default PractitionerForm;
