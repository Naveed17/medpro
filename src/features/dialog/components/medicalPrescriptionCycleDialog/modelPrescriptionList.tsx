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

    const [groupPrescriptionModel, setGroupPrescriptionModel] = useState<any[]>([
        {uuid: 1, name: "Répertoire par défaut"},
        {uuid: 2, name: "Vaccines"}
    ]);
    const [treeData, setTreeData] = useState([
        ...(groupPrescriptionModel.map(group =>
            ({
                id: group.uuid,
                parent: 0,
                droppable: true,
                text: group.name
            })
        ))
    ]);

    const handleDrop = (newTree: any, {dragSourceId, dropTargetId, dragSource, dropTarget}: any) => {
        // Do something
        console.log(dragSourceId, dropTargetId, dragSource, dropTarget);
        setTreeData(newTree);
    }

    useEffect(() => {
        if (models) {
            setTreeData([...treeData,
                ...(models.map((model: any) => ({
                    id: model.uuid,
                    parent: 1,
                    text: model.name,
                    data: {
                        drugs: model.prescription_modal_has_drugs
                    }
                })))]);
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
                                {...{node, depth, isOpen, onToggle, switchPrescriptionModel}}
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
