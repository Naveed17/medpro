import {
    Autocomplete,
    Box,
    Button,
    Card,
    createFilterOptions,
    DialogActions,
    Grid,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Skeleton,
    Stack,
    TextField,
    Typography
} from '@mui/material'
import {Form, FormikProvider, useFormik} from "formik";
import BalanceSheetDialogStyled from '../balanceSheet/overrides/balanceSheetDialogStyle';
import {useTranslation} from 'next-i18next'
import Icon from '@themes/urlIcon'
import React, {useCallback, useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useRequest, useRequestMutation} from "@app/axios";
import {Session} from "next-auth";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingScreen} from "@features/loadingScreen";
import {NoDataCard} from "@features/card";

const filter = createFilterOptions<any>();

export const MedicalPrescriptionCardData = {
    mainIcon: "ic-soura",
    title: "noRequest",
    description: "noRequest-description"
};

function MedicalImageryDialog({...props}) {
    const {data} = props;

    const [imageryValue, setImagery] = useState<MIModel | null>(null);
    const [model, setModel] = useState<string>('');
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [miList, setMiList] = useState<MIModel[]>([]);
    const [mi, setMi] = useState<MIModel[]>(data.state);
    const [loading, setLoading] = useState<boolean>(true);
    const {trigger} = useRequestMutation(null, "/medicalImagery");
    const [name, setName] = useState('');

    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const formik = useFormik({
        initialValues: {
            name: ''
        },
        onSubmit: async () => {
            if (name.length > 0)
                addImage({uuid: '', name})
        },
    });

    const initialData = Array.from(new Array(20));

    const router = useRouter();
    const {data: session} = useSession();
    const {data: user} = session as Session;

    const {data: httpAnalysisResponse} = useRequest({
        method: "GET",
        url: "/api/private/medical-imaging/" + router.locale,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const addImage = (value: MIModel) => {
        setName('')
        setMiList((httpAnalysisResponse as HttpResponse)?.data);
        mi.unshift({...value, note: ""})
        setMi([...mi])
        localStorage.setItem("medical-imagery-recent", JSON.stringify([...mi]));
        data.setState([...mi])
    }

    const saveModel = () => {
        const form = new FormData();
        form.append('globalNote', "");
        form.append('name', model);
        form.append('analyses', JSON.stringify(mi));

        trigger({
            method: "POST",
            url: "/api/medical-entity/" + medical_entity.uuid + '/requested-analysis-modal/' + router.locale,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => {
            setOpenDialog(false);
        })
    }

    const sortMedicalImagery = useCallback(() => {
        const recent = localStorage.getItem("medical-imagery-recent") ?
            JSON.parse(localStorage.getItem("medical-imagery-recent") as string) : [] as AnalysisModel[];
        if (recent.length > 0 && miList) {
            setMiList([
                ...recent,
                ...miList.filter(x => !recent.find((r: AnalysisModel) => r.uuid === x.uuid))]);
        }
    }, [miList])

    const searchInMedicalImagery = (medicalImagery: string) => {
        setName(medicalImagery);
        if (medicalImagery.length >= 2) {
            trigger({
                method: "GET",
                url: `/api/private/medical-imaging/${router.locale}?name=${medicalImagery}`,
                headers: {Authorization: `Bearer ${session?.accessToken}`}
            }).then((r) => {
                const res = (r?.data as HttpResponse).data;
                setMiList(res.length > 0 ? res : (httpAnalysisResponse as HttpResponse)?.data);
                sortMedicalImagery();
            })
        } else
            setMiList((httpAnalysisResponse as HttpResponse)?.data);
    }

    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    useEffect(() => {
        setMiList((httpAnalysisResponse as HttpResponse)?.data);
        setTimeout(() => {
            setLoading(false);
            sortMedicalImagery();
        }, 1000)
    }, [httpAnalysisResponse]) // eslint-disable-line react-hooks/exhaustive-deps

    const {handleSubmit} = formik;

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <BalanceSheetDialogStyled>
            <Grid container spacing={5}>
                <Grid item xs={12} md={7}>
                    <FormikProvider value={formik}>
                        <Stack
                            spacing={2}
                            component={Form}
                            autoComplete="off"
                            noValidate
                            onSubmit={handleSubmit}>
                            <Stack spacing={1}>
                                <Stack direction="row" alignItems="center">
                                    <Typography>{t('please_name_medical_imagery')}</Typography>
                                </Stack>
                                {/*                                <TextField
                                    id="balance_sheet_name"
                                    value={name}
                                    placeholder={t('placeholder_medical_imagery')}
                                    onChange={handleChange}/>*/}
                                <Autocomplete
                                    value={imageryValue}
                                    onInputChange={(event, value) => searchInMedicalImagery(value)}
                                    onChange={(event, newValue) => {
                                        if (typeof newValue === 'string') {
                                            addImage({
                                                name: newValue,
                                            });
                                        } else if (newValue && newValue.inputValue) {
                                            // Create a new value from the user input
                                            addImage({
                                                name: newValue.inputValue,
                                            });
                                        } else {
                                            const medicalImagery = (newValue as MIModel);
                                            if (!mi.find(item => item.uuid === medicalImagery.uuid)) {
                                                addImage(newValue as MIModel);
                                            }
                                        }
                                        sortMedicalImagery();
                                    }}
                                    filterOptions={(options, params) => {
                                        const filtered = filter(options, params);
                                        const {inputValue} = params;
                                        // Suggest the creation of a new value
                                        const isExisting = options.some((option) => inputValue === option.name);
                                        if (inputValue !== '' && !isExisting) {
                                            filtered.push({
                                                inputValue,
                                                name: `${t('add_medical_imagery')} "${inputValue}"`,
                                            });
                                        }

                                        return filtered;
                                    }}
                                    selectOnFocus
                                    clearOnEscape
                                    handleHomeEndKeys
                                    id="sheet-solo-balance"
                                    options={miList ? miList : []}
                                    getOptionLabel={(option) => {
                                        // Value selected with enter, right from the input
                                        if (typeof option === 'string') {
                                            return option;
                                        }
                                        // Add "xxx" option created dynamically
                                        if (option.inputValue) {
                                            return option.inputValue;
                                        }
                                        // Regular option
                                        return option.name;
                                    }}
                                    renderOption={(props, option) => <li {...props}>{option.name}</li>}
                                    freeSolo
                                    renderInput={(params) => (
                                        <TextField {...params} label={t('placeholder_medical_imagery')}/>
                                    )}
                                />
                            </Stack>
                            <Typography>
                                {t('recent-search')}
                            </Typography>
                            {!loading ?
                                <List className='items-list'>
                                    {miList?.map((item, index) => (
                                            <ListItemButton
                                                disabled={!!mi.find(an => an.uuid === item.uuid)}
                                                key={index}
                                                onClick={() => {
                                                    addImage(item)
                                                }}>
                                                <ListItemText primary={item.name}/>
                                            </ListItemButton>
                                        )
                                    )}
                                </List> : <List className='items-list'>
                                    {initialData.map((item, index) => (
                                            <ListItemButton key={index}>
                                                <Skeleton sx={{ml: 1}} width={130} height={8}
                                                          variant="rectangular"/>
                                            </ListItemButton>
                                        )
                                    )}
                                </List>
                            }
                        </Stack>
                    </FormikProvider>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Stack direction="row" alignItems="center">
                        <Typography gutterBottom>{t('medical_imagery_list')}</Typography>
                        {/*{analysis.length > 0 && <Button className='btn-add'
                                                        sx={{ml: 'auto'}}
                                                        onClick={() => {
                                                            setOpenDialog(true)
                                                        }}
                                                        startIcon={
                                                            <AddIcon/>
                                                        }>
                            {t('save_template')}
                        </Button>}*/}
                    </Stack>
                    <Box className="list-container">
                        {mi.length > 0 ?
                            mi.map((item, index) => (
                                <Card key={index}>
                                    <Stack p={1} direction='row' alignItems="center" justifyContent='space-between'>
                                        <Typography>{item.name}</Typography>
                                        <IconButton size="small" onClick={() => {
                                            mi.splice(index, 1);
                                            setMi([...mi])
                                            data.setState([...mi])
                                        }}>
                                            <Icon path="setting/icdelete"/>
                                        </IconButton>
                                    </Stack>
                                    <Box padding={1}>
                                        <TextField
                                            fullWidth
                                            placeholder={t("note")}
                                            value={item.note}
                                            onChange={event => {
                                                //console.log(event)
                                                mi[index].note = event.target.value;
                                                setMi([...mi])
                                            }}
                                        />
                                    </Box>

                                </Card>
                            ))
                            : <Card className='loading-card'>
                                <Stack spacing={2}>
                                    <NoDataCard
                                        {...{t}}
                                        ns={"consultation"}
                                        data={MedicalPrescriptionCardData}
                                    />
                                </Stack>
                            </Card>
                        }
                    </Box>
                </Grid>
            </Grid>

            <Dialog action={'modelName'}
                    open={openDialog}
                    data={{model, setModel}}
                    change={false}
                    max
                    size={"sm"}
                    direction={'ltr'}
                    actions={true}
                    title={t('imgModelName')}
                    dialogClose={handleCloseDialog}
                    actionDialog={
                        <DialogActions>
                            <Button onClick={handleCloseDialog}
                                    startIcon={<CloseIcon/>}>
                                {t('cancel')}
                            </Button>
                            <Button variant="contained"
                                    onClick={saveModel}
                                    startIcon={<Icon
                                        path='ic-dowlaodfile'/>}>
                                {t('save')}
                            </Button>
                        </DialogActions>
                    }/>
        </BalanceSheetDialogStyled>
    )
}

export default MedicalImageryDialog
