import TableCell from "@mui/material/TableCell";
import {Checkbox, Collapse, Skeleton, Stack, Table, TableRow, Typography} from "@mui/material";
import { TableRowStyled} from "@features/table";
import Icon from "@themes/urlIcon";
// redux
import {alpha, Theme} from '@mui/material/styles';

import {Label} from '@features/label';
import React, {useState} from 'react';
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {DefaultCountry} from "@lib/constants";
import moment from "moment-timezone";

function ChequeRow({...props}) {
    const {row, isItemSelected, t, labelId, loading, editMotif} = props;

    const {data: session} = useSession();
    const {data: user} = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const [selected, setSelected] = useState<any>([]);

    const edit = (props: ChequeModel) => {
        if (selected.indexOf(props) != -1) {
            selected.splice(selected.indexOf(props), 1)
        } else {
            selected.push(props);
        }
        setSelected([...selected])
    }

    return (
        <>
            <TableRowStyled
                hover
                onClick={() => {
                  /*  editMotif(row)
                    console.log(selected)*/
                }}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                selected={isItemSelected}
                className="payment-row"
                sx={{
                    bgcolor: (theme: Theme) => alpha(
                        (row.pending && theme.palette.warning.darker)
                        || (row.amount > 0 && theme.palette.success.main)
                        || (row.amount < 0 && theme.palette.error.main)
                        || theme.palette.background.paper,
                        row.amount === 0 ? 1 : 0.1),
                    cursor: row.collapse ? 'pointer' : 'default'
                }}>
                <TableCell padding="checkbox">
                    {loading ? (
                        <Skeleton variant="circular" width={28} height={28}/>
                    ) : (
                        <Checkbox
                            color="primary"
                            checked={selected.some((item: any) => item.uuid === row.uuid)}
                            inputProps={{
                                "aria-labelledby": labelId,
                            }}
                            onChange={(ev) => {
                                //ev.stopPropagation()
                                editMotif(row)
                                edit(row)
                            }}
                        />
                    )}
                </TableCell>
                <TableCell >
                    {row ? (
                        <Typography className="name" variant="body1" color="text.primary">
                            {row.data.check_number}
                        </Typography>
                    ) : (
                        <Skeleton variant="text" width={100}/>
                    )}
                </TableCell><TableCell >
                    {row ? (
                        <Typography className="name" variant="body1" color="text.primary">
                            {row.data.carrier}
                        </Typography>
                    ) : (
                        <Skeleton variant="text" width={100}/>
                    )}
                </TableCell>
                <TableCell >
                    {row ? (
                        <Typography className="name" variant="body1" color="text.primary">
                            {row.data.bank}
                        </Typography>
                    ) : (
                        <Skeleton variant="text" width={100}/>
                    )}
                </TableCell>
                <TableCell align={"center"}>
                    {loading ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Skeleton width={20} height={30}/>
                            <Skeleton width={100}/>
                        </Stack>
                    ) : (
                        <Stack direction='row' alignItems="center" justifyContent={"center"} spacing={1} sx={{
                            '.react-svg': {
                                svg: {
                                    width: 11,
                                    height: 11,
                                    path: {
                                        fill: theme => theme.palette.text.primary
                                    }
                                }
                            }
                        }}>
                            <Icon path="ic-agenda"/>
                            <Typography variant="body2">{moment(row.data.payment_date).format('DD/MM/YYYY')}</Typography>
                        </Stack>
                    )}
                </TableCell>
                <TableCell align={"right"}>
                    {row ? (
                        <Typography  variant="body1" color="text.primary">
                            {row.amount} {devise}
                        </Typography>
                    ) : (
                        <Skeleton variant="text" width={100}/>
                    )}
                </TableCell>
            </TableRowStyled>
            {
                row.collapse &&
                <TableRow>
                    <TableCell colSpan={9} style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderTop: 'none',
                        borderBottom: 'none',
                        padding: 0,
                        lineHeight: 0,
                    }}>
                        <Collapse in={isItemSelected} timeout="auto" unmountOnExit sx={{pl: 6}}>
                            <Table>
                                {
                                    row.collapse.map((col: any, idx: number) => {
                                        return <TableRow hover
                                                         role="checkbox"
                                                         key={idx}
                                                         className="collapse-row"
                                                         sx={{
                                                             bgcolor: (theme: Theme) => theme.palette.background.paper
                                                         }}>
                                            <TableCell style={{backgroundColor: 'transparent', border: 'none'}}
                                                       padding="checkbox">
                                                {loading ? (
                                                    <Skeleton variant="circular" width={28} height={28}/>
                                                ) : (
                                                    <Checkbox
                                                        color="primary"
                                                        checked={selected.some((item: any) => item.uuid === col.uuid)}
                                                        inputProps={{
                                                            "aria-labelledby": labelId,
                                                        }}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell style={{backgroundColor: 'transparent', border: 'none',}}>
                                                {loading ? (
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Skeleton width={20} height={30}/>
                                                        <Skeleton width={100}/>
                                                    </Stack>
                                                ) : (
                                                    <Stack direction='row' alignItems="center" spacing={1} sx={{
                                                        '.react-svg': {
                                                            svg: {
                                                                width: 11,
                                                                height: 11,
                                                                path: {
                                                                    fill: theme => theme.palette.text.primary
                                                                }
                                                            }
                                                        }
                                                    }}>
                                                        <Icon path="ic-agenda"/>
                                                        <Typography variant="body2">{col.date}</Typography>
                                                    </Stack>

                                                )}
                                            </TableCell>
                                            <TableCell style={{backgroundColor: 'transparent', border: 'none',}}>
                                                {loading ? (
                                                    <Stack direction="row" spacing={1} alignItems="left">
                                                        <Skeleton variant="circular" width={20} height={20}/>
                                                        <Skeleton width={100}/>
                                                    </Stack>
                                                ) : (
                                                    <Stack direction='row' alignItems="center" spacing={1} sx={{
                                                        '.react-svg': {
                                                            svg: {
                                                                width: 11,
                                                                height: 11,
                                                                path: {
                                                                    fill: theme => theme.palette.text.primary
                                                                }
                                                            }
                                                        }
                                                    }}>
                                                        <Icon path="ic-time"/>
                                                        <Typography variant="body2">{row.time}</Typography>
                                                    </Stack>

                                                )}
                                            </TableCell>
                                            <TableCell style={{backgroundColor: 'transparent', border: 'none',}}>
                                                {loading ? (
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Skeleton width={20} height={30}/>
                                                        <Skeleton width={20} height={30}/>

                                                    </Stack>
                                                ) : (
                                                    <Stack direction='row' alignItems="center"
                                                           justifyContent='flex-start' spacing={1}>
                                                        {col.payment_type.map((type: any, i: number) =>
                                                            <Stack key={i} direction="row" alignItems="center"
                                                                   spacing={1}>
                                                                <Icon path={type.icon}/>
                                                                <Typography color="text.primary"
                                                                            variant="body2">{t("table." + type.label)}</Typography>
                                                            </Stack>
                                                        )}
                                                    </Stack>

                                                )}
                                            </TableCell>
                                            <TableCell align="left"
                                                       style={{backgroundColor: 'transparent', border: 'none',}}>
                                                {loading ? (
                                                    <Skeleton width={40} height={40}/>

                                                ) : (

                                                    col.billing_status ?

                                                        <Label className="label" variant="ghost"
                                                               color={col.billing_status === "yes" ? "success" : 'error'}>{t('table.' + col.billing_status)}</Label>
                                                        : <Typography>--</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell style={{backgroundColor: 'transparent', border: 'none'}}>
                                                {loading ? (
                                                    <Skeleton width={40} height={20}/>

                                                ) : (
                                                    <Typography
                                                        color={(col.amount > 0 && 'success.main' || col.amount < 0 && 'error.main') || 'text.primary'}
                                                        fontWeight={700}>{col.amount}</Typography>

                                                )}
                                            </TableCell>
                                        </TableRow>

                                    })
                                }


                            </Table>
                        </Collapse>
                    </TableCell>
                </TableRow>
            }
        </>
    );
}

export default ChequeRow;
