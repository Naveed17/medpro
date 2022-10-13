import React, {useState} from "react";
import {useTranslation} from "next-i18next";

// material
import {
    Card,
    CardContent,
    Typography,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import {useMediaQuery} from "@mui/material";

//components
import {PatientDetailsDocumentCard, NoDataCard} from "@features/card";
import {Otable} from "@features/table";
import {uniqueId} from "lodash";
import {Dialog} from "@features/dialog";
import ImageViewer from "react-simple-image-viewer";

const typeofDocs = [
    "medical-imaging",
    "analyse", "requested-analysis",
    "prescription", "photo", "rapport", "medical-certificate", "video"];

const AddAppointmentCardData = {
    mainIcon: "ic-doc",
    title: "no-data.documents.title",
    description: "no-data.documents.description",
    buttonText: "no-data.documents.button-text",
    buttonIcon: "ic-doc",
    buttonVariant: "primary",
};

// interface
interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
    sortable: boolean;
    align: "left" | "right" | "center";
}

// table head data
const headCells: readonly HeadCell[] = [
    {
        id: "documents",
        numeric: false,
        disablePadding: true,
        label: "documents",
        align: "left",
        sortable: true,
    },
    {
        id: "createdAt",
        numeric: false,
        disablePadding: true,
        label: "created-at",
        align: "left",
        sortable: true,
    },
    {
        id: "createdBy",
        numeric: false,
        disablePadding: true,
        label: "created-by",
        align: "left",
        sortable: true,
    },
    {
        id: "action",
        numeric: false,
        disablePadding: true,
        label: "action",
        align: "right",
        sortable: false,
    },
];

function DocumentsPanel({...props}) {
    const {documents, patient} = props;
    // filter checked array
    const [checked, setChecked] = React.useState<PatientDocuments[]>(documents);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [document, setDocument] = useState<any>();
    const [isViewerOpen, setIsViewerOpen] = useState<string>('');

    // handle change for checkboxes
    const handleToggle =
        (value: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.checked) {
                const filtered = documents.filter((item: PatientDocuments) => item.documentType === value);
                if (documents.length === checked.length) {
                    setChecked([...filtered]);
                } else {
                    setChecked([...checked, ...filtered]);
                }
            } else {
                const filtered = checked.filter((item) => item.documentType !== value);
                setChecked([...filtered]);
            }
        };

    //  handleclick all
    const handleCheckAll = () => {
        if (documents.length === checked.length) {
            setChecked([]);
        } else {
            setChecked([...documents]);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    // query media for mobile
    const isMobile = useMediaQuery("(max-width:600px)");

    // translation
    const {t, ready} = useTranslation("patient", {
        keyPrefix: "config",
    });

    if (!ready) return <>loading translations...</>;

    return (
        <>
            {documents.length > 0 ? (
                <Card
                    className={"container"}
                    sx={{
                        tbody: {
                            mt: 1,
                        },
                        "& .MuiCardContent-root": {
                            background: "white"
                        }
                    }}
                >
                    <CardContent>
                        <Typography gutterBottom>{t("table.title")}</Typography>
                        {isMobile ? (
                            <PatientDetailsDocumentCard
                                data={["all", ...typeofDocs].map((item) => ({
                                    lable: item,
                                }))}
                                onSellected={(v: string) => {
                                    setChecked(
                                        v === "all" ? documents : documents.filter((item: PatientDocuments) => item.documentType === v)
                                    )
                                }}
                            />
                        ) : (
                            <>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={checked.length === documents.length}
                                            onChange={handleCheckAll}
                                        />
                                    }
                                    label={t("table.all")}
                                />
                                {typeofDocs.map((type) => (
                                    <FormControlLabel
                                        key={uniqueId()}
                                        control={
                                            <Checkbox
                                                checked={
                                                    checked.length === documents.length
                                                        ? false
                                                        : checked.some((item) => item.documentType === type)
                                                }
                                                onChange={handleToggle(type)}
                                            />
                                        }
                                        label={t(`table.${type}`)}
                                    />
                                ))}
                            </>
                        )}

                        <Otable
                            headers={headCells}
                            rows={documents}
                            from={"patient-documents"}
                            t={t}
                            checkedType={checked}
                            pagination
                            hideHeaderOnMobile
                            handleEvent={(action: string, document: any) => {
                                if (action === "MORE") {
                                    if (document.documentType === 'photo') {
                                        setIsViewerOpen(document.uri)
                                    } else if (document.documentType === 'medical-certificate') {
                                        setDocument({
                                            content: document.certificate[0].content,
                                            doctor: document.name,
                                            patient: document.patient,
                                            days: document.days,
                                            name: 'certif',
                                            type: 'write_certif'
                                        })
                                        setOpenDialog(true);
                                    } else {
                                        let info = null;
                                        switch (document.documentType) {
                                            case "prescription":
                                                info = document.prescription[0].prescription_has_drugs;
                                                break;
                                            case "requested-analysis":
                                                info = document.requested_Analyses[0].analyses;
                                                break;
                                        }
                                        setDocument({
                                            uuid: document.uuid,
                                            uri: document.uri,
                                            name: document.title,
                                            type: document.documentType,
                                            info,
                                            patient: patient.firstName + ' ' + patient.lastName,
                                            mutate: document
                                        });
                                        console.log(document);
                                        setOpenDialog(true);
                                    }
                                }
                            }}
                        />
                    </CardContent>
                </Card>
            ) : (
                <NoDataCard t={t} ns={"patient"} data={AddAppointmentCardData}/>
            )}

            <Dialog action={"document_detail"}
                    open={openDialog}
                    data={{state: document, setState: setDocument, setOpenDialog}}
                    size={"lg"}
                    direction={'ltr'}
                    sx={{p: 0}}
                    title={t("doc_detail_title")}
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
