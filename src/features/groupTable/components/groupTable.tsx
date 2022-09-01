import { TableContainer, Table, TableBody } from "@mui/material";
import { rowsActionsData } from "@features/groupTable";

function GroupTable({ ...props }) {
  const { data, from } = props;
  const selectted = rowsActionsData.find((item) => from === item.action);

  const Component: any = selectted?.component;
  return (
    <div>
      <TableContainer>
        <Table size="small" aria-label="a dense table">
          <TableBody>
            <Component isNext data={data} />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
export default GroupTable;
