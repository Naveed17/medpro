import React, {useEffect, useState} from "react";
import {
    List,
    ListItem,
    Stack,
    Skeleton
} from "@mui/material";

import {
    Tree,
    getBackendOptions,
    MultiBackend,
} from "@minoru/react-dnd-treeview";
import {DndProvider} from "react-dnd";
import {CustomDragPreview, CustomNode} from "@features/treeView";
import TreeStyled from "./overrides/treeStyled";

function ModelPrescriptionList({...props}) {
    const {models, t, switchPrescriptionModel} = props;

    const [treeData, setTreeData] = useState<any[]>([]);

    const handleDrop = (newTree: any, {dragSourceId, dropTargetId, dragSource, dropTarget}: any) => {
        // Do something
        console.log(dragSourceId, dropTargetId, dragSource, dropTarget);
        setTreeData(newTree);
    }

    useEffect(() => {
        if (models) {
            const parentModels: PrescriptionPatternModel[] = [];
            models.map((model: PrescriptionParentModel) => {
                parentModels.push(...[
                    {
                        id: model.uuid,
                        parent: 0,
                        droppable: true,
                        text: model.name === "default" ? "Répertoire par défaut" : model.name
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
            parentModels.sort(model => {
                console.log(model);
                return model.text === "Répertoire par défaut" && model.parent === 0 ? -1 : 1;
            });
            console.log("parentModels", parentModels);
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
                                {...{node, t, depth, isOpen, onToggle, switchPrescriptionModel}}
                            />
                        )}
                        enableAnimateExpand={true}
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
        </>
    );
}

export default ModelPrescriptionList;
