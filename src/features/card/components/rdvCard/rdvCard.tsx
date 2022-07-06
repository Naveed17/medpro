import React from "react";
import {
  TableContainer,
  Typography,
  TableRow,
  TableCell,
  Table,
  TableBody,
  Button,
  Box,
} from "@mui/material";
import Icon from "@themes/urlIcon";
import moment from "moment";

function RdvCard({ ...props }) {
  const { row } = props;
  return (
    <React.Fragment key={Math.random()}>
      <TableRow>
        <TableCell colSpan={3} className="text-row">
          {row.pending ? (
            <Typography variant="body1" color="text.primary">
              {row.title} {row.data.length > 1 && `(${row.data.length})`}
            </Typography>
          ) : (
            <Typography variant="body1" color="text.primary">
              {row.title}{" "}
              {row.data.length > 1
                ? `(${row.data.reduce(
                    (previousValue, currentValue) =>
                      previousValue.data.length + currentValue.data.length
                  )})`
                : row.data[0].data.length > 1 && `(${row.data[0].data.length})`}
            </Typography>
          )}
        </TableCell>
      </TableRow>
      {row.data.map((data) => (
        <React.Fragment key={Math.random()}>
          {data.data ? (
            <>
              <TableRow>
                <TableCell className="text-row">
                  <Typography variant="body1" color="text.primary">
                    {data.title}
                  </Typography>
                </TableCell>
              </TableRow>
              {data.data.map((inner) => (
                <TableRow key={Math.random()}>
                  <TableCell
                    sx={{
                      borderStyle: "solid",
                      width: 200,
                      color: "primary.main",
                      svg: {
                        width: "10px",
                        height: 18,
                        mr: 1,
                        path: {
                          fill: (theme) => theme.palette.text.secondary,
                        },
                      },
                      position: "relative",
                      "&:after": {
                        content: '" "',
                        display: "block",
                        position: "absolute",
                        top: "0",
                        right: 0,
                        height: "100%",
                        width: 4,
                        bgcolor: inner.borderColor,
                      },
                    }}
                    className="first-child"
                  >
                    <Box sx={{ display: "flex" }}>
                      <Icon path="ic-agenda" />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mr: 3 }}
                      >
                        {moment(new Date(inner.time)).format("ddd DD MMM")}
                      </Typography>
                      <Icon path="ic-time" />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(inner.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "primary.main",
                      display: "flex",
                      svg: {
                        width: "10px",
                        height: 18,
                        mr: 1,
                        path: {
                          fill: (theme) => theme.palette.error.main,
                        },
                      },
                    }}
                  >
                    {inner.meeting && <Icon path="ic-video" />}

                    <Typography variant="body2" color="primary.main">
                      {" "}
                      {inner.motif}
                    </Typography>
                  </TableCell>

                  <TableCell align="right" sx={{ p: "0px 12px!important" }}>
                    {inner.addRoom && (
                      <Button
                        variant="text"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        Ajouter Salle d’attente
                      </Button>
                    )}

                    <Button variant="text" color="primary" size="small">
                      Voir détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : (
            <TableRow key={data.name}>
              <TableCell
                sx={{
                  borderStyle: "solid",
                  width: 200,
                  color: "primary.main",
                  svg: {
                    width: "10px",
                    height: 18,
                    mr: 1,
                    path: {
                      fill: (theme) => theme.palette.text.secondary,
                    },
                  },
                  position: "relative",
                  "&:after": {
                    content: '" "',
                    display: "block",
                    position: "absolute",
                    top: "0",
                    right: 0,
                    height: "100%",
                    width: 4,
                    bgcolor: data.borderColor,
                  },
                }}
                className="first-child"
              >
                <Box sx={{ display: "flex" }}>
                  <Icon path="ic-agenda" />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mr: 3 }}
                  >
                    {moment(new Date(data.time)).format("ddd DD MMM")}
                  </Typography>
                  <Icon path="ic-time" />
                  <Typography variant="body2" color="text.secondary">
                    {new Date(data.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  color: "primary.main",
                  display: "flex",
                  svg: {
                    width: "10px",
                    height: 18,
                    mr: 1,
                    path: {
                      fill: (theme) => theme.palette.error.main,
                    },
                  },
                }}
              >
                {data.meeting && <Icon path="ic-video" />}

                <Typography variant="body2" color="primary.main">
                  {" "}
                  {data.motif}
                </Typography>
              </TableCell>

              <TableCell align="right" sx={{ p: "0px 12px!important" }}>
                {data.addRoom && (
                  <Button
                    variant="text"
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Ajouter Salle d’attente
                  </Button>
                )}

                <Button variant="text" color="primary" size="small">
                  Voir détails
                </Button>
              </TableCell>
            </TableRow>
          )}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
}
export default RdvCard;
