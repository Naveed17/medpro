import TableCell from "@mui/material/TableCell";
import {
  Typography,
  Box,
  Checkbox,
  Button,
  IconButton,
  Skeleton,
} from "@mui/material";
import { TableRowStyled } from "@features/table";
import Icon from "@themes/urlIcon";
import moment from "moment-timezone";

// redux
import { useAppDispatch } from "@app/redux/hooks";
import { onOpenDetails } from "@features/table";
function PatientRow({ ...props }) {
  const { row, isItemSelected, handleClick, t, labelId, loading } = props;
  const dispatch = useAppDispatch();
  return (
    <TableRowStyled
      hover
      onClick={() => !loading && handleClick(row.uuid as any)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={Math.random()}
      selected={isItemSelected}
    >
      <TableCell padding="checkbox">
        {loading ? (
          <Skeleton variant="circular" width={28} height={28} />
        ) : (
          <Checkbox
            color="primary"
            checked={isItemSelected}
            inputProps={{
              "aria-labelledby": labelId,
            }}
          />
        )}
      </TableCell>
      <TableCell>
        <Box
          display="flex"
          alignItems="center"
          sx={{ img: { borderRadius: "4px" } }}
        >
          {/* <img
            src={row.avatar as string}
            className="avatar"
            alt="avatar"
            height="28px"
            width={28}
          /> */}
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
              {loading ? (
                <Skeleton variant="text" width={100} />
              ) : (
                <>
                  <Icon path={"ic-f"} />
                  {row.firstName}
                </>
              )}
            </Typography>
            <Typography
              variant="body2"
              component="span"
              color="text.secondary"
              className="text-time"
            >
              {loading ? (
                <Skeleton variant="text" width={100} />
              ) : (
                <>
                  <Icon path="ic-anniverssaire" /> {row.birthdate} -
                  {moment().diff(new Date(row.birthdate), "years")}
                </>
              )}{" "}
            </Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>
        <Box display="flex" component="span" alignItems="center">
          {loading ? (
            <Skeleton variant="text" width={100} />
          ) : (
            <>
              {row.telephone && <Icon path="ic-tel" />}
              <Typography sx={{ ml: 0.6 }}>{row.telephone || "-"}</Typography>
            </>
          )}
        </Box>
      </TableCell>
      <TableCell>
        {loading ? <Skeleton variant="text" /> : row.city || "-"}
      </TableCell>
      <TableCell>
        {loading ? <Skeleton variant="text" /> : row.idCode || "-"}
      </TableCell>
      <TableCell>
        {false ? (
          <Button
            variant="text"
            size="small"
            color="primary"
            startIcon={<Icon path="ic-agenda-+" />}
            sx={{ position: "relative" }}
          >
            {t("table.add-appointment")}
          </Button>
        ) : (
          <Box display="flex" alignItems="center">
            {loading ? (
              <Skeleton variant="circular" width={20} height={20} />
            ) : (
              <IconButton size="small">
                <Icon path="ic-historique" />
              </IconButton>
            )}
            <Box ml={1}>
              <Typography
                component="span"
                className="next-appointment"
                variant="body2"
                color="text.primary"
              >
                {loading ? (
                  <Skeleton variant="text" width={100} />
                ) : (
                  <>
                    <Icon path="ic-agenda" />
                    {row.nextAppointment.dayDate}
                  </>
                )}
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
                {loading ? (
                  <Skeleton variant="text" width={100} />
                ) : (
                  <>
                    <Icon path="ic-time" /> {row.nextAppointment.startTime}
                  </>
                )}
              </Typography>
            </Box>
          </Box>
        )}
      </TableCell>
      <TableCell>
        {false ? (
          <Button
            variant="text"
            size="small"
            color="primary"
            startIcon={<Icon path="ic-agenda-+" />}
            sx={{ position: "relative" }}
          >
            {t("table.add-appointment")}
          </Button>
        ) : (
          <Box display="flex" alignItems="center">
            {loading ? (
              <Skeleton variant="circular" width={20} height={20} />
            ) : (
              <IconButton size="small">
                <Icon path="ic-historique" />
              </IconButton>
            )}
            <Box ml={1}>
              <Typography
                component="span"
                className="next-appointment"
                variant="body2"
                color="text.primary"
              >
                {loading ? (
                  <Skeleton variant="text" width={100} />
                ) : (
                  <>
                    <Icon path="ic-agenda" />
                    {row.nextAppointment.dayDate}
                  </>
                )}
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
                {loading ? (
                  <Skeleton variant="text" width={100} />
                ) : (
                  <>
                    <Icon path="ic-time" /> {row.nextAppointment.startTime}
                  </>
                )}
              </Typography>
            </Box>
          </Box>
        )}
      </TableCell>

      <TableCell
        align="right"
        sx={{
          display: "flex",
          alignItems: "center",
          minHeight: "58.85px",
        }}
      >
        {loading ? (
          <>
            <Skeleton
              variant="circular"
              width={22}
              height={22}
              sx={{ ml: 1 }}
            />
            <Skeleton variant="text" width={60} sx={{ ml: 1 }} />
            <Skeleton variant="text" width={60} />
          </>
        ) : (
          <>
            <IconButton
              size="small"
              sx={{
                ml: 0.6,
                path: { fill: (theme) => theme.palette.common.black },
              }}
            >
              <Icon path="ic-autre2" />
            </IconButton>

            <Button
              size="small"
              sx={{
                ml: 0.6,
                color: (theme) => theme.palette.common.black,
                path: { fill: (theme) => theme.palette.common.black },
              }}
            >
              {t("table.edit")}
            </Button>

            <Button
              onClick={(e) => {
                e.stopPropagation();
                dispatch(onOpenDetails({ patientId: row.uuid }));
              }}
              size="small"
            >
              {t("table.see-card")}
            </Button>
          </>
        )}
      </TableCell>
    </TableRowStyled>
  );
}
export default PatientRow;
