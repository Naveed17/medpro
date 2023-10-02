import {useInsurances} from "@lib/hooks/rest";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LocalPrintshopOutlinedIcon from '@mui/icons-material/LocalPrintshopOutlined';
import {Avatar, IconButton, ListSubheader, Typography} from "@mui/material";
import {ImageHandler} from "@features/image";
import React, {useState} from "react";
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useMedicalEntitySuffix} from "@lib/hooks";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import CircularProgress from "@mui/material/CircularProgress";
import {PDFDocument} from 'pdf-lib';

function InsuranceDocumentPrint({...props}) {
    const {data: {appuuid, state: patient}} = props;
    const router = useRouter();
    const {insurances} = useInsurances();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();

    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [file, setFile] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const {trigger: triggerInsuranceDocs} = useRequestQueryMutation("consultation/insurances/document");

    const docInsurances = insurances?.filter(insurance => (insurance?.documents ?? []).length > 0) ?? [];

    const generateInsuranceDoc = (insuranceDocument: string) => {
        medicalEntityHasUser && triggerInsuranceDocs({
            method: "GET",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/patients/${patient?.uuid}/appointments/${appuuid}/insurance-document/${insuranceDocument}/${router.locale}`,
        }, {
            onSuccess: async (result: any) => {
                setLoading(false);
                //const merger = new PDFMerger();
                const pdfDoc = await PDFDocument.create();
                const document = result?.data as any;
                //const generatedDoc = new Blob([atob(document)], {type: 'application/pdf'}); // Create a BLOB object
                const docUpdated = await fetch(`data:application/pdf;base64,${document}`).then((res) => res.arrayBuffer());
                const cnam = await fetch('/static/files/cnam.pdf').then((res) => res.arrayBuffer());
                const firstDonorPdfDoc = await PDFDocument.load(cnam)
                const [CNAMDocP1] = await pdfDoc.copyPages(firstDonorPdfDoc, [0]);
                const [CNAMDocP2] = await pdfDoc.copyPages(firstDonorPdfDoc, [1]);
                const [cnamPatientInfoP1] = await pdfDoc.embedPdf(docUpdated, [0]);
                const [cnamPatientInfoP2] = await pdfDoc.embedPdf(docUpdated, [1]);
                const page1 = pdfDoc.addPage(CNAMDocP1);
                page1.drawPage(cnamPatientInfoP1, {x: 0, y: 0, width: 841, height: 595});
                const page2 = pdfDoc.addPage(CNAMDocP2);
                page2.drawPage(cnamPatientInfoP2, {x: 0, y: 0, width: 841, height: 595});
                const mergedPdf = await pdfDoc.saveAsBase64({dataUri: true});
                setFile(mergedPdf);

                /*fetch('/static/files/cnam.pdf').then(response => {
                    response.blob().then(async blob => {
                        // Creating new object of PDF file
                        await merger.add(blob);
                        await merger.add(generatedDoc);
                        const mergedPdf = await merger.saveAsBlob();
                        setFile(URL.createObjectURL(mergedPdf));
                    })
                })*/

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
                                disabled={loading}
                                onClick={e => {
                                    setLoading(true);
                                    e.stopPropagation();
                                    insurance.documents && generateInsuranceDoc(insurance.documents[0]?.uuid);
                                }} size="small">
                                {loading ?
                                    <CircularProgress
                                        size={20}
                                        color="inherit"/> :
                                    <LocalPrintshopOutlinedIcon/>}
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
