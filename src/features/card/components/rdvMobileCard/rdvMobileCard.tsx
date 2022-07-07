import React from "react";
// material
import { Typography, IconButton, Stack, Box } from "@mui/material";
import RootStyled from "./overrides/rootStyled";
// icon
import Icon from "@themes/urlIcon";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// ____________________
import moment from "moment";

function RDVMobileCard({ ...props }) {
  const { inner } = props;
  return (
    <RootStyled
      sx={{
        "&:before": {
          bgcolor: inner.borderColor,
        },
      }}
    >
      <Stack direction="row" spacing={2}>
        <Box className="card-main">
          <Typography
            component="span"
            variant="body2"
            color="primary.main"
            className="title"
          >
            {inner.meeting ? <Icon path="ic-video" /> : null}

            <span>{inner.title}</span>
          </Typography>
          <Box className="time-badge-main">
            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              mr={1}
              className="time-main"
            >
              <Icon path="ic-agenda" />
              <span>{moment(new Date()).format("ddd DD MMMM")}</span>
            </Typography>

            <Typography
              component="span"
              variant="body2"
              color="text.secondary"
              className="time-main"
            >
              <Icon path="ic-time" />
              <span>
                {new Date(inner.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </Typography>
          </Box>
        </Box>
        <Box className="action">
          <IconButton size="small">
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      </Stack>
    </RootStyled>
  );
}
export default RDVMobileCard;
