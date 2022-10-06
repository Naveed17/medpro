import React from "react";
import {Box} from "@mui/material";
import {DocumentCard, NoDataCard} from "@features/card";

function DocumentsTab({...props}) {

    const noCardData = {
        mainIcon: "ic-doc",
        title: "no-data.event.title",
        description: "no-data.event.description",
        buttonIcon: "ic-doc",
        buttonVariant: "warning",
    };
    const {
        documents,
        setIsViewerOpen,
        setInfo,
        setState,
        patient,
        mutateDoc,
        setOpenDialog,
        t
    } = props
    return (
        <>
            <Box display='grid' sx={{
                gridGap: 16,
                gridTemplateColumns: {
                    xs: "repeat(2,minmax(0,1fr))",
                    md: "repeat(4,minmax(0,1fr))",
                    lg: "repeat(5,minmax(0,1fr))",
                }
            }}>
                {
                    documents.map((card: any, idx: number) =>
                        <React.Fragment key={`doc-item-${idx}`}>
                            <DocumentCard data={card} onClick={() => {
                                console.log(card)

                                if (card.documentType === 'photo') {
                                    setIsViewerOpen(card.uri)
                                } else {
                                    setInfo('document_detail')
                                    let info = card
                                    switch (card.documentType) {
                                        case "prescription":
                                            info = card.prescription[0].prescription_has_drugs;
                                            break;
                                        case "requested-analysis":
                                            info = card.requested_Analyses[0].analyses;
                                            break;
                                        /*case "certif":
                                            setState({
                                                content: state.content,
                                                doctor: state.name,
                                                patient: state.patient,
                                                days: state.days,
                                                name: 'certif',
                                                type: 'write_certif'
                                            })*/
                                    }
                                    setState({
                                        uuid: card.uuid,
                                        uri: card.uri,
                                        name: card.title,
                                        type: card.documentType,
                                        info: info,
                                        patient: patient.firstName + ' ' + patient.lastName,
                                        mutate: mutateDoc
                                    })
                                    setOpenDialog(true);
                                }
                            }} t={t}/>
                        </React.Fragment>
                    )
                }


            </Box>
            {documents.length === 0 && (
                <NoDataCard t={t} ns={"consultation"} data={noCardData}/>
            )}
        </>
    );
}

export default DocumentsTab;
