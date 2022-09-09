import {
    Grid,
    Stack,
    Typography,
    Button,
    Card,
    IconButton,
    Autocomplete,
    TextField,
    Divider,
    Box,
    DialogActions
} from '@mui/material'
import {useFormik, Form, FormikProvider} from "formik";
import BalanceSheetPendingStyled from './overrides/balanceSheetPendingStyle';
import {UploadFileCard} from '@features/card';
import {Dialog} from '@features/dialog'
import {useTranslation} from 'next-i18next'
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from "@mui/icons-material/Close";
import Icon from '@themes/urlIcon'
import React, {useState} from 'react';

function BalanceSheetPendingDialog({...props}) {
    const {data} = props;
    const [analyses, setAnalyses] = useState<any[]>(data.state.analyses);
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const formik = useFormik({
        initialValues: {
            name: '',
        },
        onSubmit: async (values) => {
        },
    });
    const {values, handleSubmit, setFieldValue} = formik;
    const [files, setFile] = useState([]);
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const handleDrop = React.useCallback(
        (acceptedFiles: React.SetStateAction<never[]>) => {
            setFile(acceptedFiles);
            setOpenDialog(true)
        },
        [setFile]
    );
    const handleCloseDialog = () => {
        setOpenDialog(false);
    }
    if (!ready) return <>loading translations...</>;
    return (
        <BalanceSheetPendingStyled>
            <Grid container spacing={5}>
                <Grid item xs={12} md={7}>
                   {/* <Stack height={1}>
                        <FormikProvider value={formik}>
                            <Stack
                                spacing={2}
                                component={Form}
                                autoComplete="off"
                                noValidate
                                onSubmit={handleSubmit}
                            >
                                <Stack spacing={1}>
                                    <Typography>{t('please_name_the_balance_sheet')}</Typography>
                                    <Autocomplete
                                        disablePortal
                                        id="name_balance_sheet"
                                        disableClearable
                                        size='small'
                                        onChange={(object, value) => setFieldValue('name', value?.label)}
                                        isOptionEqualToValue={(option, value) => option.label === value.label}
                                        options={data}
                                        renderInput={(params) => <TextField {...params} placeholder={
                                            t('placeholder_balance_sheet_name')
                                        }/>}
                                    />
                                </Stack>
                                <Button className='btn-add' size='small'
                                        startIcon={
                                            <AddIcon/>
                                        }
                                >

                                    {t('add_balance_sheet')}
                                </Button>
                            </Stack>
                        </FormikProvider>
                        <Box mt="auto">
                            <UploadFileCard onDrop={handleDrop}/>
                        </Box>
                    </Stack>
                    <Divider orientation="vertical"/>*/}
                </Grid>
                <Grid item xs={12} md={5}>
                    <Typography gutterBottom>{t('balance_sheet_list')}</Typography>
                    {
                        analyses.map((item, index) => (
                            <Card key={index} sx={{p: 1}}>
                                <Stack direction='row' alignItems="center" justifyContent='space-between' mb={1}>
                                    <Typography>{item.name}</Typography>
                                    <IconButton size="small">
                                        <Icon path="setting/icdelete"/>
                                    </IconButton>
                                </Stack>
                                <TextField
                                    placeholder={t("enter_the_result")}
                                    value={item.value}
                                    onChange={(ev)=>{
                                        console.log(analyses[index].value)
                                        /*analyses[index].value = ev.target.value
                                        setAnalyses([...analyses])*/

                                    }}
                                    fullWidth
                                />
                            </Card>
                        ))}
                </Grid>
            </Grid>
            <Dialog action={"add_a_document"}
                    open={openDialog}
                    data={files}
                    change={false}
                    size={"lg"}
                    direction={'ltr'}
                    actions={true}
                    title={t("add_a_document")}
                    dialogClose={handleCloseDialog}
                    actionDialog={
                        <DialogActions>
                            <Button onClick={handleCloseDialog}
                                    startIcon={<CloseIcon/>}>
                                {t('cancel')}
                            </Button>
                            <Button variant="contained"
                                    onClick={handleCloseDialog}

                                    startIcon={<Icon
                                        path='ic-dowlaodfile'/>}>
                                {t('save')}
                            </Button>
                        </DialogActions>
                    }/>
        </BalanceSheetPendingStyled>
    )
}

export default BalanceSheetPendingDialog
