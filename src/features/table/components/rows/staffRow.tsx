import {setSelectedRows, tableActionSelector, TableRowStyled} from "@features/table";
import TableCell from "@mui/material/TableCell";
import {
    Avatar,
    Badge,
    Box, Checkbox,
    IconButton,
    Skeleton,
    Stack,
    Typography, useTheme
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {ConditionalWrapper} from "@lib/hooks";
import Zoom from "react-medium-image-zoom";
import {useRouter} from "next/router";

function StaffRow({...props}) {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const {row, isItemSelected, handleEvent, selected, handleClick} = props;
    const router = useRouter()
    const {tableState: {rowsSelected}} = useAppSelector(tableActionSelector);

    const handleCheckItem = (isItemSelected: boolean, row: PatientModel) => {
        if (isItemSelected) {
            dispatch(setSelectedRows([...rowsSelected, row]))
        } else {
            dispatch(setSelectedRows(rowsSelected.filter((item: any) => item.uuid !== row.uuid)))
        }
    }

    return (
        <TableRowStyled
            className={"user-row"}
            hover
            role="checkbox"
            aria-checked={isItemSelected}
            tabIndex={-1}
            selected={isItemSelected}
            onClick={(event: any) => {
                event.stopPropagation();
                router.push(`${router.pathname}/${row.uuid}`, `${router.pathname}/${row.uuid}`, {locale: router.locale});
            }}>
            <TableCell padding="checkbox">
                <Checkbox
                    color="primary"
                    checked={selected.some((uuid: any) => uuid === row.uuid)}
                    inputProps={{
                        "aria-labelledby": row.uuid,
                    }}
                    onChange={(ev) => {
                        ev.stopPropagation();
                        handleClick(row.uuid);
                        handleCheckItem(ev.target.checked, row);
                    }}
                />
            </TableCell>
            <TableCell>
                {row ? (
                    <>
                        <Badge
                            overlap="circular"
                            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
                            <ConditionalWrapper
                                condition={row.hasPhoto}
                                wrapper={(children: any) => <Zoom>{children}</Zoom>}>
                                <Stack direction={"row"} alignItems={"center"} spacing={2}>
                                    <Avatar
                                        {...(row.hasPhoto && {className: "zoom"})}
                                        src={"/static/icons/men-avatar.svg"}
                                        sx={{
                                            "& .injected-svg": {
                                                margin: 0
                                            },
                                            width: 36,
                                            height: 36,
                                            borderRadius: 1
                                        }}>
                                        <IconUrl width={"36"} height={"36"} path="men-avatar"/>
                                    </Avatar>
                                    <Typography variant="body1" fontWeight={700} color="primary">
                                        {row.firstName} {row.lastName}
                                    </Typography>
                                </Stack>
                            </ConditionalWrapper>
                        </Badge>

                    </>
                ) : (
                    <Stack>
                        <Skeleton variant="text" width={100}/>
                        <Skeleton variant="text" width={100}/>
                    </Stack>
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <>
                        <Typography
                            textAlign={"center"}
                            variant="body1"
                            fontSize={13}
                            fontWeight={700}
                            color="text.primary">
                            {row?.department?.name ?? "--"}
                        </Typography>
                    </>
                ) : (
                    <Stack alignItems="center">
                        <Skeleton variant="text" width={100}/>
                        <Skeleton variant="text" width={100}/>
                    </Stack>
                )}
            </TableCell>
            <TableCell align="center">
                <Stack direction='column' alignItems='center' spacing={.5}>
                    <Typography
                        textAlign={"center"}
                        variant="body1"
                        fontSize={13}
                        fontWeight={700}
                        color="text.primary">
                        {row?.phone ?? "--"}
                    </Typography>
                </Stack>
            </TableCell>
            <TableCell align="center">
                <Stack direction='column' alignItems='center' spacing={.5}>
                    <Typography
                        textAlign={"center"}
                        variant="body1"
                        fontSize={13}
                        fontWeight={700}
                        color="text.primary">
                        {row?.email ?? "--"}
                    </Typography>
                </Stack>
            </TableCell>
            <TableCell align="center">
                <Typography
                    textAlign={"center"}
                    variant="body1"
                    fontSize={13}
                    fontWeight={700}
                    color="text.primary">
                    {row?.date ?? "--"}
                </Typography>
            </TableCell>
            <TableCell align="right">
                {row ? (
                    <Box display="flex" sx={{float: "right"}} alignItems="center">
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEvent("EDIT_STAFF", row);
                            }}
                            size="small"
                            color="primary"
                            className="btn-edit">
                            <IconUrl color={theme.palette.text.secondary} path="ic-edit-patient"/>
                        </IconButton>

                        <IconButton
                            className={"delete-icon"}
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEvent("DELETE_STAFF", row);
                            }}
                            sx={{
                                ml: {md: 1},
                                '& .react-svg svg': {
                                    width: 20,
                                    height: 20
                                }
                            }}>
                            <IconUrl color={theme.palette.text.secondary} path="ic-trash"/>
                        </IconButton>
                    </Box>
                ) : (
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        justifyContent="flex-end">
                        <Skeleton variant="text" width={50}/>
                        <Skeleton variant="text" width={50}/>
                    </Stack>
                )}
            </TableCell>
        </TableRowStyled>
    )
}

export default StaffRow
