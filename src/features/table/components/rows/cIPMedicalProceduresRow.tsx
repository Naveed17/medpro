import TableCell from "@mui/material/TableCell";
import { Checkbox, Button, InputBase } from "@mui/material";
import { useTheme, alpha, Theme } from "@mui/material/styles";
import { TableRowStyled } from "@features/table";
import React from "react";
function CIPMedicalProceduresRow({ ...props }) {
  const { row, isItemSelected, handleClick } = props;
  const theme = useTheme() as Theme;
  const [fees, setfees] = React.useState<number>(row.fees)
  return (
    <TableRowStyled
      className={'cip-medical-proce-row'}
      hover
      onClick={() => {
        return handleClick(row.uuid as string)
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
        {row.act.name}
      </TableCell>
      <TableCell>
        {isItemSelected ? (
          <>
            <InputBase sx={{
              backgroundColor: alpha(theme.palette.success.main, 0.1),
              border: 1,
              borderRadius: .5,
              paddingLeft: .5,
              paddingRight: .5,
              maxWidth: 64,
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
              mr: 1,
              input: {
                textAlign: 'center',
                padding: theme.spacing(.3),
                "&::-webkit-outer-spin-button,&::-webkit-inner-spin-button": {
                  "-webkit-appearance": 'none',
                  margin: 0,
                }

              }
            }}
              type="number"
              size="small" value={fees}
              onClick={(e) => e.stopPropagation()}
              onChange={(e: any) => {
                setfees(e.target.value)

              }}
              autoFocus={isItemSelected}
            />



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
