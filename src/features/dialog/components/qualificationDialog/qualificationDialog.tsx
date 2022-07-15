import {Stack, Typography, TextField, List} from '@mui/material';
import BasicAlert from "@themes/overrides/Alert";
import FileuploadProgress from "@themes/overrides/FileuploadProgress"
import UploadMultiFile from "@themes/overrides/UploadMultiFile"
import {useTranslation} from "next-i18next";
import {useCallback, useEffect, useState} from "react";
import {
    SortableList,
    SortableItem,
} from '@thaddeusjiang/react-sortable-list';
import QualifactionsProfessional from "@themes/overrides/QualifactionsProfessional"
import {SetQualifications} from "@features/checkList";
import {useAppDispatch} from "@app/redux/hooks";


function QualificationDialog(info: any) {
    const [files, setFile] = useState([]);
    const [items, setItems] = useState(info.data);

    const dispatch = useAppDispatch();

    const handleDrop = useCallback(
        (acceptedFiles: any) => {
            setFile(acceptedFiles);
        },
        [setFile]
    );

    useEffect(() => {
        dispatch(SetQualifications(items))
    }, [items])

    const {t, ready} = useTranslation('settings');
    if (!ready) return (<>loading translations...</>);

    const handleRemove = (file: any) => {
        setFile(files.filter((_file) => _file !== file));
    };

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
                                     singleFile={undefined} title={t('profil.drop')}/>}
            </Stack>
            <Stack spacing={2} className="bottom-sec">
                <Typography variant="subtitle1" fontWeight={600} marginTop={4}>{t('profil.listQ')}</Typography>

                <SortableList items={items} setItems={setItems}>
                    {({items}) => (
                        <List>
                            {items.map((item) => (
                                <SortableItem key={item.uuid} id={item.uuid}>
                                    <QualifactionsProfessional item={item}>.</QualifactionsProfessional>
                                </SortableItem>
                            ))}
                        </List>
                    )}
                </SortableList>

            </Stack>

        </>
    )
}

export default QualificationDialog;
