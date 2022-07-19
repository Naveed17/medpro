import React from "react";

import Lable from "@themes/overrides/Lable";
import TableCell from "@mui/material/TableCell";
import { Typography, Box, Skeleton, Stack } from "@mui/material";
import IconUrl from "@themes/urlIcon";
import Button from "@mui/material/Button";
import { TableRowStyled } from "@features/table";
import { uniqueId } from "lodash";
function SubstituleRow({ ...props }) {
  const { row, t } = props;
  return (
    <TableRowStyled key={uniqueId}>
      <TableCell>
        {row ?
          <>
            <Typography variant="body1" color="text.primary">
              {row.name}
            </Typography>
            {row.email}
          </>
          :
          <Stack>
            <Skeleton variant="text" width={100} />
            <Skeleton variant="text" width={100} />
          </Stack>
        }
      </TableCell>
      <TableCell align="center">
        {row ?
          <>
            <Typography textAlign={"center"} variant="body1" color="text.primary">
              {row.fonction}
            </Typography>
            {row.speciality}
          </> :
          <Stack alignItems="center">
            <Skeleton variant="text" width={100} />
            <Skeleton variant="text" width={100} />
          </Stack>
        }
      </TableCell>
      <TableCell align="center">
        {row ?
          <Lable
            variant="filled"
            color={row.bg}
          >
            {row.status}
          </Lable>
          : <Skeleton variant="text" width={100} height={40} sx={{ mx: 'auto' }} />}
      </TableCell>
      <TableCell align="center">
        {row ?
          <Typography className='name' variant="body1" color="text.primary">
            {row.access} {t('table.agenda')}
          </Typography>
          : <Skeleton variant="text" width={100} sx={{ m: 'auto' }} />
        }
      </TableCell>
      <TableCell align="right">
        {row ?
          <Box display="flex" sx={{ float: "right" }} alignItems="center">
            <Button
              variant="text"
              size="small"
              color="primary"
              startIcon={<IconUrl path="setting/edit" />}
              onClick={() => console.log("edit", row)}>
              {t('table.update')}
            </Button>
            <Button
              variant="text"
              size="small"
              color="error"
              startIcon={<IconUrl path="setting/icdelete" />}
              onClick={() => console.log("remove", row)}
              sx={{ mr: 1 }}>
              {t('table.remove')}
            </Button>
          </Box>
          : <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
            <Skeleton variant="text" width={50} />
            <Skeleton variant="text" width={50} />
          </Stack>
        }
      </TableCell>
    </TableRowStyled>
  )
}
export default SubstituleRow;
