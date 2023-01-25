import React, {useState} from "react";
import {Box, IconButton, Stack, Typography} from "@mui/material";
import {DocumentCard, NoDataCard} from "@features/card";
import Image from "next/image";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ReorderIcon from '@mui/icons-material/Reorder';
import AppsIcon from '@mui/icons-material/Apps';
function DocumentsTab({...props}) {

    const noCardData = {
        mainIcon: "ic-doc",
        title: "no-data.event.title",
        description: "no-data.event.description",
        buttonIcon: "ic-doc",
        buttonVariant: "warning",
    };

    const [selectedAudio, setSelectedAudio] = useState<any>(null);
    const [mode, setMode] = useState(false);

    const {
        documents,
        setIsViewerOpen,
        setInfo,
        setState,
        patient,
        mutateDoc,
        setOpenDialog,
        showDoc,
        router,
        session,
        t, trigger
    } = props;

    const removeDoc = () => {
        trigger({
            method: "DELETE",
            url: `/api/medical-entity/agendas/appointments/documents/${selectedAudio.uuid}/${router.locale}`,
            headers: {ContentType: 'multipart/form-data', Authorization: `Bearer ${session?.accessToken}`}
        }, {revalidate: true, populateCache: true}).then(() => {
            setSelectedAudio(null)
            mutateDoc()
        });
    }
    return (
        <>
            <Stack direction={"row"} mb={2} spacing={1} justifyContent={"end"}>
                <IconButton onClick={()=>{setMode(true)}}  style={{background:"white",borderRadius:10}}>
                    <ReorderIcon color={!mode ? "info":"primary"}/>
                </IconButton>
                <IconButton onClick={()=>{setMode(false)}}  style={{background:"white",borderRadius:10}}>
                    <AppsIcon color={mode ? "info":"primary"}/>
                </IconButton>
            </Stack>
            <Box display='grid' sx={{
                gridGap: 16,
                gridTemplateColumns: {
                    xs: `repeat(${mode ? 1:2},minmax(0,1fr))`,
                    md: "repeat(4,minmax(0,1fr))",
                    lg: `repeat(${mode ? 1:5},minmax(0,1fr))`,
                }
            }}>
                {
                    selectedAudio === null &&
                    documents.filter((doc: MedicalDocuments) => doc.documentType !== 'photo').map((card: any, idx: number) =>
                        <React.Fragment key={`doc-item-${idx}`}>
                            <DocumentCard data={card} mode={mode} onClick={() => {
                                card.documentType === 'audio' ? setSelectedAudio(card) : showDoc(card)
                            }} t={t}/>
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

            <Box style={{marginTop: 10}}>
                {selectedAudio && <Box>
                    <Box display='grid' sx={{
                        gridGap: 16,
                        gridTemplateColumns: {
                            xs: "repeat(2,minmax(0,1fr))",
                            md: "repeat(4,minmax(0,1fr))",
                            lg: "repeat(5,minmax(0,1fr))",
                        }
                    }}>
                        <DocumentCard data={selectedAudio} t={t}/>
                    </Box>
                    <Stack justifyContent={"flex-end"} direction={"row"} alignItems={"center"}>
                        <IconButton color={"error"} onClick={() => removeDoc()}>
                            <DeleteOutlineRoundedIcon/>
                        </IconButton>
                        <IconButton onClick={() => setSelectedAudio(null)}>
                            <CloseRoundedIcon/>
                        </IconButton>

                    </Stack>
                    <AudioPlayer
                        autoPlay
                        style={{marginTop: 10}}
                        src={selectedAudio.uri}
                        onPlay={e => console.log("onPlay")}
                    />
                </Box>}
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
                                {/*<Typography variant='subtitle2' textAlign={"center"} mt={2} whiteSpace={"nowrap"}
                                            fontSize={11}>
                                    {t(card.title)}
                                </Typography>*/}
                            </Stack>
                        </React.Fragment>
                    )
                }
                {/*<React.Fragment>
                    <Box width={190} height={190} sx={{background: '#c0c9ce45', borderRadius: 2}}>
                        <Image src={"/static/img/add-image.png"}
                               width={80}
                               height={80}
                               alt={'add album'}/>
                        <Typography variant='subtitle2' textAlign={"center"} mt={2} whiteSpace={"nowrap"}
                                    fontSize={11}>
                            {'add album'}
                        </Typography>
                    </Box>
                </React.Fragment>*/}
            </Box>
            {documents.length === 0 && (
                <NoDataCard t={t} ns={"consultation"} data={noCardData}/>
            )}
        </>
    );
}

export default DocumentsTab;
