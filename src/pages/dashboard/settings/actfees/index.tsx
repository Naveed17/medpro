import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useCallback, useEffect, useState} from "react";
import {DashLayout} from "@features/base";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {
    Autocomplete,
    Box,
    Button, createFilterOptions,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import {useTranslation} from "next-i18next";
import {useRequest, useRequestMutation} from "@app/axios";
import {useRouter} from "next/router";
import {RootStyled} from "@features/toolbar";
import {SubHeader} from "@features/subHeader";
import {Otable} from '@features/table';
import {SWRNoValidateConfig, TriggerWithoutValidation} from "@app/swr/swrProvider";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {useSnackbar} from "notistack";
import {LoadingScreen} from "@features/loadingScreen";
import {DefaultCountry} from "@app/constants";

interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
    sortable: boolean;
    align: "left" | "right" | "center";
}

const filter = createFilterOptions<any>();

const headCells: readonly HeadCell[] = [
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "acts",
        sortable: true,
        align: "left",
    },
    {
        id: "fees",
        numeric: true,
        disablePadding: false,
        label: "amount",
        sortable: true,
        align: "center",
    },
    {
        id: "actions",
        numeric: true,
        disablePadding: false,
        label: "actions",
        sortable: true,
        align: "right",
    }
];

function ActFees() {
    const {data: session} = useSession();
    const theme = useTheme();
    const router = useRouter();

    const {t, ready} = useTranslation("settings", {keyPrefix: "actfees"});

    const [mainActes, setMainActes] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [create, setCreate] = useState(false)
    const [consultationFees, setConsultationFees] = useState(0);
    const [newFees, setNewFees] = useState<{ act: ActModel | string | null, fees: string }>({act: null, fees: ''});
    const {enqueueSnackbar} = useSnackbar();

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;
    const medical_professional = (user as UserDataResponse).medical_professional as MedicalProfessionalModel;
    const doctor_country = (medical_entity.country ? medical_entity.country : DefaultCountry);
    const devise = doctor_country.currency?.name;

    const {trigger} = useRequestMutation(null, "/settings/acts");
    const {trigger: triggerAddAct} = useRequestMutation(null, "/settings/acts/add");

    const {data: httpActSpeciality} = useRequest(medical_professional ? {
        method: "GET",
        url: `/api/public/acts/${router.locale}`,
        params: {['specialities[0]']: medical_professional.specialities[0].speciality.uuid},
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null);

    const {data: httpProfessionalsActs, mutate} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/professionals/${medical_professional.uuid}/acts/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    }, SWRNoValidateConfig);

    const {data: httpMPResponse} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity?.uuid}/professionals/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`},
    }, SWRNoValidateConfig);

    useEffect(() => {
        if (httpMPResponse) {
            const mpRes = (httpMPResponse as HttpResponse)?.data[0];
            setConsultationFees(Number(mpRes.consultation_fees))
        }
    }, [httpMPResponse])

    useEffect(() => {
        setLoading(true)
        if (httpProfessionalsActs !== undefined) {
            const response = ((httpProfessionalsActs as HttpResponse).data).reverse()
            setMainActes(response as ActModel[])
            setLoading(false)
        }
    }, [httpProfessionalsActs]);

    const handleCreate = () => {
        setCreate(true)
    }

    const handleRemove = () => {
        setCreate(false);
        setNewFees({act: null, fees: ''});
    }

    const editFees = () => {
        const form = new FormData();
        form.append("consultation_fees", consultationFees.toString());
        trigger({
            method: "PATCH",
            url: `/api/medical-entity/${medical_entity.uuid}/professionals/${medical_professional.uuid}/${router.locale}`,
            data: form,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, TriggerWithoutValidation).then(() => enqueueSnackbar(t("feesupdated"), {variant: 'success'}));
    }

    const removeFees = (uuid: string) => {
        trigger({
            method: "DELETE",
            url: `/api/medical-entity/${medical_entity.uuid}/acts/${uuid}/${router.locale}`,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, TriggerWithoutValidation).then(() => {
            mutate().then(() => {
                enqueueSnackbar(t("removed"), {variant: 'success'})
            });
        });
    }

    const saveFees = () => {
        if (newFees.fees !== '' && typeof newFees.act === 'string') {
            const form = new FormData();
            form.append('name', JSON.stringify({
                "fr": newFees.act
            }));
            form.append('price', `${newFees.fees}`);

            trigger({
                method: "POST",
                url: `/api/medical-entity/${medical_entity.uuid}/professionals/${medical_professional.uuid}/new-acts/${router.locale}`,
                data: form,
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`
                }
            }, TriggerWithoutValidation).then(() => {
                mutate().then(() => {
                    setCreate(false)
                    setNewFees({act: null, fees: ''})
                    enqueueSnackbar(t("addedfees"), {variant: 'success'})
                })
            })
        }
    }

    const setActFees = useCallback((isTopAct: boolean, actFees: { act: ActModel | string | null, fees: string }) => {
        const form = new FormData();
        form.append('topAct', isTopAct.toString());
        form.append('act', (actFees.act as ActModel)?.uuid);
        triggerAddAct({
            method: "POST",
            url: "/api/medical-entity/" + medical_entity.uuid + "/professionals/" + medical_professional.uuid + '/acts/' + router.locale,
            data: form,
            headers: {
                ContentType: 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, TriggerWithoutValidation).then(() => {
            handleEdit(actFees, actFees.fees);
        })

    }, [medical_entity.uuid, medical_professional.uuid, mutate, router.locale, session?.accessToken, triggerAddAct]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleEdit = (v: any, fees: string) => {
        const form = new FormData();
        form.append("attribute", "price");
        form.append("value", fees);

        trigger({
            method: "PATCH",
            url: `/api/medical-entity/${medical_entity.uuid}/professionals/${medical_professional.uuid}/acts/${v.act?.uuid}/${router.locale}`,
            data: form,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            },
        }, TriggerWithoutValidation).then(() => {
            mutate().then(() => {
                enqueueSnackbar(t("updated"), {variant: 'success'});
                if (typeof newFees.act !== 'string') {
                    setCreate(false);
                    setNewFees({act: null, fees: ''});
                }
            });
        });
    };

    const acts = (httpActSpeciality as HttpResponse)?.data as ActModel[];

    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t('path')}</p>
                </RootStyled>

                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    {
                        !create &&
                            <Button variant="contained" color={"success"}
                                    onClick={() => handleCreate()}>{t("add_a_new_act")}</Button>
                    }
                    <span>|</span>
                    <Typography>
                        {t("consultation")} :
                    </Typography>
                    <TextField id="outlined-basic"
                               value={consultationFees}
                               size="small"
                               InputProps={{
                                   endAdornment: <InputAdornment position="end">{devise}</InputAdornment>,
                                   style: {width: 120, backgroundColor: "white"}
                               }}
                               onChange={(ev) => {
                                   setConsultationFees(Number(ev.target.value))
                               }}
                               variant="outlined"/>
                    <IconButton color={"primary"} onClick={() => {
                        editFees()
                    }}>
                        <SaveRoundedIcon color={"primary"}/>
                    </IconButton>

                </Stack>
            </SubHeader>
            <Box sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}, 'table': {tableLayout: 'fixed'}}}>
                {create && <Stack
                    style={{
                        background: "white",
                        padding: '10px 15px',
                        border: `1px solid ${theme.palette.warning.main}`,
                        borderRadius: 10
                    }}
                    spacing={2}
                    mb={2}>
                    <Typography style={{color: theme.palette.grey[400], fontSize: 10}}>{t('newAct')}</Typography>
                    <Stack direction={"row"} alignItems={"center"} spacing={2}>
                        <Autocomplete
                            sx={{width: "44%"}}
                            size="small"
                            value={newFees.act}
                            onChange={(event, newValue) => {
                                if (typeof newValue === 'string') {
                                    setNewFees({
                                        ...newFees,
                                        act: newValue,
                                    });
                                } else if (newValue && newValue.inputValue) {
                                    // Create a new value from the user input
                                    setNewFees({
                                        ...newFees,
                                        act: newValue.inputValue,
                                    });
                                } else {
                                    setNewFees({
                                        ...newFees,
                                        act: newValue as ActModel
                                    });
                                }
                            }}
                            filterOptions={(options, params) => {
                                const filtered = filter(options, params);
                                const {inputValue} = params;
                                // Suggest the creation of a new value
                                const isExisting = options.some((option) => inputValue === option.name);
                                if (inputValue !== '' && !isExisting) {
                                    filtered.push({
                                        inputValue,
                                        name: `${t('add_act')} "${inputValue}"`,
                                    });
                                }

                                return filtered;
                            }}
                            selectOnFocus
                            clearOnEscape
                            handleHomeEndKeys
                            id="name"
                            options={acts ? acts : []}
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
                                <TextField {...params} label={t('placeholder_act')}/>
                            )}
                        />

                        <TextField id="outlined-basic"
                                   value={newFees.fees}
                                   type={"number"}
                                   size="small"
                                   label={t('price')}
                                   InputProps={{
                                       endAdornment: <InputAdornment position="end">{devise}</InputAdornment>,
                                       style: {width: 150, backgroundColor: "white"}
                                   }}
                                   onChange={(ev) => {
                                       newFees.fees = ev.target.value
                                       setNewFees({...newFees})
                                   }}
                                   variant="outlined"/>
                        <Button disabled={newFees.act === null || newFees.fees.length === 0}
                                variant="contained"
                                onClick={() => {
                                    if (typeof newFees.act === 'string') {
                                        saveFees()
                                    } else {
                                        setActFees(false, newFees);
                                    }
                                }}>{t('save')}</Button>
                        <Button
                                onClick={() => {
                                    handleRemove()
                                }}>{t('cancel')}</Button>
                    </Stack>
                </Stack>}

                <Otable
                    headers={headCells}
                    rows={mainActes}
                    from={"actfees"}
                    edit={handleEdit}
                    remove={removeFees}
                    {...{t, loading}}
                />
            </Box>
        </>
    );
}

export const getStaticProps: GetStaticProps = async (context) => ({
    props: {
        fallback: false,
        ...(await serverSideTranslations(context.locale as string, ['common', 'menu', 'settings']))
    }
})

export default ActFees;

ActFees.auth = true;

ActFees.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};
