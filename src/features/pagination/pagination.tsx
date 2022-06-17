import * as React from "react";
import { Pagination as BasicPagination } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function Pagination({ ...props }) {
  const { page, count, setPage, total } = props;

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="body1" color="text.primary">
        {(page + 1) * 10 - 9} -{" "}
        {total < (page + 1) * 10 ? total : (page + 1) * 10} of {total}
      </Typography>
      <Stack spacing={2}>
        <BasicPagination
          onChange={(e, v) => setPage(v - 1)}
          count={parseInt(count)}
          page={page + 1}
          color="primary"
        />
      </Stack>
    </Box>
  );
}
