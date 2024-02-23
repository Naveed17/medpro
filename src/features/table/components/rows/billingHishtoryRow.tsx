import React from "react";
import TableCell from "@mui/material/TableCell";
import { IconButton, Typography, Skeleton, Stack, useTheme } from "@mui/material";
import IconUrl from "@themes/urlIcon";
import { TableRowStyled } from "@features/table";
import { uniqueId } from "lodash";
import { Label } from "@features/label";
import { DefaultCountry } from "@lib/constants";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
function BillingHistory({ ...props }) {
    const { row, t } = props;
    const theme = useTheme();
    const { data: session } = useSession();
    const { data: user } = session as Session;

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;
    return (
        <TableRowStyled>
            <TableCell>
                {row ? (

                    <Stack direction='row' alignItems="center" spacing={.5}>
                        <IconUrl path='ic-agenda-jour' width={14} height={14} />
                        <Typography fontSize={13} fontWeight={600}>
                            10/10/2023
                        </Typography>
                    </Stack>


                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell>
                {row ? (
                    <Typography textAlign='center' color='primary' fontWeight={600}>
                        N19/2023
                    </Typography>

                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>

            <TableCell>
                {row ? (
                    <Typography color="textPrimary" textAlign='center' fontWeight={600}>
                        Invoice 2023
                    </Typography>

                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell>
                {row ? (
                    <Typography color="textPrimary" textAlign='center' fontWeight={600}>
                        4980 {devise}
                    </Typography>

                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
            <TableCell align="center">
                {row ? (
                    <Label color="success">
                        {t("table.paid")}
                    </Label>

                ) : (
                    <Skeleton variant="text" width={100} />
                )}
            </TableCell>
        </TableRowStyled>
    );
}

export default BillingHistory;
