import {
    Autocomplete,
    Box,
    Button,
    Card,
    Chip,
    DialogActions,
    Grid,
    IconButton,
    InputAdornment, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader,
    Skeleton,
    Stack, Tab, Tabs,
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
import React, {createRef, useCallback, useEffect, useRef, useState} from 'react';
import {useRouter} from "next/router";
import {useRequestQuery, useRequestQueryMutation} from "@lib/axios";
import {Dialog} from "@features/dialog";
import CloseIcon from "@mui/icons-material/Close";
import dynamic from "next/dynamic";
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import {NoDataCard, NoteCardCollapse} from "@features/card";
import {a11yProps, arrayUniqueByKey, useMedicalEntitySuffix, useMedicalProfessionalSuffix} from "@lib/hooks";
import {useTranslation} from "next-i18next";
import {useSnackbar} from "notistack";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {debounce} from "lodash";
import SearchIcon from "@mui/icons-material/Search";
import {ReactQueryNoValidateConfig} from "@lib/axios/useRequestQuery";
import {useAppSelector} from "@lib/redux/hooks";
import {dashLayoutSelector} from "@features/base";
import {TabPanel} from "@features/tabPanel";
import RemoveCircleRoundedIcon from "@mui/icons-material/RemoveCircleRounded";

const LoadingScreen = dynamic(() => import('@features/loadingScreen/components/loadingScreen'));

function BalanceSheetDialog({...props}) {
    const {data} = props;
    const {urlMedicalProfessionalSuffix} = useMedicalProfessionalSuffix();
    const {urlMedicalEntitySuffix} = useMedicalEntitySuffix();
    const router = useRouter();
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
    const {enqueueSnackbar} = useSnackbar();

    const {t, ready} = useTranslation("consultation", {keyPrefix: "consultationIP"})
    const {medicalEntityHasUser} = useAppSelector(dashLayoutSelector);

    const [model, setModel] = useState<string>('');
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [balanceValue, setBalanceValue] = useState<AnalysisModel | null>(null);
    const [searchAnalysis, setSearchAnalysis] = useState<AnalysisModel[]>([]);
    const [analysis, setAnalysis] = useState<AnalysisModel[]>(data.state);
    const [analysisList, setAnalysisList] = useState<AnalysisModel[]>([]);
    const [analysisListLocal, setAnalysisListLocal] = useState<AnalysisModel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedModel, setSelectedModel] = useState<any>(data.model);
    const [name, setName] = useState('');
    const [balanceSheetTabIndex, setbalanceSheetTabIndex] = useState(0);
    const [anchorElPopover, setAnchorElPopover] = useState<HTMLDivElement | null>(null);
    const textFieldRef = createRef<HTMLDivElement>();
    const autocompleteTextFieldRef = useRef<HTMLInputElement>(null);
    const openPopover = Boolean(anchorElPopover);
    const open = Boolean(anchorEl);

    const {trigger: triggerBalanceSheetCreate} = useRequestQueryMutation("/balanceSheet/create");
    const {trigger: triggerBalanceSheetUpdate} = useRequestQueryMutation("/balanceSheet/update");
    const {trigger: triggerBalanceSheetDelete} = useRequestQueryMutation("/balanceSheet/delete");
    const {trigger: triggerBalanceSheetGet} = useRequestQueryMutation("/balanceSheet/get");
    const {trigger: triggerFavoriteAdd} = useRequestQueryMutation("/balanceSheet/favorite/create");
    const {trigger: triggerFavoriteDelete} = useRequestQueryMutation("/balanceSheet/favorite/delete");

    const {data: httpAnalysisResponse} = useRequestQuery({
        method: "GET",
        url: `/api/private/analysis/${router.locale}`
    }, ReactQueryNoValidateConfig);

    const {data: httpModelResponse, mutate} = useRequestQuery(urlMedicalProfessionalSuffix ? {
        method: "GET",
        url: `${urlMedicalProfessionalSuffix}/requested-analysis-modal/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const {
        data: httpAnalysisFavoritesResponse,
        isLoading: isAnalysisFavoritesLoading,
        mutate: mutateAnalysisFavorites
    } = useRequestQuery(medicalEntityHasUser ? {
        method: "GET",
        url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/favorite/analyses/${router.locale}`
    } : null, ReactQueryNoValidateConfig);

    const modals = ((httpModelResponse as HttpResponse)?.data ?? []) as any[];
    const analysisFavorites = ((httpAnalysisFavoritesResponse as HttpResponse)?.data ?? []) as MIModel[];

    const handleClickPopover = useCallback(() => {
        setAnchorElPopover(textFieldRef.current);
    }, [textFieldRef]);


    const onSetModelData = (item: { uuid: string, analyses: AnalysisModel[] }) => {
        setAnalysis(item.analyses);
        data.setState(item.analyses);
        setSelectedModel(item);
        setbalanceSheetTabIndex(0);
    }

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

    const initialData = Array.from(new Array(10));

    const {handleSubmit} = formik;

    const handleBalanceSheetTabChange = (
        event: React.SyntheticEvent,
        newValue: number
    ) => {
        setbalanceSheetTabIndex(newValue);
    }

    const addAnalysis = (value: AnalysisModel) => {
        if (analysis.findIndex(item => item.name === value.name) === -1) {
            setName('')
            let copy = [...analysis]
            copy.unshift({...value, note: ""});
            setAnalysis([...copy]);
            const recent = localStorage.getItem("balance-Sheet-recent") ?
                JSON.parse(localStorage.getItem("balance-Sheet-recent") as string) : [] as AnalysisModel[];
            localStorage.setItem("balance-Sheet-recent", JSON.stringify([...copy.filter(x => !recent.find((r: AnalysisModel) => r.uuid === x.uuid)), ...recent]));
            data.setState([...copy]);
            setbalanceSheetTabIndex(0);
        }
    }

    const saveModel = () => {
        const form = new FormData();
        form.append('globalNote', "");
        form.append('name', model);
        form.append('analyses', JSON.stringify(analysis));
        triggerBalanceSheetCreate({
            method: "POST",
            url: `${urlMedicalProfessionalSuffix}/requested-analysis-modal/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                setOpenDialog(false);
                setModel("")
                mutate().then(() => {
                    enqueueSnackbar(t("created"), {variant: 'success'});
                    setbalanceSheetTabIndex(1);
                });
            }
        });
    }

    const searchInAnalysis = (analysisName: string) => {
        setName(analysisName);
        if (analysisName.length >= 2) {
            triggerBalanceSheetGet({
                method: "GET",
                url: `/api/private/analysis/${router.locale}?name=${analysisName}`
            }, {
                onSuccess: (r: any) => {
                    const res = (r?.data as HttpResponse).data;
                    setSearchAnalysis(res.length > 0 ? res : analysisList);
                }
            });
        } else {
            setSearchAnalysis(analysisList);
        }
    }

    const deleteModel = (modelUuid: string) => {
        triggerBalanceSheetDelete({
            method: "DELETE",
            url: `${urlMedicalProfessionalSuffix}/requested-analysis-modal/${modelUuid}/${router.locale}`
        }, {
            onSuccess: () => {
                mutate().then(() => {
                    setSelectedModel(null)
                    setAnalysis([]);
                    enqueueSnackbar(t("removed"), {variant: 'success'})
                });
            }
        })
    }

    const editModel = () => {
        const form = new FormData();
        form.append('globalNote', "");
        form.append('name', selectedModel.name);
        form.append('analyses', JSON.stringify(analysis));
        triggerBalanceSheetUpdate({
            method: "PUT",
            url: `${urlMedicalProfessionalSuffix}/requested-analysis-modal/${selectedModel.uuid}/${router.locale}`,
            data: form
        }, {
            onSuccess: () => {
                mutate().then(() => {
                    enqueueSnackbar(t("updated"), {variant: 'success'})
                });
            }
        });
    }

    const addAnalysesFavorite = (medicalImagery: MIModel) => {
        const form = new FormData();
        medicalImagery?.uuid && form.append('analyse', medicalImagery.uuid);
        medicalEntityHasUser && triggerFavoriteAdd({
            method: "POST",
            url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/favorite/analyses/${router.locale}`,
            data: form,
        }, {
            onSuccess: () => mutateAnalysisFavorites()
        });
    }

    const handleOnChange = (event: any, newValue: any) => {
        if (typeof newValue === 'string' && newValue.length > 0) {
            addAnalysis({
                name: newValue,
            });
        } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            addAnalysis({
                name: newValue.inputValue,
            });
        } else if (newValue) {
            const analysisItem = (newValue as AnalysisModel);
            if (!analysis.find(item => item.uuid === analysisItem.uuid)) {
                addAnalysis(newValue as AnalysisModel);
                if (!analysisFavorites.find((item: MIModel) => item.uuid === analysisItem.uuid)) {
                    addAnalysesFavorite(analysisItem);
                }
            }
        }
    }

    const debouncedOnChange = debounce(handleOnChange, 500);

    useEffect(() => {
        if (httpAnalysisResponse) {
            const analysisListData = (httpAnalysisResponse as HttpResponse)?.data as AnalysisModel[];
            setAnalysisList(analysisListData);
            setAnalysisListLocal(localStorage.getItem("balance-Sheet-recent") ?
                JSON.parse(localStorage.getItem("balance-Sheet-recent") as string) : analysisListData);
            setSearchAnalysis(analysisListData);
            setLoading(false);
        }
    }, [httpAnalysisResponse]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ready) return (<LoadingScreen button text={"loading-error"}/>);

    return (
        <BalanceSheetDialogStyled>
            <Grid container spacing={5}>
                <Grid item xs={12} md={8}>
                    <FormikProvider value={formik}>
                        <Stack
                            spacing={2}
                            component={Form}
                            autoComplete="off"
                            noValidate
                            onSubmit={handleSubmit}>
                            <Stack spacing={1}>
                                {!isMobile && <Stack direction="row" alignItems="center">
                                    <Typography>{t('please_name_the_balance_sheet')}</Typography>
                                </Stack>}

                                {openPopover ?
                                    <Autocomplete
                                        size={"small"}
                                        value={balanceValue}
                                        onInputChange={(event, value) => searchInAnalysis(value)}
                                        onChange={(event, newValue) => {
                                            setAnchorElPopover(null);
                                            debouncedOnChange(event, newValue);
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
                                        freeSolo
                                        id="sheet-solo-balance"
                                        options={arrayUniqueByKey("name", searchAnalysis)}
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
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                autoFocus
                                                inputRef={autocompleteTextFieldRef}
                                                label={t('placeholder_balance_sheet_name')}/>
                                        )}
                                    />
                                    :
                                    <TextField
                                        className={"MuiInputBase-input-hidden"}
                                        size={"small"}
                                        ref={textFieldRef}
                                        onClick={handleClickPopover}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">
                                                <SearchIcon/>
                                            </InputAdornment>,
                                        }}
                                        placeholder={t('placeholder_balance_sheet_name')}
                                        fullWidth/>}
                            </Stack>
                            <Typography color={"gray"} fontSize={12}>
                                {t('recent-search-balance-sheet')}
                            </Typography>

                            <Box>
                                {(!isAnalysisFavoritesLoading && analysisFavorites.length > 0) ? (analysisFavorites?.map((analysisItem: AnalysisModel, index: number) => (
                                        <Chip
                                            className={"chip-item"}
                                            key={index}
                                            id={analysisItem.uuid}
                                            onClick={() => {
                                                addAnalysis(analysisItem)
                                            }}
                                            onDragStart={(event) => event.dataTransfer.setData("Text", (event.target as any).id)}
                                            onDelete={() => {
                                                medicalEntityHasUser && triggerFavoriteDelete({
                                                    method: "DELETE",
                                                    url: `${urlMedicalEntitySuffix}/mehu/${medicalEntityHasUser[0].uuid}/favorite/analyses/${analysisItem.uuid}/${router.locale}`,
                                                }, {
                                                    onSuccess: () => {
                                                        enqueueSnackbar(t(`alerts.favorite.delete`), {variant: "success"});
                                                        mutateAnalysisFavorites();
                                                    }
                                                });
                                            }}
                                            disabled={analysis.find(an => an.uuid && an.uuid === analysisItem.uuid) !== undefined}
                                            label={analysisItem.name}
                                            color="default"
                                            clickable
                                            draggable="true"
                                            deleteIcon={<RemoveCircleRoundedIcon/>}
                                        />
                                    )
                                )) : isAnalysisFavoritesLoading ? initialData.map((item, index) => (
                                    <Chip
                                        className={"chip-item"}
                                        key={index}
                                        label={""}
                                        color="default"
                                        clickable
                                        draggable="true"
                                        avatar={<Skeleton width={90} sx={{marginLeft: '16px !important'}}
                                                          variant="text"/>}
                                        deleteIcon={<AddIcon/>}
                                    />)) : <NoDataCard t={t} ns={"consultation"} data={{
                                    mainIcon: "ic-analyse",
                                    title: "no-data.analyse.title",
                                    description: "no-data.analyse.description",
                                }}/>
                                }
                            </Box>
                        </Stack>
                    </FormikProvider>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Box sx={{width: "100%", "& .MuiBox-root": {p: 0}}}>
                        <Box sx={{borderBottom: 1, mb: 1, borderColor: "divider"}}>
                            <Tabs
                                value={balanceSheetTabIndex}
                                onChange={handleBalanceSheetTabChange}
                                aria-label="balance sheet tabs">
                                <Tab
                                    disableFocusRipple
                                    label={t("preview")}
                                    {...a11yProps(0)}
                                />
                                <Tab
                                    disableFocusRipple
                                    label={t("modeles")}
                                    {...a11yProps(1)}
                                />
                            </Tabs>
                        </Box>
                        <TabPanel value={balanceSheetTabIndex} index={0}>
                            <Stack sx={{mb: 1}} direction="row" alignItems="center" justifyContent={"space-between"}>
                                {selectedModel && <TextField placeholder={t('modeleName')} onChange={(ev) => {
                                    selectedModel.name = ev.target.value;
                                    setSelectedModel({...selectedModel})
                                }} value={selectedModel.name}></TextField>}
                                {analysis.length > 0 && !selectedModel && <Button
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
                                            color={"primary"}
                                            onClick={editModel}><SaveRoundedIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={t('delete_template')}>
                                        <IconButton
                                            size="small"
                                            color={"error"}
                                            onClick={() => deleteModel(selectedModel.uuid)}><DeleteOutlineRoundedIcon/>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={t('close_template')}>
                                        <IconButton size="small" onClick={() => {
                                            setAnalysis([]);
                                            setSelectedModel(null)
                                        }}><CloseRoundedIcon/>
                                        </IconButton>
                                    </Tooltip>
                                </Stack>}
                            </Stack>
                            <Box className="list-container"
                                 sx={{minHeight: 300, pr: 1}}
                                 onDragOver={event => event.preventDefault()}
                                 onDrop={(event) => {
                                     event.preventDefault();
                                     const data = event.dataTransfer.getData("Text");
                                     addAnalysis(analysisListLocal.find(item => item.uuid === data) as AnalysisModel);
                                 }}>
                                {analysis.length > 0 ?
                                    analysis.map((item, index) => (
                                        <NoteCardCollapse
                                            key={index}
                                            {...{item, t}}
                                            onExpandHandler={(event: any) => {
                                                event.stopPropagation();
                                                setAnalysis([
                                                    ...analysis.slice(0, index),
                                                    {...analysis[index], expanded: !item.expanded},
                                                    ...analysis.slice(index + 1)
                                                ]);
                                            }}
                                            onDeleteItem={() => {
                                                const copy = [...analysis]
                                                copy.splice(index, 1);
                                                setAnalysis([...copy])
                                                data.setState([...copy])
                                            }}
                                            onNoteChange={(event: any) => {
                                                let items = [...analysis];
                                                let x = {...analysis[index]};
                                                x.note = event.target.value;
                                                items[index] = x;
                                                setAnalysis([...items])
                                                data.setState([...items])
                                            }}/>
                                    ))
                                    : <Card className='loading-card'>
                                        <Stack spacing={2}>
                                            <NoDataCard
                                                {...{t}}
                                                ns={"consultation"}
                                                data={{
                                                    mainIcon: "ic-analyse",
                                                    title: "drag-balance-sheet",
                                                    description: "drag-description"
                                                }}
                                            />
                                        </Stack>
                                    </Card>
                                }
                            </Box>
                        </TabPanel>
                        <TabPanel value={balanceSheetTabIndex} index={1}>
                            <List
                                disablePadding
                                className={"prescription-preview"}
                                subheader={
                                    <ListSubheader
                                        disableSticky
                                        component="div"
                                        id="nested-list-subheader">
                                        {t('balance_sheet_list')}
                                    </ListSubheader>
                                }>
                                {modals.map((item, idx) =>
                                    <ListItemButton
                                        key={idx}
                                        sx={{pl: 4}}
                                        alignItems="flex-start"
                                        onClick={() => onSetModelData(item)}>
                                        <ListItemIcon sx={{minWidth: 26}}>
                                            <Icon width={"16"} height={"16"} path="ic-soura"/>
                                        </ListItemIcon>
                                        <ListItemText color={"primary"} primary={<Typography
                                            color={"primary"}>{item.name}</Typography>}/>

                                        <IconButton size="small" onClick={(event) => {
                                            event.stopPropagation();
                                            deleteModel(item.uuid);
                                        }}>
                                            <Icon path="setting/icdelete"/>
                                        </IconButton>
                                    </ListItemButton>
                                )}
                            </List>
                        </TabPanel>
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
