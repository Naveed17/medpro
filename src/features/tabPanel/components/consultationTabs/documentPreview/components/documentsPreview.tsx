import React from "react";
import {Card, Stack, Typography} from "@mui/material";
import 'react-h5-audio-player/lib/styles.css';
import IconUrl from "@themes/urlIcon";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Slide from "@mui/material/Slide";
import {iconDocument} from "@lib/constants";
import {pxToRem} from "@themes/formatFontSize";

function DocumentsPreview({...props}) {
    const {
        allDocs,
        documents,
        showDocument,
        showDoc,
        theme,
        showPreview,
        t,
    } = props;

    return (
        <Stack spacing={1} mt={pxToRem(5)}>
            {documents && documents.map((doc: any) => (
                <Slide direction="down" mountOnEnter unmountOnExit
                       in={showDocument}
                       key={doc.uuid}>
                    <Card onClick={() => {
                        showDoc(doc)
                    }} style={{borderColor: theme.palette.success.main}}>
                        <Stack direction={"row"} alignItems={"center"} spacing={1}
                               justifyContent={"space-between"} padding={1}>
                            <Stack direction={"row"} alignItems={"center"} spacing={1}>
                                <IconUrl width={20} height={20} path={iconDocument(doc.documentType)}/>
                                <Typography
                                    style={{fontSize: "0.6875rem", cursor: "pointer"}}>{t(doc.title)}</Typography>
                            </Stack>
                            <IconUrl width={15} height={15} path={'ic-print'}/>
                        </Stack>
                    </Card>
                </Slide>
            ))}
            {documents && allDocs.map((doc: any) => (
                <Slide direction="down" mountOnEnter unmountOnExit
                       in={showDocument}
                       key={doc.index}>
                    <Card onClick={() => {
                        showPreview(doc.name)
                    }}>
                        <Stack direction={"row"} alignItems={"center"} spacing={1}
                               justifyContent={"space-between"} padding={1}>
                            <Stack direction={"row"} alignItems={"center"} spacing={1}>
                                <IconUrl width={20} height={20} path={doc.icon}/>
                                <Typography
                                    style={{
                                        fontSize: "0.6875rem",
                                        cursor: "pointer"
                                    }}>{t(`consultationIP.${doc.name}`)}</Typography>
                            </Stack>
                            <AddRoundedIcon color={"primary"}/>
                        </Stack>
                    </Card>
                </Slide>
            ))}
        </Stack>
    )
}

export default DocumentsPreview;
