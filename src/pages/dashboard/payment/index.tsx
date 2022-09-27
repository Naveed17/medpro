import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactElement, useState } from "react";
import { Box, Typography } from "@mui/material";
import { SubHeader } from "@features/subHeader";
import { DashLayout } from "@features/base";
import { LoadingScreen } from "@features/loadingScreen";
import { Otable } from "@features/table";
import { useTranslation } from "next-i18next";
const rows = [
    {
        uuid: 1,
        color: 'success',
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
        amount: 200


    },
    {
        uuid: 2,
        color: 'success',
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
        amount: 200


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
    const { t, ready } = useTranslation("payment");
    return (
        <>
            <SubHeader>
                Payment
            </SubHeader>
            <Box className="container">
                <Otable
                    headers={headCells}
                    rows={rows}
                    from={"payment"}
                    t={t}

                />
            </Box>
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
