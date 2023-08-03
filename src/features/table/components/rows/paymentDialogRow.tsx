import TableCell from "@mui/material/TableCell";
import {IconButton, Skeleton, Stack, Typography, useTheme} from "@mui/material";
import {TableRowStyled} from "@features/table";
import Icon from "@themes/urlIcon";
import React from "react";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import moment from "moment";
import {useInsurances} from "@lib/hooks/rest";

function PaymentDialogRow({...props}) {
    const {row, loading, handleEvent, t, key, index, data} = props;
    const {patient} = data;
    const theme = useTheme();
    const {data: session} = useSession();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const {insurances} = useInsurances();

    let insurance = null;
    const insuranceUUID = row.insurance ? patient.insurances.find((i: { uuid: string; }) => i.uuid === row.insurance).insurance.uuid : "";

    if (insuranceUUID !== "") {
        insurance = insurances.find(i => i.uuid === insuranceUUID);
    }
    return (
        <TableRowStyled
            hover
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
                                {moment(row.date).format('DD-MM-YYYY')}
                            </Typography>
                        </Stack>
                        <Stack direction='row' spacing={.5} alignItems="center">
                            <Icon path="ic-time"/>
                            <Typography variant="body2">
                                {moment(row.date).format('HH:mm')}
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
                        {
                            row.payment_means && <Stack direction="row" alignItems="center"
                                                        justifyContent={"flex-end"}
                                                        spacing={1}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img width={10} src={row.payment_means.logoUrl.url}
                                     alt={'payment means icon'}/>
                                <Typography color="text.primary"
                                            variant="body2">{t(row.payment_means.name)}</Typography>
                            </Stack>
                        }
                        {insurance &&
                            <Stack direction="row" alignItems="center"
                                   justifyContent={"flex-end"}
                                   spacing={1}>

                                <img width={10} src={insurance?.logoUrl.url}
                                     alt={'insurance icon'}/>

                                <Typography color="text.primary"
                                            variant="body2">{insurance.name}</Typography>
                            </Stack>
                        }
                        <IconButton
                            color={"error"}
                            size={"medium"}
                            onClick={() => {
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
