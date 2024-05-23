import React, {useState} from 'react';
import InsuranceStyled from "@features/patientInsurance/components/overrides/insuranceStyled";
import {useTranslation} from "next-i18next";
import {Otable} from "@features/table";
import {DesktopContainer} from "@themes/desktopConainter";
import {useRequestQuery} from "@lib/axios";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";

const headCells = [
    {
        id: "insurance",
        numeric: false,
        disablePadding: true,
        label: "insurance",
        align: "left",
        sortable: true,
    },
    /*{
        id: "start_date",
        numeric: false,
        disablePadding: false,
        label: "start_date",
        align: "center",
        sortable: false,
    },
    {
        id: "end_date",
        numeric: true,
        disablePadding: false,
        label: "end_date",
        align: "center",
        sortable: false,
    },*/
    {
        id: "amount",
        numeric: false,
        disablePadding: false,
        label: "total",
        align: "center",
        sortable: true,
    },
/*    {
        id: "label",
        numeric: false,
        disablePadding: false,
        label: "label",
        align: "center",
        sortable: true,
    },
    */
];

const InsuranceDocket = ({...props}) => {
    const {filterCB} = props;

    const {t} = useTranslation(["payment", "common"]);

    const noAppData = {
        mainIcon: "ic-assurance",
        title: "insurance.noInsurance",
        description: "insurance.addInsurance"
    };

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const router = useRouter();

    const {data: httpInsurances, mutate} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/insurances/list/${router.locale}?start_date=${filterCB.start_date}&end_date=${filterCB.end_date}`,
    });
    const insuranceList = httpInsurances?.data;
    const handleTableActions = (props: { action: string, event: MouseEvent, data: any }) => {
        const {data} = props;
        router.push(`cashbox/insurance/${data.uuid}`)
    }

    return (
        <InsuranceStyled spacing={1}>
            <DesktopContainer>
                <Otable
                    headers={headCells}
                    rows={insuranceList}
                    handleEvent={handleTableActions}
                    state={null}
                    from={"agreements"}
                    t={t}
                    edit={null}/>
            </DesktopContainer>
        </InsuranceStyled>
    );
}


export default InsuranceDocket;
