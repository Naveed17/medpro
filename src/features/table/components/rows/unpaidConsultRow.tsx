import TableCell from "@mui/material/TableCell";
import {Avatar, IconButton, Link, Stack, Tooltip, Typography, useTheme,} from "@mui/material";
import {TableRowStyled} from "@features/table";
import Icon from "@themes/urlIcon";
import IconUrl from "@themes/urlIcon";
// redux
import React from "react";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import moment from "moment-timezone";
import {ConditionalWrapper} from "@lib/hooks";
import {useInsurances} from "@lib/hooks/rest";
import {ImageHandler} from "@features/image";
import { Label } from "@features/label";

function UnpaidConsultRow({...props}) {

    const {
        row,
        handleEvent,
        t,
        data,
    } = props;

    const {hideName} = data;
    const {insurances} = useInsurances();

    const theme = useTheme();
    const {data: session} = useSession();
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;
    const _fees = row.fees ? row.fees : row.appointmentRestAmount
    return (
        <TableRowStyled rest={row.appointmentRestAmount} fees={_fees} tabIndex={-1} className={`row-cashbox`}>
            <TableCell>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={.5}>
                    <Icon path="ic-agenda-jour" height={14} width={14} color={theme.palette.text.primary}/>
                    <Typography variant="body2" fontSize={13} fontWeight={600}>{moment(row.dayDate,'DD-MM-YYYY').format('DD-MM-YYYY')}</Typography>
                    <Icon path="ic-time" height={14} width={14} color={theme.palette.text.primary}/>
                    <Typography
                    fontSize={13}
                    fontWeight={600}
                    variant="body2">{row.startTime}</Typography>
                </Stack>
            </TableCell>
            {/***** patient name *****/}
            {!hideName && <TableCell>
                {row.patient && (
                    <ConditionalWrapper
                        condition={!row.patient?.isArchived}
                        wrapper={(children: any) => <Link
                            sx={{cursor: "pointer",fontSize:14,fontWeight:600}}
                            onClick={(event) => {
                                event.stopPropagation();
                                handleEvent({action: "PATIENT_DETAILS", row: row.patient, event});
                            }}
                            underline="none">{children}</Link>}>
                        {`${row.patient.firstName} ${row.patient.lastName}`}
                    </ConditionalWrapper>
                )}
            </TableCell>}
            {/***** Insurances *****/}
            <TableCell>
                <Stack direction={"row"} justifyContent={"center"}>
                    {
                        !!row.patient.insurances.length ? row.patient.insurances.map((insurance: any) => (
                            <Tooltip
                                key={insurance.uuid + "ins"}
                                title={insurance.name}>
                                <Avatar variant={"circular"}>
                                    <ImageHandler
                                        alt={insurance?.name}
                                        src={insurances.find(ins => ins.uuid === insurance?.uuid)?.logoUrl.url}
                                    />
                                </Avatar>
                            </Tooltip>
                        )) : <Typography fontWeight={600}>-</Typography>
                    }
                </Stack>
            </TableCell>
            {/* status */}
            <TableCell>
                <Label color={row.appointmentRestAmount == 0 ? "success":  _fees - row.appointmentRestAmount === 0 ?"error":"warning"}>
                    {t(row.appointmentRestAmount == 0 ? "paid":  _fees - row.appointmentRestAmount === 0 ?"unpaid":"partially")}
                </Label>
            </TableCell>
            {/***** Total *****/}
            <TableCell align={"center"}>
                <Typography color='secondary' fontWeight={700}>
                    {_fees} {devise}
                </Typography>
            </TableCell>
            {/***** Amount *****/}
            <TableCell align={"center"}>
                <Typography color={"secondary"} fontWeight={700} textAlign={"center"}>
                        { _fees - row.appointmentRestAmount} {" "}
                        <span>{devise}</span>
                    </Typography>

            </TableCell>
            {/***** Rest *****/}
            <TableCell align={"center"}>
                <Stack direction={"row"} spacing={1} alignItems={"center"} justifyContent={"end"}>
                    <Typography color='secondary' textAlign={"right"} fontWeight={700}>
                    {row.appointmentRestAmount} {devise}
                   </Typography>
                    <Tooltip title={t('more')}>
                        <IconButton
                            style={{
                                backgroundColor: row.appointmentRestAmount === 0 ? theme.palette.grey["200"]:theme.palette.primary.main,
                                borderRadius: 5,
                                width: 30,
                                height: 30
                            }}
                            onClick={event => {
                                event.stopPropagation();
                                handleEvent({action: "PAYMENT", row, event});
                            }}
                            disabled={row.appointmentRestAmount === 0}
                            size="small">
                            <IconUrl path={"ic-argent"} color={"white"}/>
                        </IconButton>
                    </Tooltip>
                </Stack>
            </TableCell>

        </TableRowStyled>
    );
}

export default UnpaidConsultRow;
