import React, { useState } from 'react'
import { Grid, Stack, Typography, TextField } from '@mui/material'
import AddDocumentDialogStyled from './overrides/addDocumentDialogStyle'
import { DocumentButton } from '@features/buttons';
import { UploadFile } from '@features/uploadFile';
import { useTranslation } from 'next-i18next'
import FileuploadProgress from '@features/fileUploadProgress/components/fileUploadProgress';
import { buttonsData } from './config';
function AddDocumentDialog({ data }: any) {
    const [files, setFile] = useState(data);
    const handleDrop = React.useCallback(
        (acceptedFiles: React.SetStateAction<never[]>) => {
            setFile(acceptedFiles);
        },
        [setFile]
    );
    const handleRemove = (file: any) => {
        setFile(files.filter((_file: any) => _file !== file));
    };
    const { t, ready } = useTranslation("common");
    if (!ready) return <>loading translations...</>;
    return (
        <AddDocumentDialogStyled>
            <Typography fontWeight={600} variant="subtitle2">
                {t('type_of_document')}
            </Typography>
            <Stack maxWidth="90%" m="auto" width="100%">
                <Grid container spacing={2} mt={2}>
                    {buttonsData.map((item, index) =>
                        <Grid key={index} item xs={6} md={2}>
                            <DocumentButton icon={item.icon} t={t} lable={item.label} handleOnClick={(v: string) => console.log(v)} />
                        </Grid>
                    )}

                </Grid>
            </Stack>
            <Stack spacing={2} maxWidth="90%" width={1} mx='auto' mt={3}>
                <Grid container spacing={{ lg: 2, xs: 1 }} alignItems="flex-start">
                    <Grid item xs={12} lg={3}>
                        <Typography textAlign={{ lg: 'right', xs: 'left' }} color="text.secondary" variant='body2' fontWeight={400}>
                            {t("name_of_the_document")}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} lg={9}>
                        <TextField
                            variant="outlined"
                            placeholder={t('type_the_name_of_the_document')}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Typography textAlign={{ lg: 'right', xs: 'left' }} color="text.secondary" variant='body2' fontWeight={400}>
                            {t("description")}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} lg={9}>
                        <TextField
                            variant="outlined"
                            placeholder={t('type_a_description')}
                            fullWidth
                            multiline
                            rows={4}
                        />
                    </Grid>
                    <Grid item xs={12} lg={3}>
                        <Typography textAlign={{ lg: 'right', xs: 'left' }} color="text.secondary" variant='body2' fontWeight={400}>
                            {t("import_document")}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} lg={9}>
                        {files?.length > 0 ?
                            <Stack spacing={2} maxWidth={{ xs: '100%', md: '50%' }}>
                                {files?.map((file: any, index: number) => (
                                    <FileuploadProgress key={index} file={file} progress={100} handleRemove={handleRemove} />

                                ))}
                            </Stack>
                            :
                            <UploadFile files={files} onDrop={handleDrop} singleFile={false}/>}
                    </Grid>
                </Grid>
            </Stack>
        </AddDocumentDialogStyled>
    )
}

export default AddDocumentDialog