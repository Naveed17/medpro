import React from "react";
import {Box, Stack, Typography} from "@mui/material";
import {DocumentCard, NoDataCard} from "@features/card";
import Image from "next/image";

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
        showDoc,
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
                    documents.filter((doc: MedicalDocuments) => doc.documentType !== 'photo').map((card: any, idx: number) =>
                        <React.Fragment key={`doc-item-${idx}`}>
                            <DocumentCard data={card} onClick={() => {showDoc(card)}} t={t}/>
                        </React.Fragment>
                    )
                }

                {/*{documents.length > 0 && <DocumentCardStyled>
                    <CardContent>
                        <Stack justifyContent={"center"} alignItems="center" className="document-detail">
                            <AddIcon color={"primary"} style={{marginTop: 10}}/>
                        </Stack>
                    </CardContent>
                </DocumentCardStyled>}
*/}

            </Box>

            {documents.filter((doc: MedicalDocuments) => doc.documentType === 'photo').length > 0 &&
                <Typography variant='subtitle2' fontWeight={700} mt={3} mb={3} fontSize={16}>
                    {t('gallery')}
                </Typography>}

            <Box display='grid' sx={{
                gridGap: 16,
                gridTemplateColumns: {
                    xs: "repeat(2,minmax(0,1fr))",
                    md: "repeat(4,minmax(0,1fr))",
                    lg: "repeat(5,minmax(0,1fr))",
                }
            }}>
                {
                    documents.filter((doc: MedicalDocuments) => doc.documentType === 'photo').map((card: any, idx: number) =>
                        <React.Fragment key={`doc-item-${idx}`}>
                            <Stack onClick={() => {
                                showDoc(card)
                            }}
                                   justifyContent={"center"}
                                   alignItems="center"
                                   className="document-detail">
                                <Image src={card.uri}
                                       width={250}
                                       height={250}
                                       style={{borderRadius: 10}}
                                       alt={card.title}/>
                                <Typography variant='subtitle2' textAlign={"center"} mt={2} whiteSpace={"nowrap"}
                                            fontSize={11}>
                                    {t(card.title)}
                                </Typography>
                            </Stack>
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
