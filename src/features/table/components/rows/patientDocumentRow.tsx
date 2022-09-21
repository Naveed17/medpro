import { useState } from "react";

// Material
import {
  TableCell,
  Stack,
  IconButton,
  Checkbox,
  Button,
  Typography,
  Avatar,
  Box,
  Link,
  useMediaQuery,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

// components
import { Popover } from "@features/popover";
import Icon from "@themes/urlIcon";
import { TableRowStyled } from "@features/table";

// menu data
const menuList = [
  {
    title: "Patient Details",
    icon: <CheckRoundedIcon />,
    action: "onOpenPatientDrawer",
  },
  {
    title: "Edit Patient",
    icon: <CheckRoundedIcon />,
    action: "onOpenEditPatient",
  },
  {
    title: "Cancel",
    icon: <CheckRoundedIcon />,
    action: "onCancel",
  },
];

export default function EnhancedTable({ ...props }) {
  const { checkedType, t, row } = props;

  // useState tooltip
  const [openTooltip, setOpenTooltip] = useState(false);

  // query for mobile view
  const isMobile = useMediaQuery("(max-width:600px)");

  // Avoid a layout jump when reaching the last page with empty rows.
  return (
    <>
      <TableRowStyled key={row.id} className="document-row">
        {!isMobile ? (
          <>
            <TableCell>
              <Stack spacing={1} direction="row" alignItems="center">
                <Checkbox
                  checked={checkedType.some(
                    (item: PatientDocuments) => item.type === row.type
                  )}
                  inputProps={{ "aria-label": "controlled" }}
                />
                <Icon
                  path={
                    (row.type === "orders" && "ic-traitement") ||
                    (row.type === "analysis"&&"requested-analysis" && "ic-analyse") ||
                    (row.type === "report" && "ic-lettre") ||
                    (row.type === "prescription" && "ic-ordonance") ||
                    ""
                  }
                />
                <Box>
                  <Typography color="text.primary" fontWeight={400}>
                    {row?.name}
                  </Typography>
                  <Stack spacing={1} direction="row">
                    {row?.firstName && row?.lastName && (
                      <>
                        <Avatar
                          {...(row.img
                            ? {
                                src: row.img,
                                alt: "",
                                sx: { bgcolor: "transparent" },
                              }
                            : {
                                children: (
                                  <span>
                                    {row?.firstName?.slice(0, 1)}{" "}
                                    {row?.lastName?.slice(0, 1)}
                                  </span>
                                ),
                              })}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={400}
                        >
                          {row?.firstName} {row?.lastName}
                        </Typography>
                      </>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </TableCell>
            <TableCell align="center">{row.createdAt}</TableCell>
            <TableCell align="left">
              {row.createdBy === "Interne" ? (
                <Typography color="text.secondary" fontWeight={400}>
                  {row.createdBy}
                </Typography>
              ) : (
                <>
                  <Link underline="none" href={`/profile/${row.createdBy}`}>
                    {row.createdBy}
                  </Link>
                  <Typography
                    fontSize={10}
                    color="text.secondary"
                    fontWeight={400}
                  >
                    {row?.specialist}
                  </Typography>
                </>
              )}
            </TableCell>
            <TableCell align="right">
              <Stack
                spacing={1}
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
              >
                <Button startIcon={<Icon path={"ic-voir"} />}>
                  {t("table.see")}
                </Button>
                <Popover
                  open={openTooltip}
                  handleClose={() => setOpenTooltip(false)}
                  menuList={menuList}
                  onClickItem={(v: string) => console.log(v, "popover event")}
                  button={
                    <IconButton
                      onClick={() => {
                        setOpenTooltip(true);
                      }}
                      sx={{ display: "block", ml: "auto" }}
                      size="small"
                    >
                      <Icon path="more-vert" />
                    </IconButton>
                  }
                />
              </Stack>
            </TableCell>
          </>
        ) : (
          <>
            <TableCell>
              <Stack direction="row" alignItems="center">
                {/* <Icon
                  path={
                    (row.type === "orders" && "ic-traitement") ||
                    (row.type === "analysis" && "ic-analyse") ||
                    (row.type === "report" && "ic-lettre") ||
                    (row.type === "prescription" && "ic-ordonance") ||
                    ""
                  }
                /> */}
                <Box>
                  <Typography color="text.primary" fontWeight={400}>
                    {row?.name}
                  </Typography>
                  <Stack spacing={1} direction="row" alignItems="center">
                    {row?.firstName && row?.lastName && (
                      <>
                        <Avatar
                          {...(row.img
                            ? {
                                src: row.img,
                                alt: "",
                                sx: { bgcolor: "transparent" },
                              }
                            : {
                                children: (
                                  <span>
                                    {row?.firstName?.slice(0, 1)}{" "}
                                    {row?.lastName?.slice(0, 1)}
                                  </span>
                                ),
                              })}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight={400}
                        >
                          {row?.firstName} {row?.lastName}
                        </Typography>
                      </>
                    )}
                  </Stack>
                </Box>
              </Stack>
              <Stack mt={1}>
                <Stack spacing={1} direction="row">
                  <Icon path="ic-agenda-jour" />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={400}
                  >
                    {row.createdAt}
                  </Typography>
                </Stack>
                {row.createdBy === "Interne" ? (
                  <Typography color="text.secondary" fontWeight={400}>
                    {row.createdBy}
                  </Typography>
                ) : (
                  <>
                    <Link underline="none" href={`/profile/${row.createdBy}`}>
                      {row.createdBy}
                    </Link>
                    <Typography
                      fontSize={10}
                      color="text.secondary"
                      fontWeight={400}
                    >
                      {row?.specialist}
                    </Typography>
                  </>
                )}
              </Stack>
            </TableCell>
            <TableCell align="right">
              <Stack
                spacing={1}
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
              >
                <IconButton
                  sx={{
                    "& svg path": {
                      fill: (theme) => theme.palette.text.primary,
                    },
                  }}
                >
                  <Icon path={"ic-voir"} />
                </IconButton>

                <Popover
                  open={openTooltip}
                  handleClose={() => setOpenTooltip(false)}
                  menuList={menuList}
                  onClickItem={(v: string) => console.log(v, "popover event")}
                  button={
                    <IconButton
                      onClick={() => {
                        setOpenTooltip(true);
                      }}
                      sx={{ display: "block", ml: "auto" }}
                      size="small"
                    >
                      <Icon path="more-vert" />
                    </IconButton>
                  }
                />
              </Stack>
            </TableCell>
          </>
        )}
      </TableRowStyled>
    </>
  );
}
