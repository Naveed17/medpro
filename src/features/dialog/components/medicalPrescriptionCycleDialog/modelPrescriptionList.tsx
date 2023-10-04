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
import {useRequestQueryMutation} from "@lib/axios";
import {useRouter} from "next/router";
import {useInvalidateQueries, useMedicalProfessionalSuffix} from "@lib/hooks";
import {Dialog, prescriptionSelector, setParentModel} from "@features/dialog";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingButton} from "@mui/lab";
import Icon from "@themes/urlIcon";
import {useAppDispatch, useAppSelector} from "@lib/redux/hooks";
import {configSelector} from "@features/base";
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';

function ModelPrescriptionList({...props}) {
    const {models, t, initialOpenData, switchModel, editPrescriptionModel, setOpenAddParentDialog} = props;
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
    const theme = useTheme();
    const {trigger: invalidateQueries} = useInvalidateQueries();

    const {direction} = useAppSelector(configSelector);
    const {parent: modelParent} = useAppSelector(prescriptionSelector);

    const [treeData, setTreeData] = useState<any[]>([]);
    const [deleteModelDialog, setDeleteModelDialog] = useState<boolean>(false);
    const [dialogAction, setDialogAction] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedModel, setSelectedModel] = useState<any | null>(null);
    const [openPrescriptionModelDialog, setPrescriptionModelOpenDialog] = useState(false);

    const {trigger: triggerPrescriptionEdit} = useRequestQueryMutation("/prescription/model/edit");
    const {trigger: triggerDeleteModel} = useRequestQueryMutation("/prescription/model/delete");

    const handleMoveModelRequest = (ModelSourceId: string, parentTargetId: string, loading?: boolean) => {
        const form = new FormData();
        form.append("parent", parentTargetId);
        triggerPrescriptionEdit({
            method: "PATCH",
            url: `${urlMedicalProfessionalSuffix}/prescriptions/modals/${ModelSourceId}/parent/${router.locale}`,
            data: form
        }, {
            onSuccess: () => invalidateQueries([`${urlMedicalProfessionalSuffix}/prescriptions/modals/parents/${router.locale}`]),
            ...(loading && {
                onSettled: () => {
                    setPrescriptionModelOpenDialog(false);
                    setLoading(false);
                }
            })
        });
    }

    const handleDrop = (newTree: any, {dragSourceId, dropTargetId}: any) => {
        handleMoveModelRequest(dragSourceId, dropTargetId);
        setTreeData(newTree);
    }


    const handleDeleteModel = (props: any) => {
        setSelectedModel(props.node);
        setDialogAction(props.node.parent === 0 ? "parent" : "model");
        setDeleteModelDialog(true);
    }

    const handleEditModel = (props: any) => {
        switchModel(props.node.data);
        editPrescriptionModel(props);
    }

    const handleMoveModel = (props: any) => {
        dispatch(setParentModel(props.node.parent));
        setSelectedModel(props.node);
        setTimeout(() => setPrescriptionModelOpenDialog(true));
    }

    const handleDeleteAction = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLoading(true);
        triggerDeleteModel({
            method: "DELETE",
            url: `${urlMedicalProfessionalSuffix}/prescriptions/modals${selectedModel.parent === 0 ? "/parents/" : "/"}${selectedModel.id}/${router.locale}`
        }, {
            onSuccess: () => {
                setSelectedModel(null);
                invalidateQueries([`${urlMedicalProfessionalSuffix}/prescriptions/modals/parents/${router.locale}`]).then(
                    () => {
                        setLoading(false);
                        setDeleteModelDialog(false);
                    });
            }
        });
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
                        color: theme.palette.primary.main,
                        text: prescription.name,
                        data: prescription.prescriptionModalHasDrugs
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
                                    switchModel,
                                    handleEditModel,
                                    handleMoveModel,
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
                            startIcon={<CloseIcon/>}>
                            {t(`dialogs.delete-${dialogAction}-dialog.cancel`)}
                        </Button>
                        <LoadingButton
                            {...{loading}}
                            loadingPosition="start"
                            variant="contained"
                            color={"error"}
                            onClick={handleDeleteAction}
                            startIcon={<Icon height={"18"} width={"18"} color={"white"} path="icdelete"></Icon>}>
                            {t(`dialogs.delete-${dialogAction}-dialog.confirm`)}
                        </LoadingButton>
                    </>
                }
            />

            <Dialog
                {...{direction}}
                color={theme.palette.warning.main}
                contrastText={theme.palette.warning.contrastText}
                action={"medical_prescription_model"}
                open={openPrescriptionModelDialog}
                data={{t, models, selectedModel, color: "warning", setOpenAddParentDialog}}
                dialogClose={() => setPrescriptionModelOpenDialog(false)}
                size="md"
                title={`${t("move_the_template_in_folder", {ns: "consultation"})} "${selectedModel?.text}"`}
                actionDialog={(
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Button
                            variant="text-black"
                            onClick={() => {
                                setPrescriptionModelOpenDialog(false);
                            }}
                            startIcon={<CloseIcon/>}>
                            {t("cancel", {ns: "consultation"})}
                        </Button>
                        <LoadingButton
                            {...{loading}}
                            loadingPosition={"start"}
                            color={"warning"}
                            startIcon={<DriveFileMoveOutlinedIcon/>}
                            onClick={() => {
                                setLoading(true);
                                handleMoveModelRequest(selectedModel?.id, modelParent, true);
                            }}
                            variant="contained">
                            {t("save", {ns: "consultation"})}
                        </LoadingButton>
                    </Stack>
                )}/>
        </>
    );
}

export default ModelPrescriptionList;
