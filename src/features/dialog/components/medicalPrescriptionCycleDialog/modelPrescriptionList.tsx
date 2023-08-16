import React, {useEffect, useState} from "react";
import {
    List,
    ListItem,
    Stack,
    Skeleton, Box, Button, useTheme
} from "@mui/material";

import {
    Tree,
    getBackendOptions,
    MultiBackend,
} from "@minoru/react-dnd-treeview";
import {DndProvider} from "react-dnd";
import {CustomDragPreview, CustomNode} from "@features/treeView";
import TreeStyled from "./overrides/treeStyled";
import {useRequestMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useSWRConfig} from "swr";
import {useMedicalProfessionalSuffix} from "@lib/hooks";
import {Dialog} from "@features/dialog";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import Icon from "@themes/urlIcon";
import {useAppSelector} from "@lib/redux/hooks";
import {configSelector} from "@features/base";

function ModelPrescriptionList({...props}) {
    const {models, t, initialOpenData, switchPrescriptionModel, editPrescriptionModel} = props;
    const router = useRouter();
    const {mutate} = useSWRConfig();
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
    const theme = useTheme();

    const {direction} = useAppSelector(configSelector);

    const [treeData, setTreeData] = useState<any[]>([]);
    const [deleteModelDialog, setDeleteModelDialog] = useState<boolean>(false);
    const [dialogAction, setDialogAction] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedModel, setSelectedModel] = useState<any | null>(null);
    const {trigger: triggerPrescriptionEdit} = useRequestMutation(null, "/prescription/model/edit");
    const {trigger: triggerDeleteModel} = useRequestMutation(null, "/prescription/model/delete");

    const handleDrop = (newTree: any, {dragSourceId, dropTargetId}: any) => {
        const form = new FormData();
        form.append("parent", dropTargetId);
        triggerPrescriptionEdit({
            method: "PATCH",
            url: `${urlMedicalProfessionalSuffix}/prescriptions/modals/${dragSourceId}/parent/${router.locale}`,
            data: form
        }).then(() => mutate(`${urlMedicalProfessionalSuffix}/prescriptions/modals/parents/${router.locale}`));
        setTreeData(newTree);
    }

    const handleDeleteModel = (props: any) => {
        setSelectedModel(props.node);
        setDialogAction(props.node.parent === 0 ? "parent" : "model");
        setDeleteModelDialog(true);
    }

    const handleEditModel = (props: any) => {
        switchPrescriptionModel(props.node.data.drugs);
        editPrescriptionModel(props);
    }

    const handleDeleteAction = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLoading(true);
        triggerDeleteModel({
            method: "DELETE",
            url: `${urlMedicalProfessionalSuffix}/prescriptions/modals${selectedModel.parent === 0 ? "/parents/" : "/"}${selectedModel.id}/${router.locale}`
        }).then(() => {
            setSelectedModel(null);
            mutate(`${urlMedicalProfessionalSuffix}/prescriptions/modals/parents/${router.locale}`).then(
                () => {
                    setLoading(false);
                    setDeleteModelDialog(false);
                });
        })
    }

    useEffect(() => {
        if (models) {
            const parentModels: PrescriptionPatternModel[] = [];
            models.map((model: PrescriptionParentModel) => {
                parentModels.push(...[
                    {
                        id: model.uuid,
                        isDefault: model.isDefault,
                        parent: 0,
                        droppable: true,
                        text: model.isDefault ? "Répertoire par défaut" : model.name
                    },
                    ...model.prescriptionModels.map((prescription) => ({
                        id: prescription.uuid,
                        parent: model.uuid,
                        text: prescription.name,
                        data: {
                            drugs: prescription.prescriptionModalHasDrugs
                        }
                    }))
                ]);
            });
            parentModels.sort(model => model.isDefault ? -1 : 1);
            setTreeData(parentModels);
        }
    }, [models]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                <TreeStyled className={"app"}>
                    <Tree
                        tree={treeData}
                        rootId={0}
                        render={(node, {depth, isOpen, onToggle}) => (
                            <CustomNode
                                {...{
                                    node, depth, isOpen,
                                    onToggle,
                                    switchPrescriptionModel,
                                    handleEditModel,
                                    handleDeleteModel
                                }}
                            />
                        )}
                        sort={false}
                        enableAnimateExpand={true}
                        initialOpen={initialOpenData}
                        dragPreviewRender={(monitorProps) => (
                            <CustomDragPreview monitorProps={monitorProps}/>
                        )}
                        onDrop={handleDrop}
                        classes={{
                            root: "root",
                            draggingSource: "draggingSource",
                            dropTarget: "dropTarget"
                        }}
                    />
                </TreeStyled>
            </DndProvider>

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

            <Dialog
                color={theme.palette.error.main}
                contrastText={theme.palette.error.contrastText}
                dialogClose={() => setDeleteModelDialog(false)}
                sx={{
                    direction: direction
                }}
                action={() => {
                    return (
                        <Box sx={{minHeight: 150}}>
                            <Typography sx={{textAlign: "center"}}
                                        variant="subtitle1">{t(`dialogs.delete-${dialogAction}-dialog.sub-title`)} </Typography>
                            <Typography sx={{textAlign: "center"}}
                                        margin={2}>{t(`dialogs.delete-${dialogAction}-dialog.description`)}</Typography>
                        </Box>)
                }}
                open={deleteModelDialog}
                title={t(`dialogs.delete-${dialogAction}-dialog.title`)}
                actionDialog={
                    <>
                        <Button
                            variant="text-primary"
                            onClick={() => setDeleteModelDialog(false)}
                            startIcon={<CloseIcon/>}
                        >
                            {t(`dialogs.delete-${dialogAction}-dialog.cancel`)}
                        </Button>
                        <LoadingButton
                            {...{loading}}
                            loadingPosition="start"
                            variant="contained"
                            color={"error"}
                            onClick={handleDeleteAction}
                            startIcon={<Icon height={"18"} width={"18"} color={"white"} path="icdelete"></Icon>}
                        >
                            {t(`dialogs.delete-${dialogAction}-dialog.confirm`)}
                        </LoadingButton>
                    </>
                }
            />
        </>
    );
}

export default ModelPrescriptionList;
