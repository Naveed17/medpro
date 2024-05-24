import {Button, Card, DialogActions, Stack, TextField, Typography} from '@mui/material'
import BalanceSheetPendingStyled from './overrides/balanceSheetPendingStyle';
import {Dialog} from '@features/dialog'
import {useTranslation} from 'next-i18next'
import CloseIcon from "@mui/icons-material/Close";
import Icon from '@themes/urlIcon'
import React, {useState} from 'react';
import {LoadingScreen} from "@features/loadingScreen";

function BalanceSheetPendingDialog({...props}) {
    const {data} = props;
    const [analyses, setAnalyses] = useState<any>(data.state);
    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})

    const [files] = useState([]);
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <BalanceSheetPendingStyled>
            {/*<Grid container spacing={5}>
                <Grid item xs={12} md={7}>
                    <Typography marginBottom={2} gutterBottom>{t('importResult')}</Typography>

                    <Box mt="auto">
                        <UploadFileCard fontSize={16} onDrop={handleDrop}/>
                    </Box>
                    <Stack height={1}>
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
                    </Stack>
                    <Divider orientation="vertical"/>
                </Grid>
                <Grid item xs={12} md={5}>*/}
            <Typography gutterBottom>{t('balance_sheet_list')}</Typography>
            {analyses.hasAnalysis.map((item: any, index: number) => (
                <Card key={index} sx={{p: 1}}>
                    <Stack direction='row' alignItems="center" justifyContent='space-between' mb={1}>
                        <Typography>{item?.name}</Typography>
                    </Stack>
                    <TextField
                        placeholder={t("enter_the_result")}
                        value={item.result}
                        fullWidth
                        onChange={(ev) => {
                            let items = analyses.hasAnalysis.map((item: { result: string }) => ({...item}));
                            items[index].result = ev.target.value;
                            setAnalyses({uuid: analyses.uuid, hasAnalysis: items})
                            data.setState({uuid: analyses.uuid, hasAnalysis: items})
                        }}
                    />
                </Card>
            ))}

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
