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
    const [collapse, setCollapse] = useState<any>([1]);
    const [groupPrescriptionModel, setGroupPrescriptionModel] = useState<any[]>([
        {uuid: 1, name: "Répertoire par défaut"}
    ]);
    const {models, t, switchPrescriptionModel} = props;

    return (
        <List
            sx={{
                width: "100%",
                maxWidth: 360,
                bgcolor: "background.paper",
                overflowX: "scroll",
                height: "21rem",
            }}>
            {groupPrescriptionModel?.map((group: any, index: number) => (
                <Box key={`model-${index}`}>
                    <ListItem
                        sx={{cursor: "pointer"}}
                        onClick={() => {
                            if (collapse.includes(group?.uuid)) {
                                const filtered = collapse.filter(
                                    (uuid: string) => group.uuid !== uuid
                                );
                                setCollapse(filtered);
                            } else {
                                setCollapse([...collapse, group.uuid]);
                            }
                        }}>
                        <IconUrl
                            style={{position: "absolute", left: 10}}
                            path={
                                collapse.includes(group?.uuid) ? "ic-collapse" : "ic-uncollapse"
                            }
                        />
                        <Stack direction="row" alignItems="center" spacing={0.5} ml={1}>
                            <IconUrl path="ic-doc"/>
                            <Typography>{group.name}</Typography>
                        </Stack>
                    </ListItem>
                    <Collapse
                        className="model-collapse"
                        in={collapse.includes(group?.uuid)}>
                        <List sx={{p: 0, px: 4.5}}>
                            {models?.map((model: any, index: number) =>
                                (<ListItem key={index}
                                           onClick={event =>{
                                               event.stopPropagation();
                                               switchPrescriptionModel(model.prescription_modal_has_drugs)
                                           }}
                                           sx={{py: 0, px: 0.5, borderRadius: 0.5, cursor: "pointer"}}>
                                    <IconUrl path="ic-text" height={14} width={14}/>
                                    <Typography color="primary" variant="body2" ml={0.5}>
                                        {model.name}
                                    </Typography>
                                    <IconButton
                                        disableRipple
                                        className="btn-del"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            console.log(model.uuid)
                                        }}>
                                        <IconUrl color="red" width={12} height={12} path="icdelete"/>
                                    </IconButton>
                                </ListItem>))}
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
