import TableCell from "@mui/material/TableCell";
import { Checkbox, Button } from "@mui/material";
import { useTheme, alpha, Theme } from "@mui/material/styles";
import { TableRowStyled } from "@features/table";
function CIPMedicalProceduresRow({ ...props }) {
  const { row, isItemSelected, handleClick, selected } = props;
  const theme = useTheme() as Theme;
  return (
    <TableRowStyled
      className={'cip-medical-proce-row'}
      hover
      onClick={() => {
        return handleClick(row.id as number)
      }}
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
        <Button sx={{
          mr: 1,
        }} size="small" variant="outlined" color="info">
          {row.defaultAmount}
        </Button>
        TND
      </TableCell>
      <TableCell>
        {row.amount > 0 ? (
          <>
            <Button sx={{
              backgroundColor: alpha(theme.palette.success.main, 0.1),
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
              mr: 1,
            }} size="small" variant="outlined" color="success">
              {row.amount}
            </Button>
          </>
        ) : (
          <>
            <Button
              disabled
              sx={{
                backgroundColor: 'transparent !important',
                borderColor: 'transparent',
                color: theme.palette.text.primary + ' !important',
                mr: 1,
              }} size="small">
              --
            </Button>
          </>


        )}
        TND
      </TableCell>
    </TableRowStyled>
  );
}
export default CIPMedicalProceduresRow;
