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

    const [selectedAudio, setSelectedAudio] = useState<any>(null);

    const {trigger: triggerDocumentDelete} = useRequestQueryMutation("/document/delete");

    const removeDoc = () => {
        triggerDocumentDelete({
            method: "DELETE",
            url: `/api/medical-entity/agendas/appointments/documents/${selectedAudio.uuid}/${router.locale}`
        }, {
            onSuccess: () => mutateDoc().then(() => setSelectedAudio(null))
        });
    }


    return (
        <>
            {documents.filter((doc: MedicalDocuments) => doc.documentType === 'photo').length > 0 &&
                <Typography variant='subtitle2' fontWeight={700} mt={3} mb={1} fontSize={16}>
                    {t('gallery')}
                </Typography>}

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

            {documents.filter((doc: MedicalDocuments) => doc.documentType !== 'photo').length > 0 &&
                <Typography variant='subtitle2' fontWeight={700} mb={3} fontSize={16}>
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
                {
                    selectedAudio === null &&
                    documents.filter((doc: MedicalDocuments) => doc.documentType !== 'photo').map((card: any, idx: number) =>
                        <React.Fragment key={`doc-item-${idx}`}>
                            <DocumentCard onClick={() => {
                                card.documentType === 'audio' ? setSelectedAudio(card) : showDoc(card)
                            }} {...{t, data: card, date: false, time: true, title: true, resize: true}}/>
                        </React.Fragment>
                    )
                }
            </Box>

            <Box style={{marginTop: 10}}>
                {selectedAudio && <Box>
                    <Box display='grid' sx={{
                        gridGap: 16,
                        gridTemplateColumns: {
                            xs: "repeat(2,minmax(0,1fr))",
                            md: "repeat(5,minmax(0,1fr))",
                            lg: "repeat(6,minmax(0,1fr))",
                        }
                    }}>
                        <DocumentCard {...{
                            t,
                            data: selectedAudio,
                            date: false,
                            time: true,
                            title: true,
                            resize: true
                        }}/>
                    </Box>
                    <Stack justifyContent={"flex-end"} direction={"row"} alignItems={"center"}>
                        <Tooltip title={t('consultationIP.download')}>
                            <IconButton onClick={() => {
                                axios.get(selectedAudio.uri, {
                                    responseType: 'blob',
                                })
                                    .then((res) => {
                                        fileDownload(res.data, "medlink.mp3");
                                    })
                            }}>
                                <CloudDownloadIcon color={"primary"}/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t('consultationIP.delete')}>
                            <IconButton color={"error"} onClick={() => removeDoc()}>
                                <DeleteOutlineRoundedIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t('consultationIP.close')}>
                            <IconButton onClick={() => setSelectedAudio(null)}>
                                <CloseRoundedIcon/>
                            </IconButton>
                        </Tooltip>

                    </Stack>
                    <AudioPlayer
                        autoPlay
                        style={{marginTop: 10}}
                        src={selectedAudio.uri.url}
                        onPlay={() => console.log("onPlay")}
                    />
                </Box>}
            </Box>
            {documents.length === 0 && (
                <NoDataCard t={t} ns={"consultation"} data={noCardData}/>
            )}
        </>
    );
}

export default DocumentsTab;
