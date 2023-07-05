import {
    Autocomplete,
    Box,
    Button,
    Card,
    DialogActions,
    Grid,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Menu,
    MenuItem,
    Skeleton,
    Stack,
    TextField,
    Theme,
    Tooltip,
    Typography,
    useMediaQuery
} from '@mui/material'
import {Form, FormikProvider, useFormik} from "formik";
import BalanceSheetDialogStyled from './overrides/balanceSheetDialogStyle';
import AddIcon from '@mui/icons-material/Add';
import Icon from '@themes/urlIcon'
import React, {useEffect, useState} from 'react';
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import {useRequest, useRequestMutation} from "@lib/axios";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import {LoadingScreen} from "@features/loadingScreen";
import {NoDataCard} from "@features/card";
import {useMedicalProfessionalSuffix} from "@lib/hooks";
import {useTranslation} from "next-i18next";
import {useSnackbar} from "notistack";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
export const BalanceSheetCardData = {
    mainIcon: "ic-analyse",
    title: "noRequest",
    description: "noRequest-description"
};

function BalanceSheetDialog({...props}) {
    const {data} = props;
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
    const router = useRouter();
    const {data: session} = useSession();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})

    const [model, setModel] = useState<string>('');
    const [modals, setModels] = useState<any[]>([]);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [balanceValue] = useState<AnalysisModel | null>(null);
    const [searchAnalysis, setSearchAnalysis] = useState<AnalysisModel[]>([]);
    const [analysis, setAnalysis] = useState<AnalysisModel[]>(data.state);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedModel, setSelectedModel] = useState<any>(null);
    const [name, setName] = useState('');

    const open = Boolean(anchorEl);

    const {trigger} = useRequestMutation(null, "/balanceSheet");
    const {enqueueSnackbar} = useSnackbar();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (item: { uuid: string, analyses: AnalysisModel[] }) => {
        setAnalysis(item.analyses)
        data.setState(item.analyses)
        setSelectedModel(item)
        setAnchorEl(null);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    }

    const formik = useFormik({
        initialValues: {
            name: ''
        },
        onSubmit: async () => {
            if (name.length > 0)
                addAnalysis({uuid: '', name})
        },
    });

    const initialData = Array.from(new Array(20));

    const {data: httpAnalysisResponse} = useRequest({
        method: "GET",
        url: `/api/private/analysis/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    const {data: httpModelResponse, mutate} = useRequest(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/requested-analysis-modal/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null);

    const analysisList = (httpAnalysisResponse as HttpResponse)?.data as AnalysisModel[];
    const {handleSubmit} = formik;
    const addAnalysis = (value: AnalysisModel) => {
        setName('')
        let copy = [...analysis]
        copy.unshift({...value, note: ""});
        setAnalysis([...copy]);
        const recents = localStorage.getItem("balance-Sheet-recent") ?
            JSON.parse(localStorage.getItem("balance-Sheet-recent") as string) : [] as AnalysisModel[];
        localStorage.setItem("balance-Sheet-recent", JSON.stringify([...recents, ...copy.filter(x => !recents.find((r: AnalysisModel) => r.uuid === x.uuid))]));
        data.setState([...copy]);
    }
    const saveModel = () => {
        const form = new FormData();
        form.append('globalNote', "");
        form.append('name', model);
        form.append('analyses', JSON.stringify(analysis));
        trigger({
            method: "POST",
            url: `${urlMedicalProfessionalSuffix}/requested-analysis-modal/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => {
            setOpenDialog(false);
            setModel("")
            mutate().then(() =>
                enqueueSnackbar(t("created"), {variant: 'success'})
            );
        })
    }
    const searchInAnalysis = (analysisName: string) => {
        setName(analysisName);
        if (analysisName.length >= 2) {
            trigger({
                method: "GET",
                url: `/api/private/analysis/${router.locale}?name=${analysisName}`,
                headers: {Authorization: `Bearer ${session?.accessToken}`}
            }).then((r) => {
                const res = (r?.data as HttpResponse).data;
                setSearchAnalysis(res.length > 0 ? res : analysisList);
            });
        } else {
            setSearchAnalysis(analysisList);
        }
    }

    const deleteModel = () =>{
        trigger({
            method: "DELETE",
            url: `${urlMedicalProfessionalSuffix}/requested-analysis-modal/${selectedModel.uuid}/${router.locale}`,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => {
            mutate().then(() => {
                setSelectedModel(null)
                setAnalysis([]);
                enqueueSnackbar(t("removed"), {variant: 'success'})
            });
        })
    }
    const editModel = () =>{
        const form = new FormData();
        form.append('globalNote', "");
        form.append('name', selectedModel.name);
        form.append('analyses', JSON.stringify(analysis));
        trigger({
            method: "PUT",
            url: `${urlMedicalProfessionalSuffix}/requested-analysis-modal/${selectedModel.uuid}/${router.locale}`,
            data: form,
            headers: {Authorization: `Bearer ${session?.accessToken}`}
        }).then(() => {
            mutate().then(() => {
                enqueueSnackbar(t("updated"), {variant: 'success'})
            });
        })
    }

    useEffect(() => {
        if (httpModelResponse)
            setModels((httpModelResponse as HttpResponse).data);
    }, [httpModelResponse]);

    useEffect(() => {
        if (analysisList) {
            setSearchAnalysis(analysisList);
            setLoading(false);
        }
    }, [analysisList]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen  button text={"loading-error"}/>);

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
                                    {!isMobile && <Typography>{t('please_name_the_balance_sheet')}</Typography>}
                                    {modals.length > 0 && <Button
                                        sx={{ml: 'auto'}}
                                        endIcon={
                                            <KeyboardArrowDownIcon/>
                                        }
                                        id="basic-button"
                                        aria-controls={open ? 'basic-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}
                                    >
                                        {t('balance_sheet_model')}
                                    </Button>}
                                    <Menu
                                        id="basic-menu"
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={() => {
                                            setAnchorEl(null);
                                        }}
                                        sx={{
                                            '& .MuiPaper-root': {
                                                borderRadius: 0,
                                                borderBottomLeftRadius: 8,
                                                borderBottomRightRadius: 8,
                                                marginTop: theme => theme.spacing(1),
                                                minWidth: 150,
                                                backgroundColor: theme => theme.palette.text.primary

                                            }
                                        }}
                                        MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                        }}>
                                        {modals.map((item, idx) =>
                                            <MenuItem key={idx} sx={{color: theme => theme.palette.grey[0]}}
                                                      onClick={() => {
                                                          handleClose(item)
                                                      }}>{item.name}</MenuItem>
                                        )}
                                    </Menu>
                                </Stack>
                                <Autocomplete
                                    value={balanceValue}
                                    onInputChange={(event, value) => searchInAnalysis(value)}
                                    onChange={(event, newValue) => {
                                        if (typeof newValue === 'string') {
                                            addAnalysis({
                                                name: newValue,
                                            });
                                        } else if (newValue && newValue.inputValue) {
                                            // Create a new value from the user input
                                            addAnalysis({
                                                name: newValue.inputValue,
                                            });
                                        } else {
                                            const analysisItem = (newValue as AnalysisModel);
                                            if (!analysis.find(item => item.uuid === analysisItem.uuid)) {
                                                addAnalysis(newValue as AnalysisModel);
                                            }
                                        }
                                    }}
                                    filterOptions={(options, params) => {
                                        const {inputValue} = params;
                                        const filtered = options.filter(option =>
                                            [option.name.toLowerCase(), option.abbreviation?.toLowerCase()].some(option => option?.includes(inputValue.toLowerCase())));
                                        // Suggest the creation of a new value
                                        const isExisting = options.some((option) => inputValue.toLowerCase() === option.name);
                                        if (inputValue !== '' && !isExisting) {
                                            filtered.push({
                                                inputValue,
                                                name: `${t('add_balance_sheet')} "${inputValue}"`,
                                            });
                                        }
                                        return filtered;
                                    }}
                                    selectOnFocus
                                    clearOnEscape
                                    handleHomeEndKeys
                                    id="sheet-solo-balance"
                                    options={searchAnalysis}
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
                                    renderOption={(props, option) =>
                                        <li {...props}
                                            key={option.uuid ? option.uuid : "-1"}>{option.name} {option.abbreviation ? `(${option.abbreviation})` : ""}</li>}
                                    freeSolo
                                    renderInput={(params) => (
                                        <TextField {...params} label={t('placeholder_balance_sheet_name')}/>
                                    )}
                                />
                            </Stack>
                            <Typography>
                                {t('recent-search')}
                            </Typography>
                            {!loading ?
                                <List className='items-list'>
                                    {(localStorage.getItem("balance-Sheet-recent") ?
                                        JSON.parse(localStorage.getItem("balance-Sheet-recent") as string) : analysisList)?.map((analysisItem: AnalysisModel, index: number) => (
                                            <ListItemButton
                                                disabled={analysis.find(an => an.uuid && an.uuid === analysisItem.uuid) !== undefined}
                                                key={index}
                                                onClick={() => {
                                                    addAnalysis(analysisItem)
                                                }}>
                                                <ListItemText primary={analysisItem.name}/>
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
                        {selectedModel === null &&<Typography gutterBottom>{t('balance_sheet_list')}</Typography>}
                        {selectedModel && <TextField placeholder={t('modeleName')} onChange={(ev)=>{
                            selectedModel.name = ev.target.value;
                            setSelectedModel({...selectedModel})
                        }} value={selectedModel.name}></TextField>}
                        {analysis.length > 0 && <Button
                            size={"small"}
                            sx={{ml: 'auto'}}
                            onClick={() => {
                                setOpenDialog(true)
                            }}
                            startIcon={
                                <AddIcon/>
                            }>
                            {t('save_template')}
                        </Button>}
                        {selectedModel && <Stack direction={"row"}>
                            <Tooltip title={t('edit_template')}>
                                <IconButton
                                    size="small"
                                    onClick={editModel}><EditRoundedIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={t('delete_template')}>
                                <IconButton
                                    size="small"
                                    color={"error"}
                                    onClick={deleteModel}><DeleteOutlineRoundedIcon/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={t('close_template')}>
                                <IconButton size="small" onClick={()=>{setAnalysis([]);setSelectedModel(null)}}><CloseRoundedIcon/>
                                </IconButton>
                            </Tooltip>
                        </Stack>}
                    </Stack>
                    <Box className="list-container">
                        {analysis.length > 0 ?
                            analysis.map((item, index) => (
                                <Card key={index}>
                                    <Stack p={1} direction='row' alignItems="center" justifyContent='space-between'>
                                        <Typography>{item.name}</Typography>
                                        <IconButton size="small"
                                                    onClick={() => {
                                                        const copy = [...analysis]
                                                        copy.splice(index, 1);
                                                        setAnalysis([...copy])
                                                        data.setState([...copy])
                                                    }}>
                                            <Icon path="setting/icdelete"/>
                                        </IconButton>
                                    </Stack>
                                    <Box padding={1} pt={0}>
                                        <TextField
                                            fullWidth
                                            placeholder={t("note")}
                                            multiline={true}
                                            style={{backgroundColor: "white", borderRadius: 5}}
                                            inputProps={
                                                {
                                                    style: {
                                                        padding: 3
                                                    },
                                                }
                                            }
                                            rows={5}
                                            value={item.note}
                                            onChange={event => {
                                                let items = [...analysis];
                                                let x = {...analysis[index]};
                                                x.note = event.target.value;
                                                items[index] = x;
                                                setAnalysis([...items])
                                                data.setState([...items])
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
                                        data={BalanceSheetCardData}
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
                    title={t('bilanModelName')}
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

export default BalanceSheetDialog
