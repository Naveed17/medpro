import React, {useState} from 'react';
import InsuranceStyled from "@features/patientInsurance/components/overrides/insuranceStyled";
import {Box, Collapse, IconButton, Stack, Typography} from "@mui/material";
import {NoDataCard} from "@features/card";
import AddIcon from "@mui/icons-material/Add";
import AddInsurance from "@features/patientInsurance/components/addInsurance";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CardInsurance from "@features/patientInsurance/components/cardInsurance";
import {useTranslation} from "next-i18next";
import {Otable} from "@features/table";
import {DesktopContainer} from "@themes/desktopConainter";
import {useInsurances} from "@lib/hooks/rest";
import {useRequestQuery} from "@lib/axios";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useRouter} from "next/router";

const headCells = [
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "name",
        align: "left",
        sortable: true,
    },
    {
        id: "label",
        numeric: false,
        disablePadding: false,
        label: "label",
        align: "center",
        sortable: true,
    },
    {
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
    },
    {
        id: "empty",
        numeric: false,
        disablePadding: false,
        label: "empty",
        align: "center",
        sortable: false,
    },
];

const InsuranceDocket = ({...props}) => {
    const {patientInsurances,mutatePatientInsurances,patient} = props;

    const {t} = useTranslation(["patient", "common"]);

    const noAppData = {
        mainIcon: "ic-assurance",
        title: "insurance.noInsurance",
        description: "insurance.addInsurance"
    };

    const [addNew, setAddNew] = useState(false);
    const [selectedInsurance, setSelectedInsurance] = useState("");

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const router = useRouter();

    const {data: httpInsurances,mutate} = useRequestQuery({
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser}/insurances/${router.locale}`,
    });

    const insuranceList = httpInsurances?.data;
    console.log(insuranceList);

    const handleTableActions = (props: { action: string, event: MouseEvent, data: any }) => {
        const {action, event, data} = props;
        console.log(data)
        router.push(`cashbox/insurance/${data.uuid}`)
    }

        return (
        <InsuranceStyled spacing={1}>
            <DesktopContainer>
                <Otable
                    /*toolbar={<Toolbar {...{t, search, handleSearch}} />}*/
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
