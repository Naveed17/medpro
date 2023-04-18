import React, {useState} from "react";
import {
    List,
    ListItem,
    Box,
    Stack,
    Typography,
    Collapse,
    Skeleton,
    IconButton,
} from "@mui/material";
import IconUrl from "@themes/urlIcon";

function ModelPrescriptionList({...props}) {
    const [collapse, setCollapse] = useState<any>([]);
    const {models, t} = props;
    console.log("models", models);
    return (
        <List
            sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                overflowX: "scroll",
                height: "21rem",
            }}>
            {models?.map((item: any, index: number) => (
                <Box key={`models-${index}`}>
                    {/* <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar sx={{
                                    bgcolor: item.color,
                                    color: "white",
                                    textTransform: "uppercase"
                                }}>{item.title[0]}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                onClick={() => {
                                    selectModel(item)
                                }}
                                primary={item.title}
                                className={"resume3Lines"}
                                secondary={
                                    <React.Fragment>
                                        {item.preview}
                                    </React.Fragment>
                                }
                            />
                            <IconButton size="small"
                                        onClick={() => {
                                            setSelected({
                                                title: t('consultationIP.askRemovemodel'),
                                                subtitle: t('consultationIP.subtitleRemovemodel'),
                                                icon: "/static/icons/ic-text.svg",
                                                name1: item.title,
                                                name2: t('consultationIP.model'),
                                                request: {
                                                    method: "DELETE",
                                                    url: `/api/medical-entity/${medical_entity.uuid}/certificate-modals/${item.uuid}`,
                                                    headers: {
                                                        ContentType: 'application/x-www-form-urlencoded',
                                                        Authorization: `Bearer ${session?.accessToken}`
                                                    },
                                                }
                                            })
                                            setOpenRemove(true);
                                        }}>
                                <IconUrl path="setting/icdelete"/>
                            </IconButton>
                        </ListItem> */}
                    <ListItem
                        onClick={() => {
                            if (collapse.includes(item?.uuid)) {
                                const filtered = collapse.filter(
                                    (uuid: string) => item.uuid !== uuid
                                );
                                setCollapse(filtered);
                            } else {
                                setCollapse([...collapse, item.uuid]);
                            }
                        }}>
                        <IconUrl
                            style={{position: "absolute", left: 10}}
                            path={
                                collapse.includes(item?.uuid) ? "ic-collapse" : "ic-uncollapse"
                            }
                        />
                        <Stack direction="row" alignItems="center" spacing={0.5} ml={1}>
                            <IconUrl path="ic-doc"/>
                            <Typography>{item.title}</Typography>
                        </Stack>
                    </ListItem>
                    <Collapse
                        className="model-collapse"
                        in={collapse.includes(item?.uuid)}>
                        <List sx={{p: 0, px: 4.5}}>
                            <ListItem sx={{py: 0, px: 0.5, borderRadius: 0.5}}>
                                <IconUrl path="ic-text" height={14} width={14}/>
                                <Typography color="primary" variant="body2" ml={0.5}>
                                    {item.name}
                                </Typography>
                                <IconButton
                                    disableRipple
                                    className="btn-del"
                                    onClick={() => console.log(item.uuid)}>
                                    <IconUrl color="red" width={12} height={12} path="icdelete"/>
                                </IconButton>
                            </ListItem>
                        </List>
                    </Collapse>
                </Box>
            ))}

            {models?.length === 0 && (
                <Stack spacing={2}>
                    <List>
                        {Array.from({length: 3}).map((_, idx) =>
                            idx === 0 ? (
                                <ListItem key={idx} sx={{py: 0.5}}>
                                    <Skeleton width={300} height={8} variant="rectangular"/>
                                </ListItem>
                            ) : (
                                <ListItem key={idx} sx={{py: 0.5}}>
                                    <Skeleton width={10} height={8} variant="rectangular"/>
                                    <Skeleton
                                        sx={{ml: 1}}
                                        width={130}
                                        height={8}
                                        variant="rectangular"
                                    />
                                </ListItem>
                            )
                        )}
                    </List>
                </Stack>
            )}
        </List>
    );
}

export default ModelPrescriptionList;
