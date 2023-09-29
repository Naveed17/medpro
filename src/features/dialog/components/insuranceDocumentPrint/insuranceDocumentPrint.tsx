import {useInsurances} from "@lib/hooks/rest";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import {Avatar, Button, IconButton, ListSubheader, Stack, Typography} from "@mui/material";
import {ImageHandler} from "@features/image";
import React, {useState} from "react";
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {configSelector, dashLayoutSelector} from "@features/base";
import CloseIcon from "@mui/icons-material/Close";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {Dialog} from "@features/dialog";
import {Document} from "react-pdf";

function InsuranceDocumentPrint({...props}) {
    const {data: {appuuid, state: patient}} = props;
    const router = useRouter();
    const {insurances} = useInsurances();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {direction} = useAppSelector(configSelector);

    const [file, setFile] = useState<string | null>(null);
    const {trigger: triggerInsuranceDocs} = useRequestQueryMutation("consultation/insurances/document");

    const docInsurances = insurances?.filter(insurance => (insurance?.documents ?? []).length > 0) ?? [];

    const generateInsuranceDoc = (insuranceDocument: string) => {
        medicalEntityHasUser && triggerInsuranceDocs({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/appointments/${appuuid}/insurance-document/${insuranceDocument}/${router.locale}`,
        }, {
            onSuccess: (result: any) => {
                const document = result?.data as any;
                setFile(`data:application/pdf;base64,${document}`);
            }
        });
    }

    return (
        <>
            <List
                sx={{width: '100%', bgcolor: 'background.paper'}}
                subheader={<ListSubheader>Demande de Prise en charge</ListSubheader>}>
                {docInsurances.map(insurance => <ListItem key={insurance.uuid} disablePadding>
                    <ListItemButton dense>
                        <ListItemIcon>
                            <Avatar variant={"circular"}>
                                <ImageHandler
                                    alt={insurance.name}
                                    src={insurance.logoUrl.url}
                                />
                            </Avatar>
                        </ListItemIcon>
                        <ListItemText
                            primary={<Typography fontWeight={700} component='strong'>{insurance.name}</Typography>}/>
                        <ListItemIcon sx={{display: "contents"}}>
                            <IconButton
                                onClick={e => {
                                    e.stopPropagation();
                                    insurance.documents && generateInsuranceDoc(insurance.documents[0]?.uuid);
                                }} size="small">
                                <LocalPrintshopOutlinedIcon/>
                            </IconButton>
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>)}
            </List>

            {file && <embed
                src={file}
                id="displayFile"
                width="100%"
                height="99%"
                style={{borderStyle: "solid"}}
                type="application/pdf"
            />}
            {/*<Dialog
                {...{
                    direction,
                    sx: {
                        minHeight: 300,
                    },
                }}
                action={"document_detail"}
                open={openDocumentDialog}
                data={{
                    state,
                    app_uuid,
                    agenda: agenda?.uuid,
                    patient: {
                        uuid: sheet?.patient,
                        ...patient
                    },
                    setState
                }}
                size={"lg"}
                sx={{p: 0}}
                title={t("doc_detail_title")}
                onClose={handleCloseDialog}
            />*/}
        </>
    )
}

export default InsuranceDocumentPrint;
