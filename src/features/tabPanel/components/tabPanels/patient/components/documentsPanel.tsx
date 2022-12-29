import React, {useState} from "react";
import {useTranslation} from "next-i18next";

// material
import {
    AppBar, Box,
    CardContent,
    Checkbox, Divider,
    FormControlLabel,
    Toolbar,
    Typography,
    useMediaQuery,
} from "@mui/material";

//components
import {DocumentCard, NoDataCard, PatientDetailsDocumentCard} from "@features/card";
import {uniqueId} from "lodash";
import {Dialog} from "@features/dialog";
import ImageViewer from "react-simple-image-viewer";
import {LoadingScreen} from "@features/loadingScreen";
import PanelCardStyled from "./overrides/panelCardStyled";
import Icon from "@themes/urlIcon";
import {useRequest} from "@app/axios";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";

const typeofDocs = [
    "medical-imaging",
    "analyse", "requested-analysis",
    "prescription", "photo", "rapport", "medical-certificate", "audio"];

const AddAppointmentCardData = {
    mainIcon: "ic-doc",
    title: "config.no-data.documents.title",
    description: "config.no-data.documents.description",
    buttons: [{
        text: "config.no-data.documents.button-text",
        icon: <Icon path={"ic-doc"} width={"18"} height={"18"}/>,
        variant: "primary",
        color: "white"
    }]
};

