import React, {useState} from "react";
import {Box, IconButton, Stack, Tooltip, Typography} from "@mui/material";
import {DocumentCard, NoDataCard} from "@features/card";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import fileDownload from 'js-file-download';
import axios from "axios";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import {useRequestQueryMutation} from "@lib/axios";

function DocumentsTab({...props}) {
    const {
        documents,
        mutateDoc,
        showDoc,
        mutateSheetData,
        setSelectedAudio,
        router,
        t
    } = props;

    const noCardData = {
        mainIcon: "ic-doc",
        title: "no-data.event.title",
        description: "no-data.event.description",
        buttonIcon: "ic-doc",
        buttonVariant: "warning",
    };

    /*
        const {trigger: triggerDocumentDelete} = useRequestQueryMutation("/document/delete");

        const removeDoc = () => {
            triggerDocumentDelete({
                method: "DELETE",
                url: `/api/medical-entity/agendas/appointments/documents/${selectedAudio.uuid}/${router.locale}`
            }, {
                onSuccess: () => mutateDoc().then(() => {
                    setSelectedAudio(null)
                    mutateSheetData();
                })
            });
        }
    */


    return (
        <Stack spacing={1} padding={2}>
            {documents.filter((doc: MedicalDocuments) => doc.documentType === 'photo').length > 0 &&
                <Stack>
                    <Typography variant='subtitle2' fontWeight={700} mt={3} mb={1} fontSize={16}>
                        {t('gallery')}
                    </Typography>

                    <Box style={{overflowX: "auto", marginBottom: 10}}>
                        <Stack direction={"row"} spacing={1} m={1} alignItems={"center"}>
                            {
                                documents.filter((doc: MedicalDocuments) => doc.documentType === 'photo').map((card: any, idx: number) =>
                                    <React.Fragment key={`doc-item-${idx}`}>
                                        <DocumentCard onClick={() => {
                                            showDoc(card)
                                        }} {...{t, data: card, date: false, time: true, title: true, resize: true}}/>
                                    </React.Fragment>
                                )
                            }
                        </Stack>
                    </Box>
                </Stack>
            }

            {documents.filter((doc: MedicalDocuments) => doc.documentType !== 'photo').length > 0 &&
                <Typography variant='subtitle2' fontWeight={700} fontSize={16}>
                    {t('docs')}
                </Typography>}

            <Box display='grid' sx={{
                gridGap: 16,
                gridTemplateColumns: {
                    xs: `repeat(2,minmax(0,1fr))`,
                    md: "repeat(3,minmax(0,1fr))",
                    lg: `repeat(5,minmax(0,1fr))`,
                }
            }}>
                {documents.filter((doc: MedicalDocuments) => doc.documentType !== 'photo').map((card: any, idx: number) =>
                    <React.Fragment key={`doc-item-${idx}`}>
                        <DocumentCard onClick={() => {
                            card.documentType === 'audio' ? setSelectedAudio(card) : showDoc(card)
                        }} {...{t, data: card, date: false, time: true, title: true, resize: true}}/>
                    </React.Fragment>
                )}
            </Box>

            {documents.length === 0 && (
                <Box className={"container"}>
                    <NoDataCard t={t} ns={"consultation"} data={noCardData}/>
                </Box>
            )}
        </Stack>
    );
}

export default DocumentsTab;
