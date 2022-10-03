import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useState } from "react";
import { Box, Typography, Stack, Button, DialogActions, } from "@mui/material";
import { SubHeader } from "@features/subHeader";
import { DashLayout } from "@features/base";
import { LoadingScreen } from "@features/loadingScreen";
import { Otable } from "@features/table";
import { useTranslation } from "next-i18next";
import { Dialog } from "@features/dialog";
import IconUrl from "@themes/urlIcon";
import CloseIcon from "@mui/icons-material/Close";
const rows = [
    {
        uuid: 1,
        date: "10/10/2022",
        time: "15:30",
        name: 'Ali tounsi',
        insurance: {
            img: 'assurance-2',
            name: "CARTE ASSURANCES"
        },
        type: "consultation",
        payment_type: ['ic-argent', 'ic-card-pen'],
        billing_status: "yes",
        amount: 200


    },
    {
        uuid: 2,
        date: "10/10/2022",
        time: "15:30",
        name: 'Ali tounsi',
        insurance: {
            img: 'assurance-2',
            name: "CARTE ASSURANCES"
        },
        type: "consultation",
        payment_type: ['ic-argent'],
        billing_status: "no",
        amount: -200


    },
    {
        uuid: 3,
        date: "10/10/2022",
        time: "15:30",
        name: 'Ali tounsi',
        insurance: {
            img: 'assurance-2',
            name: "CARTE ASSURANCES"
        },
        type: "consultation",
        payment_type: ['ic-argent'],
        billing_status: "yes",
        amount: 0


    },
    {
        uuid: 4,
        date: "10/10/2022",
        time: "15:30",
        name: 'Ali tounsi',
        insurance: {
            img: 'assurance-2',
            name: "CARTE ASSURANCES"
        },
        type: "consultation",
        payment_type: ['ic-argent'],
        billing_status: "",
        amount: 100


    },
    {
        uuid: 5,
        date: "10/10/2022",
        time: "15:30",
        name: 'Ali tounsi',
        insurance: {
            img: 'assurance-2',
            name: "CARTE ASSURANCES"
        },
        type: "",
        payment_type: ['ic-argent'],
        billing_status: "yes",
        amount: -10


    },
    {
        uuid: 6,
        date: "10/10/2022",
        time: "15:30",
        name: 'Ali tounsi',
        insurance: "",
        type: "check",
        payment_type: ['ic-argent'],
        billing_status: "yes",
        amount: 10,
        collapse: [
            {
                uuid: 61,
                date: "10/10/2022",
                time: "15:30",
                payment_type: [{
                    name: 'credit_card',
                    icon: 'ic-argent'
                }],
                billing_status: "yes",
                amount: 10,
            },
            {
                uuid: 62,
                date: "10/10/2022",
                time: "15:30",
                payment_type: [{
                    name: 'credit_card',
                    icon: 'ic-argent'
                }],
                billing_status: "yes",
                amount: 10,
            }
        ]

    },
    {
        uuid: 7,
        date: "10/10/2022",
        time: "15:30",
        name: '',
        insurance: "",
        type: "check",
        payment_type: ['ic-argent'],
        billing_status: "yes",
        amount: 10,



    },
    {
        uuid: 8,
        date: "10/10/2022",
        date2: "10 Avril 2022",
        time: "15:30",
        name: 'Asma Anderson',
        insurance: "",
        type: "check",
        payment_type: ['ic-argent'],
        billing_status: "yes",
        amount: 10,
        pending: 600,
        method: {
            name: 'credit_card',
            icon: "ic-card"
        },



    }
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
        id: "select-all",
        numeric: false,
        disablePadding: true,
        label: "checkbox",
        sortable: false,
        align: "left",
    },
    {
        id: "date",
        numeric: false,
        disablePadding: true,
        label: "date",
        sortable: true,
        align: "left",
    },
    {
        id: "time",
        numeric: true,
        disablePadding: false,
        label: "time",
        sortable: true,
        align: "left",
    },
    {
        id: "name",
        numeric: true,
        disablePadding: false,
        label: "name",
        sortable: true,
        align: "left",
    },
    {
        id: "insurance",
        numeric: true,
        disablePadding: false,
        label: "insurance",
        sortable: true,
        align: "left",
    },
    {
        id: "type",
        numeric: true,
        disablePadding: false,
        label: "type",
        sortable: true,
        align: "left",
    },
    {
        id: "payment_type",
        numeric: true,
        disablePadding: false,
        label: "payment_type",
        sortable: true,
        align: "left",
    },
    {
        id: "billing_status",
        numeric: true,
        disablePadding: false,
        label: "billing_status",
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

];
function Payment() {
    const [open, setOpen] = useState<boolean>(false)
    const [selected, setSelected] = useState<any>(null)
    const { t, ready } = useTranslation("payment");
    const handleClose = () => setOpen(false);
    const handleSave = () => setOpen(false);
    const handleEdit = (props: any) => {
        setSelected(props);
        setOpen(true);
    }
    return (
        <>
            <SubHeader>
                <Stack direction='row' width={1} justifyContent="space-between" alignItems="center">
                    <Typography>{t('path')}</Typography>
                    <Stack direction='row' spacing={3} alignItems="center">
                        <Typography variant="subtitle2">{t('total')}</Typography>
                        <Typography variant="h6">1 140 TND</Typography>
                        <Stack direction='row' spacing={1} alignItems="center">
                            <Typography variant="h6">I</Typography>
                            <Button variant="contained" color="error">
                                - {t('btn_header_1')}
                            </Button>
                            <Button variant="contained" color="success"
                                onClick={() => { setOpen(true); setSelected(null); }}
                            >
                                + {t('btn_header_2')}
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>
            </SubHeader>
            <Box className="container">
                <Otable
                    headers={headCells}
                    rows={rows}
                    from={"payment"}
                    t={t}
                    edit={handleEdit}

                />
            </Box>
            <Dialog action={'payment_dialog'}
                open={open}
                data={{ t, selected }}
                size={"md"}
                direction={'ltr'}
                title={t('dialog_title')}
                dialogClose={handleClose}
                actionDialog={
                    <DialogActions>
                        <Button onClick={handleClose}
                            startIcon={<CloseIcon />}>
                            {t('cancel')}
                        </Button>
                        <Button variant="contained"
                            onClick={handleSave}

                            startIcon={<IconUrl
                                path='ic-dowlaodfile' />}>
                            {t('save')}
                        </Button>
                    </DialogActions>
                }
            />

        </>
    )
}

export const getStaticProps: GetStaticProps = async (context) => {
    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(context.locale as string, ['common', 'menu', 'payment']))
        }
    }
}

Payment.auth = true

Payment.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashLayout>
            {page}
        </DashLayout>
    )
}

export default Payment
