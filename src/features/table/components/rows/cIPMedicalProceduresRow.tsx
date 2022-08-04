import TableCell from "@mui/material/TableCell";
import { Typography, Box, Checkbox, Button, IconButton } from "@mui/material";
import { TableRowStyled } from "@features/table";

function PatientRow({ ...props }) {
  const { row, isItemSelected, handleClick, t } = props;
  return (
    <TableRowStyled
      hover
      onClick={() => handleClick(row.id as number)}
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

        />
      </TableCell>
      <TableCell>
        {row.acts}
      </TableCell>
      <TableCell>
        {row.defaultAmount}
      </TableCell>
      <TableCell>
        {row.amount}
      </TableCell>
    </TableRowStyled>
  );
}
export default PatientRow;
