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
import {useRequestMutation} from "@lib/axios";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";
import {useSWRConfig} from "swr";
import {useMedicalProfessionalSuffix} from "@lib/hooks";

function ModelPrescriptionList({...props}) {
    const {models, t, initialOpenData, switchPrescriptionModel} = props;
    const {data: session} = useSession();
    const router = useRouter();
    const {mutate} = useSWRConfig();
    const urlMedicalProfessionalSuffix = useMedicalProfessionalSuffix();

    const [treeData, setTreeData] = useState<any[]>([]);

    const {trigger: triggerPrescriptionEdit} = useRequestMutation(null, "/prescription/model/edit");

    const handleDrop = (newTree: any, {dragSourceId, dropTargetId}: any) => {
        const form = new FormData();
        form.append("parent", dropTargetId);
        triggerPrescriptionEdit({
            method: "PATCH",
            url: `${urlMedicalProfessionalSuffix}/prescriptions/modals/${dragSourceId}/parent/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`},
        }).then(() => {
            mutate(`${urlMedicalProfessionalSuffix}/prescriptions/modals/parents/${router.locale}`);
        });
        setTreeData(newTree);
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
                                {...{node, t, depth, isOpen, onToggle, switchPrescriptionModel}}
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
        </>
    );
}

export default ModelPrescriptionList;
