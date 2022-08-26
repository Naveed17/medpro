import TableCell from "@mui/material/TableCell";
import { TableRowStyled } from "@features/table";
import { CipNextAppointCard } from "@features/card";
function CIPNextAppointRow({ ...props }) {
  const { row, t } = props;
  return (
    <TableRowStyled
      hover
      key={Math.random()}

    >
      <TableCell align="left" colSpan={7}>
        <CipNextAppointCard row={row} t={t} />
      </TableCell>
    </TableRowStyled>
  );
}
export default CIPNextAppointRow;
