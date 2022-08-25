import {TableRowStyled} from "@features/table"
import TableCell from '@mui/material/TableCell';
import {Typography, Skeleton} from '@mui/material';
import IconUrl from "@themes/urlIcon";
import {uniqueId} from 'lodash'
import {Theme} from "@mui/material/styles";

function HolidayRow({...props}) {

    const {row} = props
    return (
        <TableRowStyled key={uniqueId}>
            <TableCell>
                {row ?
                    <Typography className='name' variant="body1" color="text.primary">
                        {row.name}
                    </Typography>
                    : <Skeleton variant="text" width={100}/>}
            </TableCell>
            <TableCell align="center">
                {row ?
                    <Typography className='name' variant="body1"
                                color="text.secondary"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "fit-content",
                                    margin: "auto !important",
                                    fontSize: '11px',
                                    svg: {mr: 0.5, ml: 0.5},
                                    mb: {md: 0, sm: 1, xs: 1},
                                    borderLeft: `5px solid ${(theme: Theme) => theme.palette.error.main}`,
                                }}
                                component="span">
                        <IconUrl path="agenda/ic-agenda2"/>
                        {row.start}
                        <IconUrl path="ic-time"/>
                        {row.time_start}
                    </Typography>
                    : <Skeleton variant="text" width={150} sx={{m: 'auto'}}/>}
            </TableCell>
            <TableCell align="center">
                {row ?
                    <Typography className='name' variant="body1"
                                color="text.secondary"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "fit-content",
                                    margin: "auto !important",
                                    fontSize: '11px',
                                    svg: {mr: 0.5, ml: 0.5},
                                    mb: {md: 0, sm: 1, xs: 1},
                                    borderLeft: `5px solid ${(theme: Theme) => theme.palette.success.main}`,
                                }}
                                component="span">
                        <IconUrl path="agenda/ic-agenda2"/>
                        {row.end}
                        <IconUrl path="ic-time"/>
                        {row.time_end}
                    </Typography>
                    : <Skeleton variant="text" width={150} sx={{m: 'auto'}}/>}
            </TableCell>
            <TableCell align="center">
                {row ?
                    <Typography className='name' variant="body1" color="primary">
                        {row.praticien}
                    </Typography>
                    : <Skeleton variant="text" width={100} sx={{m: 'auto'}}/>}
            </TableCell>
            <TableCell align="center">
                {row ?
                    <IconUrl path="ic-autre"/>
                    : <Skeleton variant="text" width={10} height={30} sx={{m: 'auto'}}/>}
            </TableCell>
        </TableRowStyled>
    )
}

export default HolidayRow