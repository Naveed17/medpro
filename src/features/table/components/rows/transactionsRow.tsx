import { Stack, TableCell, Theme, Typography } from "@mui/material";

import { TableRowStyled } from "@features/table";
import IconUrl from "@themes/urlIcon";
import { CustomIconButton } from "@features/buttons";

function UserRow({ ...props }) {
    const { row } = props;
    // const theme = useTheme()


    return (
        <TableRowStyled
            key={row.uuid}
            className="transactions-row"
        >
            <TableCell>
                <Stack spacing={.3}>
                    <Stack direction='row' alignItems='center' spacing={.5}>
                        <IconUrl path="ic-agenda-jour" />
                        <Typography>DD/MM/YYYY</Typography>
                    </Stack>
                    <Stack direction='row' alignItems='center' spacing={.5}>
                        <IconUrl path="ic-time" />
                        <Typography>00:00:00</Typography>
                    </Stack>
                </Stack>
            </TableCell>
            <TableCell>
                <Stack direction='row' alignItems='center' spacing={.5}>
                    <CustomIconButton>
                        <IconUrl path="ic-filled-moneys" width={16} height={16} />
                    </CustomIconButton>
                    <CustomIconButton>
                        <IconUrl path="ic-filled-Cheque" width={16} height={16} />
                    </CustomIconButton>
                </Stack>
            </TableCell>
            <TableCell>
                <Typography color="text.primary">
                    210 TND
                </Typography>
            </TableCell>
            <TableCell>
                <Typography color="text.primary">
                    210 TND
                </Typography>
            </TableCell>
        </TableRowStyled>
    );
}

export default UserRow;
