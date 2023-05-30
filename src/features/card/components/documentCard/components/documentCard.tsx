import {CardContent, Stack, Tooltip} from '@mui/material'
import IconUrl from '@themes/urlIcon';
import React from 'react'
import DocumentCardStyled from './overrides/documentCardStyle';
import {ImageHandler} from "@features/image";
import {DocumentContent} from "@features/card";

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
                                {title && <DocumentContent {...{data, date, t, resize}}/>}
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
                                <DocumentContent {...{data, date, t, resize}} />
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
                                <img
                                    src={data.uri.thumbnails.length === 0 ? data.uri.url : data.uri.thumbnails['thumbnail_128']}
                                    style={{borderRadius: 5, width: title ? 20 : 50, height: title ? 20 : 50}}
                                    alt={'photo history'}/>
                                {title && <DocumentContent {...{data, date, t, resize}} />}
                            </Stack>
                        </CardContent>
                    </Tooltip>
                </DocumentCardStyled> : <DocumentCardStyled className={"document-card"}>
                    <Tooltip title={"Note : " + data.description ? data.description : "--"}>
                        <CardContent style={{padding: 0}} onClick={onClick}>
                            <Stack alignItems="center">
                                <ImageHandler
                                    src={data.uri.thumbnails.length === 0 ? data.uri.url : data.uri.thumbnails['thumbnail_128']}
                                    width={"100%"}
                                    height={164}
                                    alt={'photo history'}/>
                                <DocumentContent {...{data, date, t, resize}} />
                            </Stack>
                        </CardContent>
                    </Tooltip>
                </DocumentCardStyled>
            }
        </>
    )
}

export default DocumentCard
