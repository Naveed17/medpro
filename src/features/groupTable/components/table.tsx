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

import { RDVCard } from "@features/card";
export default function RDV({ ...props }) {
  const { data } = props;
  return (
    <div>
      <TableContainer>
        <Table size="small" aria-label="a dense table">
          <TableBody>
            {data.map((row) => (
              <RDVCard row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
