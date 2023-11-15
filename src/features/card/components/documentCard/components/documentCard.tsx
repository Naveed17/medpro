import {CardContent, Stack, Tooltip} from '@mui/material'
import IconUrl from '@themes/urlIcon';
import React from 'react'
import DocumentCardStyled from './overrides/documentCardStyle';
import {DocumentContent} from "@features/card";
import {iconDocument} from "@lib/constants";

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
                                <IconUrl width={title ? "20" : "50"} height={title ? "20" : "50"} path={iconDocument(data.documentType)}/>
                                {title && <DocumentContent {...{data, date, t, resize}}/>}
                            </Stack>
                        </CardContent>
                    </Tooltip>
                </DocumentCardStyled> : <DocumentCardStyled className={"document-card"}>
                    <Tooltip title={"Note : " + data.description ? data.description : "--"}>
                        <CardContent style={{padding: 0}} onClick={onClick}>
                            <Stack alignItems="center">
                                <IconUrl width={70} height={164} path={iconDocument(data.documentType)}/>
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
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={!data.uri.thumbnails.hasOwnProperty('thumbnail_128') ? data.uri.url : data.uri.thumbnails['thumbnail_128']}
                                    style={{width: "100%", height: 164, objectFit: "scale-down"}}
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
