import React from 'react'
import { Stack, Typography, TextField, List } from '@mui/material';
import {
    DragDropContext,
    Droppable,
    Draggable,
    DraggableProvided,
    DraggableStateSnapshot,
    DropResult
} from "react-beautiful-dnd";
import BasicAlert from "@themes/overrides/Alert";
import FileuploadProgress from "@themes/overrides/FileuploadProgress"
import UploadMultiFile from "@themes/overrides/UploadMultiFile"
import QualifactionsProfessional from "@themes/overrides/QualifactionsProfessional"
import {isDraggable} from "framer-motion/types/render/utils/is-draggable";
const listQlf = [
    {
        id: "1",
        name: "Study Spanish"
    },
    {
        id: "2",
        name: "Workout"
    },
    {
        id: "3",
        name: "Film Youtube"
    },
    {
        id: "4",
        name: "Grocery Shop"
    }
]
function QualificationDialog() {
    const [files, setFile] = React.useState([]);
    const [ todo, setTodo ] = React.useState(listQlf)
    const handleDrop = React.useCallback(
        (acceptedFiles: any) => {
            setFile(acceptedFiles);
        },
        [setFile]
    );
    const handleRemove = (file: any) => {
        setFile(files.filter((_file) => _file !== file));
    };

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        const items = Array.from(todo);
        const [ newOrder ] = items.splice(source.index, 1);
        items.splice(destination.index, 0, newOrder);

        setTodo(items);
    };

    const getItemStyle = (isDraggable: boolean,draggableStyle:any) =>({
        padding:10,
        margin: '0 50px 15px 50px',
        background: isDraggable ? '#4a2975':'white',
        border: '1px solid black',
        frontSize:'20px',
        borderRadius: '5px',
        ...draggableStyle
    })

    return (
        <>
            <Stack spacing={2} className="top-sec">
                <Typography>Titre</Typography>
                <TextField placeholder='...'/>
                <BasicAlert icon="ic-danger"
                            data={"Parce que la confidentialité de vos informations est importante, nous n'afficherons pas vos documents dans votre profil public.Les données qu'ils contiennent seront extraites et converties en texte."}
                            color="warning">.</BasicAlert>
                {files.length > 0 ?
                    <Stack spacing={2}>
                        {files.map((file, index) => (
                            <FileuploadProgress key={index} file={file} progress={100} handleRemove={handleRemove}/>
                        ))}
                    </Stack>
                    :
                    <UploadMultiFile files={files} onDrop={handleDrop} error={undefined} sx={undefined}
                                     singleFile={undefined}/>}
            </Stack>
            <Stack spacing={2} className="bottom-sec">
                <Typography variant="subtitle1" fontWeight={600} marginTop={4}>liste des qualifications professionnelles</Typography>

                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="todo">
                        {(provided) => (
                            <div className="todo" {...provided.droppableProps} ref={provided.innerRef}>
                                {todo.map((item, index) => {
                                    return (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided, snapshot) => (
                                                <QualifactionsProfessional provided={provided}
                                                                           snapshot={snapshot}
                                                                           item={item}>.</QualifactionsProfessional>
                                            )}
                                        </Draggable>
                                    )
                                })}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                {/*<DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided) => (
                            <List {...provided.droppableProps} ref={provided.innerRef}>
                                {items.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided:DraggableProvided, snapshot:DraggableStateSnapshot) => (
                                            <QualifactionsProfessional
                                                provided={provided}
                                                snapshot={snapshot}
                                                item={item}
                                                onClick={(e:Event) => console.log(e)}
                                            >.</QualifactionsProfessional>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </List>
                        )}
                    </Droppable>
                </DragDropContext>*/}
            </Stack>

        </>
    )
}

export default QualificationDialog;
