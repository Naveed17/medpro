import {
  Typography,
  Chip,
  CardContent,
  Stack,
  Box,
  Theme,
  useTheme,
  PaletteColor,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useState } from "react";
import ImportDataMobileCardStyled from "./overrides/importDataMobileCardStyle";
import { OverridableStringUnion } from "@mui/types";
import { ChipPropsColorOverrides } from "@mui/material/Chip/Chip";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ErrorIcon from "@mui/icons-material/Error";
import HelpIcon from "@mui/icons-material/Help";
import IconUrl from "@themes/urlIcon";
import { useRequestMutation } from "@app/axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
type ChipColors = OverridableStringUnion<
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning",
  ChipPropsColorOverrides
>;
function ImportDataMobileCard({ ...props }) {
  const { t, data, handleEvent } = props;
  const theme = useTheme();
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [expandType, setExpandType] = useState("");
  const [expandData, setExpandData] = useState([]);
  const { data: session } = useSession();
  const { data: user } = session as Session;
  const medical_entity = (user as UserDataResponse)
    .medical_entity as MedicalEntityModel;
  const { trigger: triggerImportDataDetail } = useRequestMutation(
    null,
    "/import/data/detail"
  );
  const getDetailImportData = (uuid: string, type: string) => {
    setExpandType(type);
    triggerImportDataDetail({
      method: "GET",
      url: `/api/medical-entity/${medical_entity.uuid}/import/data/${uuid}/${type}/${router.locale}?page=1&limit=10`,
      headers: { Authorization: `Bearer ${session?.accessToken}` },
    }).then((value: any) => {
      const { data } = value?.data;
      if (value?.data.status === "success") {
        setExpandData(data.list);
      }
    });
  };
  const status = ["progress", "success", "error", "failed", "deleted"];
  const colors: ChipColors[] = ["warning", "success", "error", "error", "info"];
  return (
    <ImportDataMobileCardStyled
      sx={{
        borderLeft: `6px solid ${
          (
            theme?.palette[
              colors[data.status] as keyof typeof theme.palette
            ] as PaletteColor
          ).main
        }`,
      }}>
      <CardContent>
        <Stack spacing={2} alignItems="flex-start">
          <Chip
            color={colors[data.status]}
            label={`${t("tabs." + status[data.status])}`}
          />
          <Stack
            direction="row"
            width={1}
            justifyContent="space-between"
            alignItems="center">
            <Stack direction={"row"} alignItems={"center"}>
              {(data.errors !== 0 ||
                data.duplication !== 0 ||
                data.info !== 0) &&
                (expanded ? (
                  <RemoveIcon className={"expand-icon"} />
                ) : (
                  <AddIcon className={"expand-icon"} />
                ))}
              <Stack
                className="date-sec"
                direction="row"
                spacing={1}
                alignItems="center">
                <IconUrl path="ic-agenda" />
                <Typography variant="body2" fontWeight={500}>
                  {data.date}
                </Typography>
              </Stack>

              {data.errors > 0 && (
                <Chip
                  onClick={() => {
                    if (!expanded) {
                      getDetailImportData(data.uuid, "2");
                    }
                    setExpanded(!expanded);
                  }}
                  sx={{ marginLeft: 1, height: 26 }}
                  color={"error"}
                  icon={<IconUrl color={"black"} path={"danger"} />}
                  label={`${data.errors} ${t("error.title")}`}
                />
              )}

              {data.duplication > 0 && (
                <Chip
                  onClick={() => {
                    if (!expanded) {
                      getDetailImportData(data.uuid, "1");
                    }
                    setExpanded(!expanded);
                  }}
                  sx={{ marginLeft: 1, height: 26 }}
                  color={"warning"}
                  icon={<ErrorIcon />}
                  label={`${data.duplication} ${t("error.warning-title")}`}
                />
              )}

              {data.info > 0 && (
                <Chip
                  onClick={() => {
                    if (!expanded) {
                      getDetailImportData(data.uuid, "3");
                    }
                    setExpanded(!expanded);
                  }}
                  sx={{ marginLeft: 1, height: 26 }}
                  color={"info"}
                  icon={<HelpIcon color={"inherit"} />}
                  label={`${data.info} ${t("error.info-title")}`}
                />
              )}
            </Stack>

            {(() => {
              switch (data.method) {
                case "med-win":
                  return (
                    <Box
                      m={"auto"}
                      width={44}
                      height={14}
                      component="img"
                      src={"/static/img/logo-wide.png"}
                    />
                  );
                case "med-pro":
                  return (
                    <IconUrl
                      className={"source-icon"}
                      width={"20"}
                      height={"20"}
                      path={"Med-logo_"}
                    />
                  );
                case "med-link":
                  return (
                    <IconUrl
                      className={"source-icon"}
                      width={"20"}
                      height={"20"}
                      path={"ic-upload"}
                    />
                  );
              }
            })()}
            {data.status == 1 || data.status == 3 ? (
              <LoadingButton
                onClick={() => {
                  setLoadingAction(true);
                  handleEvent("delete-import", data.uuid);
                }}
                variant="text"
                size="small"
                color="error"
                startIcon={<RestartAltIcon />}
                sx={{ mr: 1 }}>
                {t("table.reset")}
              </LoadingButton>
            ) : (
              <Box width={120} />
            )}
          </Stack>
        </Stack>
      </CardContent>
    </ImportDataMobileCardStyled>
  );
}
export default ImportDataMobileCard;