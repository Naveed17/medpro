import React from "react";
import {Card, Stack, Typography} from "@mui/material";
import 'react-h5-audio-player/lib/styles.css';
import IconUrl from "@themes/urlIcon";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

function DocumentsPreview({...props}) {
    const {
        docs,
        theme,
        t,
    } = props;

    return (
        <Stack spacing={1}>
            {docs.map((doc:any) => (
                    <Card key={doc.index} style={{borderColor: doc.checked ?theme.palette.success.main:""}}>
                        <Stack direction={"row"} alignItems={"center"}
                               justifyContent={"space-between"} padding={1}>
                            <Stack direction={"row"} alignItems={"center"} spacing={1}>
                                <IconUrl width={20} height={20} path={doc.icon}/>
                                <Typography
                                    style={{fontSize: "0.6875rem"}}>{t(doc.name)}</Typography>
                            </Stack>
                            {doc.checked && <IconUrl width={20} height={20} path={'ic-print'}/>}
                            {!doc.checked && <AddRoundedIcon color={"primary"}/>}
                        </Stack>
                    </Card>
            ))}
        </Stack>
    )
}

export default DocumentsPreview;
