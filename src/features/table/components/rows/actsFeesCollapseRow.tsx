import React from "react";
import { TableRowStyled } from "@features/table";
import {
  Stack,
  TableCell,
  Typography,
  useTheme,
  IconButton,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import moment from "moment-timezone";
import MoreVertIcon from "@mui/icons-material/MoreVert";
function actsFeesCollapseRow({ ...props }) {
  const { data, handleEvent } = props;
  const { devise } = data;
  const theme = useTheme();
  return (
    <TableRowStyled className="act-fees-collapse-row">
      <TableCell>
        <Typography fontWeight={700} color="text.primary">
          Nom d’assurance
        </Typography>
      </TableCell>
      <TableCell>
        <Typography textAlign="center" color={theme.palette.grey[500]}>
          Nature
        </Typography>
      </TableCell>
      <TableCell>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={0.5}
        >
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
      </TableCell>
      <TableCell>
        <Typography textAlign="center" color={theme.palette.grey[500]}>
          0 {devise}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography textAlign="center" color={theme.palette.grey[500]}>
          0 %
        </Typography>
      </TableCell>
      <TableCell>
        <Typography textAlign="center" color={theme.palette.grey[500]}>
          0 {devise}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography textAlign="center" color={theme.palette.grey[500]}>
          0 %
        </Typography>
      </TableCell>
      <TableCell align="right">
        <IconButton
          size="small"
          className="btn-more"
          onClick={(e) =>
            handleEvent({ row: {}, event: e, action: "OPEN-POPOVER-CHILD" })
          }
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </TableCell>
    </TableRowStyled>
  );
}

export default actsFeesCollapseRow;
