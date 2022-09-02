import TableCell from "@mui/material/TableCell";
import {TableRowStyled} from "@features/table";
import {CipNextAppointCard} from "@features/card";

function CIPNextAppointRow({...props}) {
    return (
        <TableRowStyled
            hover
            key={Math.random()}
        >
            <TableCell align="left" colSpan={7}>
                <CipNextAppointCard {...props} />
            </TableCell>
        </TableRowStyled>
    );
}

export default CIPNextAppointRow;
