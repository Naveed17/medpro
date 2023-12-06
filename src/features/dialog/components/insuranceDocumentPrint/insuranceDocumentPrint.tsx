import {useInsurances} from "@lib/hooks/rest";
import React, {useState} from "react";
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useInvalidateQueries, useMedicalEntitySuffix} from "@lib/hooks";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {PDFDocument} from 'pdf-lib';
import {agendaSelector} from "@features/calendar";
import {onOpenPatientDrawer, Otable} from "@features/table";
import {NoDataCard} from "@features/card";
import IconUrl from "@themes/urlIcon";

function InsuranceDocumentPrint({...props}) {
    const {data: {appuuid, state: patient, t, setOpenDialog}} = props;
    const router = useRouter();
    const {insurances} = useInsurances();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const {trigger: invalidateQueries} = useInvalidateQueries();
    const dispatch = useAppDispatch();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);
    const {config: agenda} = useAppSelector(agendaSelector);

    const [file, setFile] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const {trigger: triggerInsuranceDocs} = useRequestQueryMutation("consultation/insurances/document");

    const {trigger: triggerDocInsurance} = useRequestQueryMutation("insurance/document");

    const docInsurances = patient.insurances?.reduce((docs: any[], doc: any) => [
        ...(docs ?? []),
        ...(doc?.insurance?.documents.length > 0 ? [{
            ...doc?.insurance,
            logoUrl: insurances.find(insurance => insurance.uuid === doc?.insurance?.uuid)?.logoUrl ?? ""
        }] : [])], []) ?? [];

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
                generateInsuranceDoc(data?.uuid, backgroundDoc);
                break;
        }
    }

    return (
        <>
            {docInsurances.length > 0 ? <Otable
                    size="small"
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
                :
                <NoDataCard
                    sx={{mt: 16}}
                    {...{t}}
                    onHandleClick={() => {
                        dispatch(onOpenPatientDrawer({patientId: patient?.uuid}));
                        setOpenDialog(false);
                    }}
                    data={{
                        mainIcon: <IconUrl width={100} height={100} path={"fileadd"}/>,
                        title: t("consultationIP.empty-insurance-docs"),
                        description: t("consultationIP.empty-insurance-docs-description"),
                        buttons: [{
                            text: t("consultationIP.patient-fiche"),
                            variant: "primary",
                            color: "white"
                        }]
                    }}/>
            }

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
