import React from 'react'
import PaymentDialogStyled from './overrides/paymentDialogStyle';
import { Stack, Avatar, Typography, Theme, Button, Box, Divider } from '@mui/material'
import IconUrl from '@themes/urlIcon';
import { Otable } from '@features/table';
const rows = [
    {
        uuid: 1,
        date: {
            date1: '10/10/2022',
            date2: "10 Avril 2022",
        },
        time: "15:30",
        method: {
            name: 'credit_card',
            icon: "ic-card-pen"
        },
        amount: 200


    },

];
interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
    sortable: boolean;
    align: "left" | "right" | "center";
}
const headCells: readonly HeadCell[] = [

    {
        id: "date",
        numeric: false,
        disablePadding: true,
        label: "date",
        sortable: true,
        align: "left",
    },
    {
        id: "amount",
        numeric: true,
        disablePadding: false,
        label: "amount",
        sortable: true,
        align: "left",
    },
    {
        id: "method",
        numeric: true,
        disablePadding: false,
        label: "method",
        sortable: true,
        align: "right",
    },


];
function PaymentDialog({ ...props }) {
    const { data: { t } } = props
    const img = null;
    return (
        <PaymentDialogStyled>
            <Stack spacing={2} direction="row" alignItems='center' justifyContent="space-between">
                <Stack spacing={2} direction="row" alignItems='center'>
                    <Avatar {...(img ? { src: img, alt: 'some-name', sx: { bgcolor: 'transparent' } } : { sx: { bgcolor: (theme: Theme) => theme.palette.primary.main } })} />
                    <Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <IconUrl path="ic-h" />
                            <Typography color="primary">
                                Asma Anderson
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <IconUrl path="ic-anniverssaire" />
                            <Typography variant='body2' color="text.secondary" alignItems='center'>
                                07/05/2016
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Button size='small' variant='contained' color="error">
                        {t("btn_remain")}
                        <Typography fontWeight={700} component='strong' mx={1}>100</Typography>
                        TND
                    </Button>
                    <Button size='small' variant='contained' color="warning">
                        {t("total")}
                        <Typography fontWeight={700} component='strong' mx={1}>100</Typography>
                        TND
                    </Button>
                </Stack>
            </Stack>
            <Box mt={4}>
                <Otable
                    headers={headCells}
                    rows={rows}
                    from={"payment_dialog"}
                    sx={{ tableLayout: 'fixed' }}
                    t={t}

                />
                <Divider />
            </Box>
        </PaymentDialogStyled>
    )
}

export default PaymentDialog