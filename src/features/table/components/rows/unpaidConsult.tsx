import TableCell from "@mui/material/TableCell";
import {
    Avatar,
    Card,
    CardContent,
    Collapse,
    IconButton,
    LinearProgress,
    Link,
    Paper,
    Stack,
    Table,
    TableBody,
    Tooltip,
    Typography,
    useTheme,
} from "@mui/material";
import {TableRowStyled} from "@features/table";
import Icon from "@themes/urlIcon";
import IconUrl from "@themes/urlIcon";
// redux
import React, {useState} from "react";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import moment from "moment-timezone";
import {useRouter} from "next/router";
import {useRequestQueryMutation} from "@lib/axios";
import {ConditionalWrapper, useMedicalEntitySuffix} from "@lib/hooks";
import {HtmlTooltip} from "@features/tooltip";
import {ImageHandler} from "@features/image";
import {Label} from "@features/label";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {useInsurances} from "@lib/hooks/rest";

function UpaidConsultRow({...props}) {

    const {
        row,
        handleEvent,
        t,
        data,
        handleClick,
    } = props;

    const {pmList, hideName} = data;
    const {insurances} = useInsurances();

    const router = useRouter();
    const theme = useTheme();
    const {data: session} = useSession();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    return (
        <>
            <TableRowStyled rest={10} tabIndex={-1}  className={`row-cashbox`}>
                <TableCell>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={.5}>
                        <Icon path="ic-agenda" height={11} width={11} color={theme.palette.text.primary}/>
                        <Typography variant="body2">{moment(row.date_transaction).format('DD-MM-YYYY')}</Typography>
                        <Icon path="ic-time" height={11} width={11} color={theme.palette.text.primary}/>
                        <Typography
                            variant="body2">{row.payment_time}</Typography>
                    </Stack>
                </TableCell>
                {/***** patient name *****/}
                {!hideName && <TableCell>
                    {row.patient && (
                        <ConditionalWrapper
                            condition={!row.patient?.isArchived}
                            wrapper={(children: any) => <Link
                                sx={{cursor: "pointer"}}
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
                       {/* {
                            row.patient.insurances ? row.patient.insurances.map((insurance: any) => (
                                <Tooltip
                                    key={insurance.insurance?.uuid + "ins"}
                                    title={insurance.insurance.name}>
                                    <Avatar variant={"circular"}>
                                        <ImageHandler
                                            alt={insurance.insurance?.name}
                                            src={insurances.find(ins => ins.uuid === insurance.insurance?.uuid)?.logoUrl.url}
                                        />
                                    </Avatar>
                                </Tooltip>
                            )) : <Typography>-</Typography>
                        }*/}
                    </Stack>
                </TableCell>
                {/***** Payments means *****/}
                <TableCell>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={1}>
                        {row.payment_means && row.payment_means.map((mean: any) => (
                            <HtmlTooltip key={mean.slug + "pm"} title={<React.Fragment>
                                {
                                    mean.data && <Stack>
                                        {mean.data.nb && <Typography fontSize={12}>Chq N°<span
                                            style={{fontWeight: "bold"}}>{mean.data.nb}</span></Typography>}
                                        {mean.data.carrier && <Typography fontSize={12}>{t('carrier')} : <span
                                            style={{fontWeight: "bold"}}>{mean.data.carrier}</span></Typography>}
                                        <Typography fontSize={12}><span
                                            style={{fontWeight: "bold"}}>{mean.data.bank?.name}</span></Typography>
                                    </Stack>
                                }
                                <Typography fontSize={12} textAlign={"center"}
                                            fontWeight={"bold"}>{mean.amount} {devise}</Typography>
                            </React.Fragment>}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img style={{width: 15}} key={mean.slug}
                                     src={pmList.find((pm: {
                                         slug: string;
                                     }) => pm.slug == mean.paymentMeans.slug).logoUrl.url}
                                     alt={"payment means icon"}/>
                            </HtmlTooltip>
                        ))
                        }
                    </Stack>

                </TableCell>
                {/***** Total *****/}
                <TableCell align={"center"}>
                    <Typography color='secondary' fontWeight={700}>
                        0 {devise}
                    </Typography>
                </TableCell>
                {/***** Rest *****/}
                <TableCell align={"center"}>
                    <Typography color='secondary' fontWeight={700}>
                        0 {devise}
                    </Typography>
                </TableCell>
                {/***** Amount *****/}
                <TableCell align={"center"}>
                    <Stack direction={"row"} spacing={1} alignItems={"center"} justifyContent={"center"}>
                        <Typography color={"secondary"} fontWeight={700} textAlign={"center"}>
                            0 {" "}
                            <span>{devise}</span>
                        </Typography>
                        <Tooltip title={t('more')}>
                            <IconButton
                                style={{backgroundColor:theme.palette.primary.main,borderRadius:8,width:40,height:40}}
                                onClick={event => {
                                    event.stopPropagation();
                                }}
                                size="small">
                                <IconUrl path={"ic-argent"} color={"white"}/>
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </TableCell>

            </TableRowStyled>
        </>
    );
}

export default UpaidConsultRow;
