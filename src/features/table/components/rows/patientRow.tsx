import TableCell from "@mui/material/TableCell";
import { Typography, Box, Checkbox, Button, IconButton } from "@mui/material";
import { TableRowStyled } from "@features/table";
import Icon from "@themes/urlIcon";
import moment from "moment-timezone";
export default function PermissionRow({ ...props }) {
  const { row, isItemSelected, handleClick, t, labelId } = props;

  return (
    <TableRowStyled
      hover
      onClick={() => handleClick(row.name as string)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={Math.random()}
      selected={isItemSelected}
    >
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          checked={isItemSelected}
          inputProps={{
            "aria-labelledby": labelId,
          }}
        />
      </TableCell>
      <TableCell>
        <Box
          display="flex"
          alignItems="center"
          sx={{ img: { borderRadius: "4px" } }}
        >
          <img
            src={row.avatar as string}
            className="avatar"
            alt="avatar"
            height="28px"
            width={28}
          />
          <Box ml={1}>
            <Typography
              variant="body1"
              component="span"
              sx={{
                display: "flex",
                alignItems: "center",
                svg: { mr: 0.5 },
              }}
              color="primary"
            >
              <Icon path={"ic-f"} />
              {row.name}
            </Typography>
            <Typography
              variant="body2"
              component="span"
              color="text.secondary"
              className="text-time"
            >
              <Icon path="ic-anniverssaire" />
              {moment(row.dateOfBirth).format("DD-MM-YYYY")} -{" "}
              {moment().diff(row.dateOfBirth, "years", true).toFixed()}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" component="span" alignItems="center">
          <Icon path="ic-tel" />
          <Typography sx={{ ml: 0.6 }}>{row.telephone}</Typography>
        </Box>
      </TableCell>
      <TableCell>{row.city}</TableCell>
      <TableCell>{row.idCode}</TableCell>
      <TableCell>
        {row.addAppointment ? (
          <Button
            variant="text"
            size="small"
            color="primary"
            startIcon={<Icon path="ic-agenda-+" />}
            sx={{ position: "relative" }}
          >
            {t("add-appointment")}
          </Button>
        ) : (
          <Box display="flex" alignItems="center">
            <IconButton size="small">
              <Icon path="ic-historique" />
            </IconButton>
            <Box ml={1}>
              <Typography
                component="span"
                className="next-appointment"
                variant="body2"
                color="text.primary"
              >
                <Icon path="ic-agenda" />

                {moment(row.nextAppointment).format("DD-MM-YYYY")}
              </Typography>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  "& svg": {
                    width: 11,
                    mr: 0.6,
                  },
                }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                <Icon path="ic-time" />
                {moment(row.time).format("HH:mm")}
              </Typography>
            </Box>
          </Box>
        )}
      </TableCell>
      <TableCell>
        <Box display="flex" alignItems="center">
          <IconButton size="small">
            <Icon path="ic-historique" />
          </IconButton>
          <Box ml={1}>
            <Typography
              component="span"
              className="next-appointment"
              variant="body2"
              color="text.primary"
            >
              <Icon path="ic-agenda" />

              {moment(row.nextAppointment).format("DD-MM-YYYY")}
            </Typography>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                "& svg": {
                  width: 11,
                  mr: 0.6,
                },
              }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              <Icon path="ic-time" />
              {moment(row.time).format("HH:mm")}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell
        align="right"
        sx={{
          display: "flex",
          alignItems: "center",
          minHeight: "58.85px",
        }}
      >
        <IconButton size="small" sx={{ ml: 0.6, path: { fill: "#000" } }}>
          <Icon path="ic-autre2" />
        </IconButton>

        <Button
          size="small"
          sx={{
            ml: 0.6,
            color: "#000",
            path: { fill: "#000" },
          }}
        >
          {t("edit")}
        </Button>

        <Button size="small">{t("see-card")}</Button>
      </TableCell>
    </TableRowStyled>
  );
}
