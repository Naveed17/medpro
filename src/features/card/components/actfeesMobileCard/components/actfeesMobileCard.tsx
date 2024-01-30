import React, { useState, useEffect } from "react";
import ActFeesCardStyled from "./overrides/actfeesCardStyle";
import {
  CardContent,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  Grid,
  IconButton,
  Collapse,
  Paper,
  Tooltip,
  Button,
  Badge,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import IconUrl from "@themes/urlIcon";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { DefaultCountry } from "@lib/constants";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Label } from "@features/label";
function ActfeesMobileCard({ ...props }) {
  const { data, editMotif, t, handleSelected, handleEvent, theme } = props;
  const [fees, setFees] = useState("");
  const [name, setName] = useState("");
  const [edit, setEdit] = useState("");
  const [code, setCode] = useState("");
  const [contribution, setContribution] = useState("");
  const [collapse, setCollapse] = useState(false);
  useEffect(() => {
    setFees(data?.fees);
    setName(data?.act?.name);
  }, [data]);

  const { data: session } = useSession();
  const { data: user } = session as Session;

  const medical_entity = (user as UserDataResponse)
      .medical_entity as MedicalEntityModel;
  const doctor_country = medical_entity.country
      ? medical_entity.country
      : DefaultCountry;
  const devise = doctor_country.currency?.name;
  return (
      <>
        <ActFeesCardStyled
            {...(collapse && {
              sx: {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              },
            })}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton
                  onClick={() => setCollapse(!collapse)}
                  sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 0.7,
                    width: 27,
                    height: 27,
                    ".react-svg div": {
                      display: "flex",
                    },
                  }}
              >
                <IconUrl path="ic-expand" />
              </IconButton>
              {edit === data?.uuid && !data?.act.isVerified ? (
                  <TextField
                      placeholder={"--"}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        data.act.name = e.target.value;
                      }}
                  />
              ) : (
                  <Typography color="text.secondary" fontWeight={600}>
                    {data?.act?.name}
                  </Typography>
              )}
              <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  className="actions"
              >
                <Badge badgeContent={10} color="primary">
                  <Tooltip title={t("table.btn_action_text")}>
                    <IconButton
                        sx={{
                          backgroundColor: theme.palette.grey["A500"],
                          ".react-svg div": {
                            display: "flex",
                          },
                          p: 1,
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 0.7,
                        }}
                        onClick={(e) =>
                            handleEvent({
                              data,
                              event: e,
                              action: "OPEN-AGREEMENT-DIALOG",
                            })
                        }
                        className="btn-action"
                    >
                      <IconUrl path="ic-plus" width={12} height={12} />
                    </IconButton>
                  </Tooltip>
                </Badge>

                <IconButton
                    size="small"
                    onClick={(e) =>
                        handleEvent({ data, event: e, action: "OPEN-POPOVER" })
                    }
                    className="btn-more"
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1} mt={2}>
              {edit === data?.uuid ? (
                  <TextField
                      fullWidth
                      sx={{ mr: 1 }}
                      placeholder={"--"}
                      value={fees}
                      onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                          setFees(e.target.value);
                          data.fees = Number(e.target.value);
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">{devise}</InputAdornment>
                        ),
                        style: { backgroundColor: "white" },
                        inputProps: { min: 0 },
                      }}
                  />
              ) : (
                  <Label color="error" variant="filled">
                    {t("table.amount")}{" "}
                    {data?.fees ? (
                        <>
                          {data?.fees} <span style={{ marginLeft: 4 }}>{devise}</span>
                        </>
                    ) : (
                        <>0 {devise}</>
                    )}
                  </Label>
              )}
              {edit === data?.uuid ? (
                  <TextField
                      placeholder={"--"}
                      value={code}
                      onChange={(e) => {
                        if (e.target.value) {
                          setCode(e.target.value);
                          data.code = e.target.value;
                        }
                      }}
                      InputProps={{
                        style: { backgroundColor: "white" },
                        inputProps: { min: 0 },
                      }}
                  />
              ) : (
                  <Label color="success" variant="filled">
                    {t("table.code")} {data?.code ? data?.code : <>Nil</>}
                  </Label>
              )}
              {edit === data?.uuid ? (
                  <TextField
                      placeholder={"--"}
                      value={contribution}
                      onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                          setContribution(e.target.value);
                          data.contribution = Number(e.target.value);
                        }
                      }}
                      InputProps={{
                        style: { backgroundColor: "white" },
                        inputProps: { min: 0 },
                      }}
                  />
              ) : (
                  <Label color="warning" variant="filled">
                    {t("table.contribution")}{" "}
                    {data?.contribution ? <>{data?.contribution}</> : <>Nil</>}
                  </Label>
              )}
            </Stack>
          </CardContent>
        </ActFeesCardStyled>
        <Collapse in={collapse}>
          <Paper
              sx={{
                p: 1,
                mt: -0.5,
                bgcolor: "background.default",
                ...(collapse && {
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  borderTop: "none",
                }),
              }}
          >
            <Stack spacing={1}>
              <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent={"space-between"}
              >
                <Typography fontWeight={700}>Nom d’assurance</Typography>
                <IconButton
                    size="small"
                    onClick={(e) =>
                        handleEvent({ data, event: e, action: "OPEN-POPOVER-CHILD" })
                    }
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 0.7,
                    }}
                    className="btn-more"
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Tooltip title={t("table.exp_date")}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <IconUrl
                        path="ic-agenda"
                        height={11}
                        width={11}
                        color={theme.palette.text.primary}
                    />
                    <Typography variant="body2" color={theme.palette.grey[500]}>
                      03/12/2023
                    </Typography>
                  </Stack>
                </Tooltip>
                <Tooltip title={t("table.type")}>
                  <Typography textAlign="center" color={theme.palette.grey[500]}>
                    Nature
                  </Typography>
                </Tooltip>
                <Label color="primary" variant="filled">
                  {t("table.mtt")} 0 {devise}
                </Label>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Label color="warning" variant="filled">
                  {t("table.tax")} 0%
                </Label>
                <Label color="success" variant="filled">
                  {t("table.remb")} 0 {devise}
                </Label>
                <Label color="error" variant="filled">
                  {t("table.tax_remb")} 0%
                </Label>
              </Stack>
            </Stack>
          </Paper>
        </Collapse>
      </>
  );
}

export default ActfeesMobileCard;
