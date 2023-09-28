import {useInsurances} from "@lib/hooks/rest";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import {IconButton, ListSubheader} from "@mui/material";
import {ImageHandler} from "@features/image";
import React from "react";
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";

function InsuranceDocumentPrint({...props}) {
    const {data: {appuuid, state: patient}} = props;
    const router = useRouter();
    const {insurances} = useInsurances();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const {trigger: triggerInsuranceDocs} = useRequestQueryMutation("consultation/insurances/document");

    const docInsurances = insurances?.filter(insurance => (insurance?.documents ?? []).length > 0) ?? [];

    const generateInsuranceDoc = (insuranceDocument: string) => {
        medicalEntityHasUser && triggerInsuranceDocs({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/appointments/${appuuid}/insurance-document/${insuranceDocument}/${router.locale}`,
        }, {
            onSuccess: (data) => console.log("data", data)
        });
    }

    return (
        <List
            sx={{width: '100%', bgcolor: 'background.paper'}}
            subheader={<ListSubheader>Demande de Prise en charge</ListSubheader>}>
            {docInsurances.map(insurance => <ListItem key={insurance.uuid} disablePadding>
                <ListItemButton dense>
                    <ImageHandler
                        alt={insurance.name}
                        src={insurance.logoUrl.url}
                    />
                    <ListItemText primary={insurance.name}/>
                    <ListItemIcon>
                        <IconButton
                            onClick={e => {
                                e.stopPropagation();
                                generateInsuranceDoc(insurance.documents[0].uuid);
                            }} size="small">
                            <LocalPrintshopOutlinedIcon/>
                        </IconButton>
                    </ListItemIcon>
                </ListItemButton>
            </ListItem>)}
        </List>)
}

export default InsuranceDocumentPrint;