function DocumentsPanel({...props}) {
    const {documents, patient, patientId, setOpenUploadDialog} = props;
    const router = useRouter();
    const {data: session} = useSession();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    // filter checked array
    const [checked, setChecked] = useState<PatientDocuments[]>(documents);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [document, setDocument] = useState<any>();
    const [isViewerOpen, setIsViewerOpen] = useState<string>('');

    const {data: httpPatientDocumentsResponse, mutate: mutatePatientDocuments} = useRequest(patientId ? {
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/patients/${patientId}/documents/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`},
    } : null);

    // handle change for checkboxes
    const handleToggle =
        (value: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) {
                setSelectedTypes([...selectedTypes, value])
            } else {
                selectedTypes.splice(selectedTypes.indexOf(value), 1);
                setSelectedTypes([...selectedTypes])
            }
        };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const showDoc = (card: any) => {
        if (card.documentType === 'medical-certificate') {
            setOpenDialog(true);
            setDocument({
                uuid: card.uuid,
                content: card.certificate[0].content,
                doctor: card.name,
                patient: `${patient.firstName} ${patient.lastName}`,
                days: card.days,
                name: 'certif',
                type: 'write_certif',
                mutate: document,
            })
            setOpenDialog(true);
        } else {
            setOpenDialog(true);
            let info = card
            let uuidDoc = "";
            switch (card.documentType) {
                case "prescription":
                    info = card.prescription[0].prescription_has_drugs;
                    uuidDoc = card.prescription[0].uuid
                    break;
                case "requested-analysis":
                    info = card.requested_Analyses[0].analyses;
                    break;
                case "requested-medical-imaging":
                    info = card.medical_imaging[0]['medical-imaging'];
                    break;
            }
            setDocument({
                uuid: card.uuid,
                uri: card.uri,
                name: card.title,
                type: card.documentType,
                info: info,
                uuidDoc: uuidDoc,
                patient: patient.firstName + ' ' + patient.lastName,
                mutate: document
            })
            setOpenDialog(true);
        }
    }
    // query media for mobile
    const isMobile = useMediaQuery("(max-width:600px)");
    // translation
    const {t, ready} = useTranslation(["consultation", "patient",]);

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    const patientDocuments = (httpPatientDocumentsResponse as HttpResponse)?.data;

    return (
        <>
            {documents.length > 0 ? (
                <PanelCardStyled
                    className={"container"}
                    sx={{
                        "& .MuiCardContent-root": {
                            background: "white"
                        },
                        "& .injected-svg": {
                            maxWidth: 30,
                            maxHeight: 30
                        }
                    }}
                >
                    <CardContent>
                        <AppBar position="static" color={"transparent"} className={"app-bar-header"}>
                            <Toolbar variant="dense">
                                <Box sx={{flexGrow: 1}}>
                                    <Typography
                                        variant="body1"
                                        sx={{fontWeight: "bold"}}
                                        gutterBottom>
                                        {t("config.table.title", {ns: 'patient'})}
                                    </Typography>
                                </Box>
                            </Toolbar>
                        </AppBar>

                        {isMobile ? (
                            <PatientDetailsDocumentCard
                                data={typeofDocs.map((item) => ({
                                    lable: item,
                                }))}
                                onSellected={(v: string) => {
                                    setChecked(documents.filter((item: PatientDocuments) => item.documentType === v))
                                }}
                            />
                        ) : (
                            <>
                                <FormControlLabel
                                    key={uniqueId()}
                                    control={
                                        <Checkbox
                                            checked={selectedTypes.length === 0}
                                            onChange={() => {
                                                setSelectedTypes([])
                                            }}
                                        />
                                    }
                                    label={t(`config.table.all`, {ns: 'patient'})}
                                />
                                {typeofDocs.map((type) => (
                                    <FormControlLabel
                                        key={uniqueId()}
                                        control={
                                            <Checkbox
                                                checked={type === 'all' ? selectedTypes.length === 0 : selectedTypes.some(t => type === t)}
                                                onChange={handleToggle(type)}
                                            />
                                        }
                                        label={t(`config.table.${type}`, {ns: 'patient'})}
                                    />
                                ))}
                            </>
                        )}
                        <Divider sx={{marginBottom: 2}}/>

                        {/*                        <Otable
                            headers={headCells}
                            rows={documents.filter((doc: { documentType: string; }) => {
                                if (selectedTypes.length === 0) return true;
                                else {
                                    return selectedTypes.some(st => st === doc.documentType)
                                }
                            })}
                            from={"patient-documents"}
                            t={t}
                            checkedType={checked}
                            pagination
                            hideHeaderOnMobile
                            handleEvent={(action: string, document: any) => {
                                if (action === "MORE") {
                                    showDoc(document)
                                }
                                if (action === "LISTEN") {
                                    const audio = new Audio(document.uri)
                                    audio.play().then(r => console.log('stoped', r));
                                }
                            }}
                        />*/}
                        <Box display='grid' sx={{
                            gridGap: 16,
                            gridTemplateColumns: {
                                xs: "repeat(2,minmax(0,1fr))",
                                md: "repeat(4,minmax(0,1fr))",
                                lg: "repeat(5,minmax(0,1fr))",
                            }
                        }}>
                            {documents.filter((doc: MedicalDocuments) => doc.documentType !== 'photo').map((card: any, idx: number) =>
                                <React.Fragment key={`doc-item-${idx}`}>
                                    <DocumentCard {...{t}} data={card}/>
                                </React.Fragment>
                            )}
                        </Box>
                    </CardContent>
                </PanelCardStyled>
            ) : (
                <NoDataCard t={t} ns={"patient"}
                            onHandleClick={() => {
                                console.log("onHandleClick");
                                setOpenUploadDialog(true);
                            }}
                            data={AddAppointmentCardData}/>
            )}

            <Dialog action={"document_detail"}
                    open={openDialog}
                    data={{state: document, setState: setDocument, setOpenDialog}}
                    size={"lg"}
                    direction={'ltr'}
                    sx={{p: 0}}
                    title={t("config.doc_detail_title")}
                    onClose={handleCloseDialog}
                    dialogClose={handleCloseDialog}
            />

            {isViewerOpen.length > 0 && (
                <ImageViewer
                    src={[isViewerOpen, isViewerOpen]}
                    currentIndex={0}
                    disableScroll={false}
                    backgroundStyle={{
                        backgroundColor: "rgba(6, 150, 214,0.5)"
                    }}
                    closeOnClickOutside={true}
                    onClose={() => setIsViewerOpen('')}
                />
            )}
        </>
    );
}

export default DocumentsPanel;
