import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement} from "react";
import {Card, CardContent,} from "@mui/material";
import {DashLayout} from "@features/base";
import {InsuranceDocket} from "@features/insuranceDocket";

function CashboxInsurance() {
    return (
        <Card>
            <CardContent>
                <InsuranceDocket/>
            </CardContent>
        </Card>
    );
}

export const getStaticProps: GetStaticProps = async (context) => {
    return {
        props: {
            fallback: false,
            ...(await serverSideTranslations(context.locale as string, [
                "common",
                "payment",
            ])),
        },
    };
};

CashboxInsurance.auth = true;

CashboxInsurance.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};

export default CashboxInsurance;
