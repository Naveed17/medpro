import { Stack, Typography, TextField } from '@mui/material';
import BasicAlert from "@themes/overrides/Alert";
import FileuploadProgress from "@themes/overrides/FileuploadProgress"
import UploadMultiFile from "@themes/overrides/UploadMultiFile"
import {useTranslation} from "next-i18next";
import {useCallback, useState} from "react";

const listQf = [
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
    const [files, setFile] = useState([]);
    const [ todo, setTodo ] = useState(listQf)
    const handleDrop = useCallback(
        (acceptedFiles: any) => {
            setFile(acceptedFiles);
        },
        [setFile]
    );

    const { t, ready } = useTranslation('settings');
    if (!ready) return (<>loading translations...</>);

    const handleRemove = (file: any) => {
        setFile(files.filter((_file) => _file !== file));
    };

/*    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result;
        if (!destination) return;

        const items = Array.from(todo);
        const [ newOrder ] = items.splice(source.index, 1);
        items.splice(destination.index, 0, newOrder);

        setTodo(items);
    };*/


    return (
        <>
            <Stack spacing={2} className="top-sec">
                <Typography>{t('profil.title')}</Typography>
                <TextField placeholder='...'/>
                <BasicAlert icon="ic-danger"
                            data={t('profil.alertQ')}
                            color="warning">.</BasicAlert>
                {files.length > 0 ?
                    <Stack spacing={2}>
                        {files.map((file, index) => (
                            <FileuploadProgress key={index} file={file} progress={100} handleRemove={handleRemove}/>
                        ))}
                    </Stack>
                    :
                    <UploadMultiFile files={files} onDrop={handleDrop} error={undefined} sx={undefined}
                                     singleFile={undefined} title={t('profil.drop')} />}
            </Stack>
            <Stack spacing={2} className="bottom-sec">
                <Typography variant="subtitle1" fontWeight={600} marginTop={4}>{t('profil.listQ')}</Typography>

{/*                <DragDropContext onDragEnd={onDragEnd}>
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
                </DragDropContext>*/}

            </Stack>

        </>
    )
}

export default QualificationDialog;
