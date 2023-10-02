import {useInsurances} from "@lib/hooks/rest";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
import {Avatar, ListSubheader, Stack, Typography} from "@mui/material";
import {ImageHandler} from "@features/image";
import React, {useState} from "react";
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";

import {PDFDocument} from 'pdf-lib';
import {LoadingButton} from "@mui/lab";

function InsuranceDocumentPrint({...props}) {
    const {data: {appuuid, state: patient, t}} = props;
    const router = useRouter();
    const {insurances} = useInsurances();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [file, setFile] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const {trigger: triggerInsuranceDocs} = useRequestQueryMutation("consultation/insurances/document");

    const docInsurances = insurances?.filter(insurance => (insurance?.documents ?? []).length > 0) ?? [];

    const generateInsuranceDoc = (insuranceDocument: string, background = false) => {
        medicalEntityHasUser && triggerInsuranceDocs({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/appointments/${appuuid}/insurance-document/${insuranceDocument}/${router.locale}`,
        }, {
            onSuccess: async (result: any) => {
                const document = result?.data as any;
                if (background) {
                    const pdfDoc = await PDFDocument.create();
                    const docUpdated = await fetch(`data:application/pdf;base64,${document}`).then((res) => res.arrayBuffer());
                    const cnam = await fetch('/static/files/cnam.pdf').then((res) => res.arrayBuffer());
                    const firstDonorPdfDoc = await PDFDocument.load(cnam)
                    const [CNAMDocP1] = await pdfDoc.copyPages(firstDonorPdfDoc, [0]);
                    const [CNAMDocP2] = await pdfDoc.copyPages(firstDonorPdfDoc, [1]);
                    const [cnamPatientInfoP1] = await pdfDoc.embedPdf(docUpdated, [0]);
                    const [cnamPatientInfoP2] = await pdfDoc.embedPdf(docUpdated, [1]);
                    const page1 = pdfDoc.addPage(CNAMDocP1);
                    page1.drawPage(cnamPatientInfoP1, {x: 0, y: 5});
                    const page2 = pdfDoc.addPage(CNAMDocP2);
                    page2.drawPage(cnamPatientInfoP2, {x: 0, y: 32});
                    const mergedPdf = await pdfDoc.saveAsBase64({dataUri: true});
                    setFile(mergedPdf);
                } else {
                    setFile(`data:application/pdf;base64,${document}`)
                }
            },
            onSettled: () => setLoading(false)
        });
    }

    return (
        <>
            <List
                sx={{width: '100%', bgcolor: 'background.paper'}}
                subheader={<ListSubheader>Demande de Prise en charge</ListSubheader>}>
                {docInsurances.map(insurance => <ListItem sx={{px: 2}} key={insurance.uuid} disablePadding>
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
                    <Stack direction={"row"} spacing={1.2} sx={{display: "contents"}}>
                        <LoadingButton
                            {...{loading}}
                            loadingPosition={"start"}
                            startIcon={<LocalPrintshopOutlinedIcon/>}
                            onClick={e => {
                                e.stopPropagation();
                                setLoading(true);
                                insurance.documents && generateInsuranceDoc(insurance.documents[0]?.uuid, false);
                            }} size="small">
                            <Typography>{t("print_document_result")}</Typography>
                        </LoadingButton>
                        <LoadingButton
                            {...{loading}}
                            loadingPosition={"start"}
                            startIcon={<LocalPrintshopRoundedIcon/>}
                            onClick={e => {
                                e.stopPropagation();
                                setLoading(true);
                                insurance.documents && generateInsuranceDoc(insurance.documents[0]?.uuid, true);
                            }} size="small">
                            <Typography>{t("print_document_background")}</Typography>
                        </LoadingButton>
                    </Stack>
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
