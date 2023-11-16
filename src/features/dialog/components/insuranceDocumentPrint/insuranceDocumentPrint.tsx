import {useInsurances} from "@lib/hooks/rest";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
import {Avatar, Checkbox, FormControlLabel, ListSubheader, Stack, Typography} from "@mui/material";
import {ImageHandler} from "@features/image";
import React, {useState} from "react";
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {PDFDocument} from 'pdf-lib';
import {LoadingButton} from "@mui/lab";
import {agendaSelector} from "@features/calendar";
import {Otable} from "@features/table";

function InsuranceDocumentPrint({...props}) {
    const {data: {appuuid, state: patient, t}} = props;
    const router = useRouter();
    const {insurances} = useInsurances();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {trigger: invalidateQueries} = useInvalidateQueries();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {config: agenda} = useAppSelector(agendaSelector);

    const [file, setFile] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const {trigger: triggerInsuranceDocs} = useRequestQueryMutation("consultation/insurances/document");

    const {trigger: triggerDocInsurance} = useRequestQueryMutation("insurance/document");

    const docInsurances = insurances?.filter(insurance => (insurance?.documents ?? []).length > 0) ?? [];

    const generateInsuranceDoc = (insuranceDocument: string, backgroundDoc: boolean) => {
        medicalEntityHasUser && triggerInsuranceDocs({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/appointments/${appuuid}/insurance-document/${insuranceDocument}/${router.locale}`,
        }, {
            onSuccess: async (result: any) => {
                const document = result?.data as any;
                if (backgroundDoc) {
                    const pdfDoc = await PDFDocument.create();
                    const docUpdated = await fetch(`data:application/pdf;base64,${document}`).then((res) => res.arrayBuffer());
                    triggerDocInsurance({
                        method: "GET",
                        url: `/api/public/insurances/documents/${insuranceDocument}/${router.locale}`
                    }, {
                        onSuccess: async (result: any) => {
                            const data = (result?.data as HttpResponse)?.data;
                            const docFile = await fetch(data.url).then((res) => res.arrayBuffer());
                            const firstDonorPdfDoc = await PDFDocument.load(docFile);
                            const [CNAMDocP1] = await pdfDoc.copyPages(firstDonorPdfDoc, [0]);
                            const [CNAMDocP2] = await pdfDoc.copyPages(firstDonorPdfDoc, [1]);
                            const [cnamPatientInfoP1] = await pdfDoc.embedPdf(docUpdated, [0]);
                            const [cnamPatientInfoP2] = await pdfDoc.embedPdf(docUpdated, [1]);
                            const page1 = pdfDoc.addPage(CNAMDocP1);
                            page1.drawPage(cnamPatientInfoP1, {x: 0, y: 0});
                            const page2 = pdfDoc.addPage(CNAMDocP2);
                            page2.drawPage(cnamPatientInfoP2, {x: 0, y: 28});
                            const mergedPdf = await pdfDoc.saveAsBase64({dataUri: true});
                            setFile(mergedPdf);
                        }
                    })
                } else {
                    setFile(`data:application/pdf;base64,${document}`)
                }
            },
            onSettled: () => {
                setLoading(false);
                invalidateQueries([`${urlMedicalEntitySuffix}/agendas/${agenda?.uuid}/appointments/${appuuid}/documents/${router.locale}`])
            }
        });
    }

    const handleTableEvent = (action: string, data: any, backgroundDoc: boolean) => {
        switch (action) {
            case "onGenerateInsuranceDoc":
                generateInsuranceDoc(data.documents[0]?.uuid, backgroundDoc);
                break;
        }
    }
    return (
        <>
            <Otable
                {...{t, loadingReq: loading}}
                headers={[
                    {
                        id: "insurance",
                        numeric: false,
                        disablePadding: true,
                        label: "insurance",
                        sortable: true,
                        align: "left",
                    }, {
                        id: "action",
                        label: "action",
                        align: "center",
                        sortable: false,
                    }]}
                handleEvent={handleTableEvent}
                rows={docInsurances}
                from={"insurance"}
            />

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
