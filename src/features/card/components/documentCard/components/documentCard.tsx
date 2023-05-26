import {CardContent, Stack, Tooltip, Typography} from '@mui/material'
import IconUrl from '@themes/urlIcon';
import React from 'react'
import DocumentCardStyled from './overrides/documentCardStyle';
import moment from "moment/moment";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventRoundedIcon from '@mui/icons-material/EventRounded';

function DocumentCard({...props}) {
    const {data, onClick, t, date, title, resize} = props;

    return (
        <>
            {data.uri.thumbnails.length === 0 ?
                !resize ? <DocumentCardStyled className={"document-card"}>
                    <Tooltip title={"Note : " + data.description ? data.description : "--"}>
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
                    </Tooltip>
                </DocumentCardStyled> : <DocumentCardStyled className={"document-card"}>
                    <Tooltip title={"Note : " + data.description ? data.description : "--"}>
                        <CardContent style={{padding: 0}} onClick={onClick}>
                            <Stack alignItems="center">
                                <IconUrl width={70} height={164} path={
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
                                <Stack alignItems={"center"} m={1}>
                                    <Typography className={"sub-title"} variant='subtitle2'
                                                whiteSpace={"nowrap"}
                                                style={{cursor: "pointer"}}
                                                textAlign={"center"}
                                                fontSize={13}>
                                        {t(data.title)}
                                    </Typography>
                                    <Stack direction={"row"} justifyItems={"center"} margin={0} spacing={1}>
                                        {date && <>
                                            <EventRoundedIcon style={{fontSize: 15, color: "grey"}}/>
                                            <Typography whiteSpace={"nowrap"} fontSize={12}
                                                        style={{color: "grey", cursor: "pointer"}}>
                                                {moment(data.createdAt, 'DD-MM-YYYY HH:mm').add(1, "hour").format('DD-MM-YYYY')}
                                            </Typography>
                                        </>}

                                        <AccessTimeIcon style={{fontSize: 15, color: "grey"}}/>
                                        <Typography whiteSpace={"nowrap"} fontSize={12}
                                                    style={{marginTop: 0, color: "grey", cursor: "pointer"}}>
                                            {moment(data.createdAt, 'DD-MM-YYYY HH:mm').add(1, "hour").format('HH:mm')}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Tooltip>
                </DocumentCardStyled>
                :
                !resize ? <DocumentCardStyled className={"document-card"}>
                    <Tooltip title={"Note : " + data.description ? data.description : "--"}>
                        <CardContent style={{padding: "2px 15px 10px"}} onClick={onClick}>
                            <Stack spacing={2}
                                   direction={"row"}
                                   className="document-detail"
                                   alignItems="center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={data.uri.thumbnails.length === 0 ? data.uri.url: data.uri.thumbnails['thumbnail_128']}
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
                    </Tooltip>
                </DocumentCardStyled> : <DocumentCardStyled className={"document-card"}>
                    <Tooltip title={"Note : " + data.description ? data.description : "--"}>
                        <CardContent style={{padding: 0}} onClick={onClick}>
                            <Stack alignItems="center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={data.uri.thumbnails.length === 0 ? data.uri.url:data.uri.thumbnails['thumbnail_128']}
                                     style={{width: "100%", height: 164}}
                                     alt={'photo history'}/>

                                <Stack alignItems={"center"} m={1}>
                                    <Typography className={"sub-title"} variant='subtitle2'
                                                whiteSpace={"nowrap"}
                                                style={{cursor: "pointer"}}
                                                textAlign={"center"}
                                                fontSize={13}>
                                        {t(data.title)}
                                    </Typography>
                                    <Stack direction={"row"} justifyItems={"center"} margin={0} spacing={1}>
                                        {date && <>
                                            <EventRoundedIcon style={{fontSize: 15, color: "grey"}}/>
                                            <Typography whiteSpace={"nowrap"} fontSize={12}
                                                        style={{color: "grey", cursor: "pointer"}}>
                                                {moment(data.createdAt, 'DD-MM-YYYY HH:mm').add(1, "hour").format('DD-MM-YYYY')}
                                            </Typography>
                                        </>}

                                        <AccessTimeIcon style={{fontSize: 15, color: "grey"}}/>
                                        <Typography whiteSpace={"nowrap"} fontSize={12}
                                                    style={{marginTop: 0, color: "grey", cursor: "pointer"}}>
                                            {moment(data.createdAt, 'DD-MM-YYYY HH:mm').add(1, "hour").format('HH:mm')}
                                        </Typography>
                                    </Stack>
                                </Stack>

                                {/* <Stack direction={"column"}>
                                <Typography className={"sub-title"} variant='subtitle2'
                                            whiteSpace={"nowrap"}
                                            style={{cursor: "pointer"}}
                                            fontSize={13}>
                                    {t(data.title)}
                                </Typography>
                                <Stack direction={"row"} width={"100%"} margin={0} spacing={1}>
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
                            </Stack>*/}
                            </Stack>
                        </CardContent>
                    </Tooltip>
                </DocumentCardStyled>
            }
        </>
    )
}

export default DocumentCard
