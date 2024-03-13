import {TableRowStyled} from "@features/table";
import TableCell from "@mui/material/TableCell";
import {
    Avatar,
    Badge,
    IconButton,
    Skeleton,
    Stack,
    Typography
} from "@mui/material";
import IconUrl from "@themes/urlIcon";
import {ConditionalWrapper} from "@lib/hooks";
import Zoom from "react-medium-image-zoom";
import {useSnackbar} from "notistack";

function StaffRow({...props}) {
    const {row, t} = props;
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const copyContent = async () => {
        try {
            await navigator.clipboard.writeText("med12345*");
            enqueueSnackbar("copied", {variant: "success"});
        } catch (err) {
            enqueueSnackbar(err, {variant: "error"});
        }
    }

    return (
        <TableRowStyled
            className={"user-row"}
            hover
        >

            <TableCell>
                {row ? (
                    <>
                        <Badge
                            onClick={(event: any) => event.stopPropagation()}
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
                                        {row.FirstName} {row.lastName}
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
            <TableCell>{row ? <Typography fontWeight={600} color='text.primary' fontSize={13}>
                Secretary
            </Typography> : <Skeleton variant="text" width={100}/>}</TableCell>
            <TableCell>{row ? <Typography fontWeight={600} color='text.primary' fontSize={13}>
                Staff@med.tn
            </Typography> : <Skeleton variant="text" width={100}/>}</TableCell>
            <TableCell>{row ? <Typography fontWeight={600} color='text.primary' fontSize={13}>
                    <Stack direction='row' alignItems='center' spacing={1}>
                        <Typography fontWeight={600} color='text.primary' fontSize={13}>
                            med12345*
                        </Typography>
                        <IconButton size="small"
                                    onClick={() => copyContent()}>
                            <IconUrl width={20} height={20} path="ic-copy"/>
                        </IconButton>
                    </Stack>
                </Typography>
                : <Skeleton variant="text" width={100}/>}</TableCell>
        </TableRowStyled>
    )
}

export default StaffRow
