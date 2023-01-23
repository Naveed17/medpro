import TableCell from "@mui/material/TableCell";
import {
    Typography,
    Skeleton,
    Stack, IconButton, useTheme
} from "@mui/material";
import {TableRowStyled} from "@features/table";
import Icon from "@themes/urlIcon";
import React from "react";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@app/constants";


function PaymentDialogRow({...props}) {
    const {row, loading, handleEvent, t, key, index} = props;
    const theme = useTheme();
    const {data: session} = useSession();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    return (
        <TableRowStyled
            hover
            key={Math.random()}
            className="payment-dialog-row"
        >
            <TableCell padding="checkbox">
                {loading ? (
                    <Stack direction='row' spacing={1}>
                        <Skeleton width={100}/>
                        <Skeleton width={100}/>
                    </Stack>

                ) : (
                    <Stack direction='row' spacing={2} alignItems="center">
                        <Stack direction='row' spacing={.5} alignItems="center">
                            <Icon path="ic-agenda"/>
                            <Typography variant="body2">
                                {row.date}
                            </Typography>
                        </Stack>
                        <Stack direction='row' spacing={.5} alignItems="center">
                            <Icon path="ic-time"/>
                            <Typography variant="body2">
                                {row.time}
                            </Typography>
                        </Stack>
                    </Stack>
                )}
            </TableCell>
            <TableCell>
                {loading ? (
                    <Skeleton width={80}/>
                ) : (
                    <Typography
                        variant="body2"
                        color={"primary"}>{row.amount} {devise}</Typography>
                )}
            </TableCell>
            <TableCell align="right">
                {loading ? (
                        <Skeleton width={80}/>
                    ) :
                    <Stack direction={"row"} justifyContent={"flex-end"} spacing={2}>
                        {row.payment_type.map((type: any, i: number) =>
                            <Stack key={i} direction="row" alignItems="center"
                                   justifyContent={"flex-end"}
                                   spacing={1}>
                                <Icon path={type.icon}/>
                                <Typography color="text.primary"
                                            variant="body2">{t(type.label)}</Typography>
                            </Stack>
                        )}
                        <IconButton
                            color={"error"}
                            size={"medium"}
                            onClick={(e) => {
                                handleEvent("delete", index);
                            }}>
                            <Icon path="setting/icdelete" width={"16"} height={"16"} color={theme.palette.error.main}/>
                        </IconButton>
                    </Stack>
                }
            </TableCell>
        </TableRowStyled>
    );
}

export default PaymentDialogRow;
