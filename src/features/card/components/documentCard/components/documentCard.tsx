import {CardContent, Stack, Typography} from '@mui/material'
import IconUrl from '@themes/urlIcon';
import React from 'react'
import DocumentCardStyled from './overrides/documentCardStyle';
import moment from "moment/moment";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import {HtmlTooltip} from "@features/tooltip";
function DocumentCard({...props}) {
    const {data, onClick, t, date, title} = props;

    return (
        <>
            {data.documentType !== "photo" &&
                <DocumentCardStyled className={"document-card"}>
                    <HtmlTooltip
                        title={
                            <React.Fragment>
                                <Typography color="gray" style={{cursor: 'pointer'}} onClick={() => {

                                }} fontSize={12}>Note : {data.description ? data.description : "--"}</Typography>
                            </React.Fragment>
                        }
                    >
                        <CardContent style={{padding: "2px 15px 10px"}} onClick={onClick}>
                            <Stack spacing={2}
                                   direction={"row"}
                                   className="document-detail"
                                   alignItems="center">
                                <IconUrl width={title ? "20" : "50"} height={title ? "20" : "50"} path={
                                    data.documentType === "prescription" && "ic-traitement" ||
                                    data.documentType == "requested-analysis" && "ic-analyse" ||
                                    data.documentType == "analyse" && "ic-analyse" ||
                                    data.documentType == "medical-imaging" && "ic-soura" ||
                                    data.documentType == "requested-medical-imaging" && "ic-soura" ||
                                    data.documentType === "photo" && "ic-img" ||
                                    data.documentType === "audio" && "ic-son" ||
                                    data.documentType === "Rapport" && "ic-text" ||
                                    data.documentType === "medical-certificate" && "ic-text" ||
                                    data.documentType === "video" && "ic-video-outline" ||
                                    data.documentType !== "prescription" && "ic-pdf" || ""
                                }/>
                                {title && <Stack direction={"column"}>
                                    <Typography className={"sub-title"} variant='subtitle2'
                                                whiteSpace={"nowrap"}
                                                style={{cursor: "pointer"}}
                                                fontSize={13}>
                                        {t(data.title)}
                                    </Typography>
                                    <Stack direction={"row"} spacing={1}>

                                        {date && <>
                                            <EventRoundedIcon style={{fontSize: 15, color: "grey"}}/>
                                            <Typography whiteSpace={"nowrap"} fontSize={12}
                                                        style={{marginTop: 0, color: "grey", cursor: "pointer"}}>
                                                {moment(data.createdAt, 'DD-MM-YYYY HH:mm').add(1, "hour").format('DD-MM-YYYY')}
                                            </Typography>
                                        </>}

                                        <AccessTimeIcon style={{fontSize: 15, color: "grey"}}/>
                                        <Typography whiteSpace={"nowrap"} fontSize={12}
                                                    style={{marginTop: 0, color: "grey", cursor: "pointer"}}>
                                            {moment(data.createdAt, 'DD-MM-YYYY HH:mm').add(1, "hour").format('HH:mm')}
                                        </Typography>
                                    </Stack>
                                </Stack>}
                            </Stack>
                        </CardContent>
                    </HtmlTooltip>
                </DocumentCardStyled>
            }
            {data.documentType === "photo" &&
                /*<Card onClick={onClick} style={{border: 0, boxShadow: "none"}}>
                    {/!* eslint-disable-next-line @next/next/no-img-element *!/}
                    <img src={data.uri}
                         style={{borderRadius: 5, width: '100%', height: '100%'}}
                         alt={'photo history'}/>
                </Card>*/
                <DocumentCardStyled className={"document-card"}>
                    <CardContent style={{padding: "2px 15px 10px"}} onClick={onClick}>
                        <Stack spacing={2}
                               direction={"row"}
                               className="document-detail"
                               alignItems="center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={data.uri.thumbnails['thumbnail_32']}
                                 style={{borderRadius: 5, width: title ? 20 : 50, height: title ? 20 : 50}}
                                 alt={'photo history'}/>
                            {title && <Stack direction={"column"}>
                                <Typography className={"sub-title"} variant='subtitle2'
                                            whiteSpace={"nowrap"}
                                            style={{cursor: "pointer"}}
                                            fontSize={13}>
                                    {t(data.title)}
                                </Typography>
                                <Stack direction={"row"} spacing={1}>

                                    {date && <>
                                        <EventRoundedIcon style={{fontSize: 15, color: "grey"}}/>
                                        <Typography whiteSpace={"nowrap"} fontSize={12}
                                                    style={{marginTop: 0, color: "grey", cursor: "pointer"}}>
                                            {moment(data.createdAt, 'DD-MM-YYYY HH:mm').add(1, "hour").format('DD-MM-YYYY')}
                                        </Typography>
                                    </>}

                                    <AccessTimeIcon style={{fontSize: 15, color: "grey"}}/>
                                    <Typography whiteSpace={"nowrap"} fontSize={12}
                                                style={{marginTop: 0, color: "grey", cursor: "pointer"}}>
                                        {moment(data.createdAt, 'DD-MM-YYYY HH:mm').add(1, "hour").format('HH:mm')}
                                    </Typography>
                                </Stack>
                            </Stack>}
                        </Stack>
                    </CardContent>
                </DocumentCardStyled>
            }
        </>
    )
}

export default DocumentCard
