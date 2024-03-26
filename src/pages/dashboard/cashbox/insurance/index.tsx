import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useContext, useEffect, useState} from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Drawer,
    LinearProgress,
    MenuItem,
    Stack,
    Tab,
    Tabs,
    tabsClasses,
    Theme,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import {SubHeader} from "@features/subHeader";
import {configSelector, DashLayout} from "@features/base";
import {onOpenPatientDrawer, Otable, tableActionSelector} from "@features/table";
import {useTranslation} from "next-i18next";
import IconUrl from "@themes/urlIcon";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {NewCashboxMobileCard, NoDataCard, UnpaidConsultationCard} from "@features/card";
import {DesktopContainer} from "@themes/desktopConainter";
import {MobileContainer} from "@themes/mobileContainer";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {Session} from "next-auth";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {Dialog, PatientDetail} from "@features/dialog";
import {DefaultCountry} from "@lib/constants";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useCashBox, useInsurances} from "@lib/hooks/rest";
import {CashboxFilter, cashBoxSelector, setSelectedTabIndex} from "@features/leftActionBar";
import {generateFilter} from "@lib/hooks/generateFilter";
import CloseIcon from "@mui/icons-material/Close";
import {DrawerBottom} from "@features/drawerBottom";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {ActionMenu} from "@features/menu";
import {LoadingButton} from "@mui/lab";
import {TabPanel} from "@features/tabPanel";
import moment from "moment-timezone";
import {agendaSelector, setNavigatorMode} from "@features/calendar";
import {saveAs} from "file-saver";
import {ImageHandler} from "@features/image";
import {LoadingScreen} from "@features/loadingScreen";
import Can, {AbilityContext} from "@features/casl/can";
import {ToggleButtonStyled} from "@features/toolbar";
import {InsuranceDocket} from "@features/insuranceDocket";

const noCardData = {
    mainIcon: "ic-unpaid",
    title: "no-data.title",
    description: "no-data.description",
};
const noAppData = {
    mainIcon: "ic-agenda",
    title: "no-data.title_consult",
};

function CashboxInsurance() {
    const {data: session} = useSession();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const theme: Theme = useTheme();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {t, ready, i18n} = useTranslation(["payment", "common"]);
    const {config: agenda, mode} = useAppSelector(agendaSelector);

    // ******** States ********

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const doctor_country = medical_entity.country ? medical_entity.country : DefaultCountry;
    const devise = doctor_country.currency?.name;

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

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
