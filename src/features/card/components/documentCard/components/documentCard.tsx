import {Card, CardContent, Stack, Tooltip} from '@mui/material';
import IconUrl from '@themes/urlIcon';
import DocumentCardStyled from './overrides/documentCardStyle';
import {DocumentContent} from "@features/card";
import {iconDocument} from "@lib/constants";
import React from "react";

function DocumentCard({...props}) {
    const {data, onClick, t, date, title, resize, width = null, handleMoreAction = null} = props;

    return (
        <>
            {data.uri.thumbnails.length === 0 ?
                !resize ? <DocumentCardStyled className={"document-card"}>
                        <Tooltip title={data.description ? `Note : ${data.description}` : data.title}>
                            <CardContent style={{padding: "2px 15px 10px"}} onClick={onClick}>
                                <Stack spacing={2}
                                       direction={"row"}
                                       className="document-detail"
                                       alignItems="center">
                                    <IconUrl width={title ? "20" : "50"} height={title ? "20" : "50"}
                                             path={iconDocument(data.documentType)}/>
                                    {title && <DocumentContent {...{data, date, t, resize, width, handleMoreAction}}/>}
                                </Stack>
                            </CardContent>
                        </Tooltip>
                    </DocumentCardStyled>
                    :
                    <Card
                        sx={{
                            paddingLeft: "0.6rem",
                            height: 80,
                            "& .MuiCardContent-root": {
                                padding: 0
                            }
                        }}>
                        <CardContent>
                            <Tooltip title={data.description ? `Note : ${data.description}` : t(data.title)}>
                                <Stack onClick={onClick} alignItems="center" direction={"row"}>
                                    <IconUrl width={40} height={80} path={iconDocument(data.documentType)}/>
                                    <DocumentContent {...{data, date, t, resize, width, handleMoreAction}}/>
                                </Stack>
                            </Tooltip>
                        </CardContent>
                    </Card>
                :
                !resize ? <DocumentCardStyled className={"document-card"}>
                        <Tooltip title={data.description ? `Note : ${data.description}` : data.title}>
                            <CardContent style={{padding: "2px 15px 10px"}} onClick={onClick}>
                                <Stack spacing={2}
                                       direction={"row"}
                                       className="document-detail"
                                       alignItems="center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={data.uri.thumbnails.length === 0 ? data.uri.url : data.uri.thumbnails['thumbnail_128']}
                                        style={{borderRadius: 5, width: title ? 20 : 50, height: title ? 20 : 50}}
                                        onError={({currentTarget}) => {
                                            currentTarget.onerror = null; // prevents looping
                                            currentTarget.src = "/static/icons/ic-quote.svg";
                                        }}
                                        alt={'photo history'}/>
                                    {title && <DocumentContent {...{data, date, t, resize, width, handleMoreAction}} />}
                                </Stack>
                            </CardContent>
                        </Tooltip>
                    </DocumentCardStyled>
                    :
                    <DocumentCardStyled className={"document-card"} style={{display: "flex", alignItems: "center"}}>
                        <Tooltip title={data.description ? `Note : ${data.description}` : data.title}>
                            <CardContent style={{padding: 0}} onClick={onClick}>
                                <Stack direction={"row"} alignItems="center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={!data.uri.thumbnails.hasOwnProperty('thumbnail_128') ? data.uri.url : data.uri.thumbnails['thumbnail_128']}
                                        style={{
                                            width: 50,
                                            height: 50,
                                            objectFit: "scale-down",
                                            borderRadius: 5,
                                            marginLeft: 5
                                        }}
                                        onError={({currentTarget}) => {
                                            currentTarget.onerror = null; // prevents looping
                                            currentTarget.src = "/static/icons/ic-quote.svg";
                                        }}
                                        alt={'photo history'}/>
                                    <DocumentContent {...{data, date, t, resize, width, handleMoreAction}} />
                                </Stack>
                            </CardContent>
                        </Tooltip>
                    </DocumentCardStyled>
            }
        </>
    )
}

export default DocumentCard
