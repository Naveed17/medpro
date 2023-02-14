import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {ReactElement, useCallback, useEffect, useState} from "react";
import {DashLayout} from "@features/base";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import AddIcon from "@mui/icons-material/Add";
import {Box} from "@mui/system";
import {Chip, Paper, Skeleton, Stack, Typography} from "@mui/material";
import {useTranslation} from "next-i18next";
import {MultiSelect} from "@features/multiSelect";
import BasicAlert from "@themes/overrides/Alert";
import {useRequest, useRequestMutation} from "@app/axios";
import {useRouter} from "next/router";
import {RootStyled} from "@features/toolbar";
import {SubHeader} from "@features/subHeader";
import {LoadingScreen} from "@features/loadingScreen";
import {TriggerWithoutValidation} from "@app/swr/swrProvider";
import {getDifference} from "@app/hooks";

function Acts() {
    const {data: session} = useSession();
    const [mainActs, setMainActs] = useState<ActModel[]>([]);
    const [secondaryActs, setSecondaryActs] = useState<ActModel[]>([]);
    const [selected, setSelected] = useState<ActModel>();
    const [suggestion, setSuggestion] = useState<ActModel[]>([]);
    const [alert, setAlert] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [isProfile, setIsProfile] = useState<boolean>(false);

    const [acts, setActs] = useState<ActModel[]>([]);
    const [specialities, setSpecialities] = useState<any>({});
    const router = useRouter();
    const [medical_professional_uuid, setMedicalProfessionalUuid] = useState<string>("");

    const initialData = Array.from(new Array(8));

    const {data: user} = session as Session;
    const medical_entity = (user as UserDataResponse).medical_entity as MedicalEntityModel;

    const {data: httpProfessionalsResponse, mutate} = useRequest({
        method: "GET",
        url: `/api/medical-entity/${medical_entity.uuid}/professionals/${router.locale}`,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    });

    const {trigger: triggerAddAct} = useRequestMutation(null, "/settings/acts/add");
    const {trigger: triggerDeleteAct} = useRequestMutation(null, "/settings/acts/delete");

    const {data} = useRequest(isProfile ? {
        method: "GET",
        url: `/api/public/acts/${router.locale}`,
        params: specialities,
        headers: {Authorization: `Bearer ${session?.accessToken}`}
    } : null);

    const removeFees = (uuid: string) => {
        triggerDeleteAct({
            method: "DELETE",
            url: `/api/medical-entity/${medical_entity.uuid}/acts/${uuid}/${router.locale}`,
            headers: {
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, TriggerWithoutValidation)
    }

    const setDoctorActs = useCallback((isTopAct: boolean, actUuid: string) => {
        const form = new FormData();
        form.append('topAct', isTopAct.toString());
        form.append('act', actUuid);
        triggerAddAct({
            method: "POST",
            url: "/api/medical-entity/" + medical_entity.uuid + "/professionals/" + medical_professional_uuid + '/acts/' + router.locale,
            data: form,
            headers: {
                ContentType: 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${session?.accessToken}`
            }
        }, TriggerWithoutValidation).then(() => {
            mutate();
        })

    }, [medical_entity.uuid, medical_professional_uuid, mutate, router.locale, session?.accessToken, triggerAddAct]);

    useEffect(() => {
        if (data !== undefined) {
            setActs(((data as any).data) as ActModel[])
            setSuggestion(((data as any).data) as ActModel[]);
            setLoading(false);
        }
    }, [data]);

    useEffect(() => {
        if (httpProfessionalsResponse !== undefined) {
            const professionalSpecialities = {};
            (httpProfessionalsResponse as any).data[0]?.medical_professional.specialities.map((speciality: any, index: number) => {
                Object.assign(professionalSpecialities, {['specialities[' + index + ']']: speciality.speciality.uuid});
            });
            setSpecialities(professionalSpecialities);
            setIsProfile(true);
            setMedicalProfessionalUuid((httpProfessionalsResponse as any).data[0]?.medical_professional.uuid);
            const acts = (httpProfessionalsResponse as any).data[0]?.acts;
            let main: ActModel[] = [];
            let secondary: ActModel[] = [];
            acts?.map((act: MedicalProfessionalActModel) => {
                const actUpdated = {...act.act, medicalProfessionalAct: act.uuid}
                act.isTopAct ? main.push((actUpdated) as ActModel) : secondary.push(actUpdated);
            });
            setMainActs(main);
            setSecondaryActs(secondary);
        }
    }, [httpProfessionalsResponse])

    useEffect(() => {
        const selectedActs = [...mainActs, ...secondaryActs];
        setSuggestion(acts.filter((nb) => {
            return !selectedActs.some((item) => item.uuid === nb.uuid);
        }));
    }, [acts, mainActs, secondaryActs]);

    const onDrop = (id: string, ev: any) => {
        const deleteSuggestion = (suggestion as ActModel[]).filter((v) => v.uuid !== (selected as ActModel).uuid);
        setSuggestion([...deleteSuggestion]);
        if (id === "main" && mainActs.length < 10) {
            setMainActs([...mainActs, (selected as ActModel)]);
            setDoctorActs(true, (selected as ActModel)?.uuid);
        } else {
            const deleteSuggestion = (suggestion as ActModel[]).filter((v) => v !== selected);
            setSuggestion([...deleteSuggestion]);
            setSecondaryActs([...secondaryActs, (selected as ActModel)]);
            setDoctorActs(false, (selected as ActModel)?.uuid);
        }
    };

    const onDrag = (prop: any) => (ev: any) => {
        ev.dataTransfer.setData("Text", ev.target.id);
        ev.effectAllowed = "copy";
        setSelected({...prop});
    };

    const allowDrop = (ev: { preventDefault: () => void }) => {
        ev.preventDefault();
    };

    const onClickChip = (prop: any) => () => {
        const deleteSuggestion = (suggestion as ActModel[]).filter((v) => v.uuid !== prop.uuid);
        setSuggestion([...deleteSuggestion]);
        if (mainActs.length < 10) {
            setMainActs([...mainActs, prop]);
        } else {
            setSecondaryActs([...secondaryActs, prop]);
        }
    };

    const onChangeState = (
        val: any[],
        items: any[],
        setItems: (arg0: any[]) => void,
        id: string
    ) => {
        const deletedAct = getDifference(items, val);
        const insertedAct = getDifference(val, items);
        if (insertedAct.length > 0) {
            setDoctorActs(id === "main", (insertedAct[0] as ActModel)?.uuid);
        } else {
            removeFees((deletedAct[0] as ActModel)?.medicalProfessionalAct as string);
        }
        setItems(val.slice(0, 10));
    };

    const {t, ready} = useTranslation("settings", {keyPrefix: "actes"});
    if (!ready) return (<LoadingScreen error button={'loading-error-404-reset'} text={"loading-error"}/>);

    return (
        <>
            <SubHeader>
                <RootStyled>
                    <p style={{margin: 0}}>{t('path')}</p>
                </RootStyled>
            </SubHeader>
            <Box bgcolor="#F0FAFF"
                 sx={{p: {xs: "40px 8px", sm: "30px 8px", md: 2}}}>
                <Paper sx={{p: 2}}>
                    <Typography variant="body1" color="text.primary" mb={5}>
                        {t("selectActes")}
                    </Typography>

                    <Typography
                        variant="subtitle1"
                        color="text.primary"
                        fontWeight={600}
                        mb={2}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            svg: {
                                ml: 1,
                                path: {
                                    fill: theme => theme.palette.warning.main,
                                },
                            },
                        }}
                    >
                        {t("main")}{" "}
                        {/*{!alert && (
                            <IconUrl
                                onChange={() => {
                                    setAlert(true);
                                }}
                                path="danger"
                            />
                        )}*/}
                        {alert && (
                            <BasicAlert
                                icon="danger"
                                sx={{
                                    width: "fit-content",
                                    padding: "0  15px 0 0",
                                    margin: "0 10px",
                                }}
                                data={"Actes alert message"}
                                onChange={() => {
                                    setAlert(false);
                                }}
                                color="warning">
                                info
                            </BasicAlert>
                        )}
                    </Typography>

                    <MultiSelect
                        id="main"
                        data={acts.filter((a) => !secondaryActs.some((m) => a.uuid === m.uuid))}
                        onDrop={onDrop}
                        all={[...mainActs, ...secondaryActs]}
                        onDragOver={allowDrop}
                        onChange={(event: React.ChangeEvent, value: any, id: string) => {
                            onChangeState(value, mainActs, setMainActs, id);
                        }}
                        label={'name'}
                        initData={mainActs}
                        limit={10}
                        helperText={t("max")}
                        placeholder={t("typing")}
                    />

                    <Typography
                        variant="subtitle1"
                        color="text.primary"
                        fontWeight={600}
                        mb={2}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 6,
                            svg: {
                                ml: 1,
                                path: {
                                    fill: theme => theme.palette.warning.main,
                                },
                            },
                        }}
                    >
                        {t("secondary")}{" "}
                        {/*{!secAlert && (
                            <IconUrl
                                onChange={() => {
                                    setSecAlert(true);
                                }}
                                path="danger"
                            />
                        )}{" "}
                        {secAlert && (
                            <BasicAlert
                                icon="danger"
                                sx={{
                                    width: "fit-content",
                                    padding: "0  15px 0 0",
                                    margin: "0 10px",
                                }}
                                data={"Actes alert message"}
                                onChange={() => {
                                    setSecAlert(false);
                                }}
                                color="warning"
                            >
                                info
                            </BasicAlert>
                        )}*/}
                    </Typography>

                    <MultiSelect
                        id="second"
                        data={acts.filter((a) => !mainActs.some((m) => a.uuid === m.uuid))}
                        all={[...mainActs, ...secondaryActs]}
                        onDrop={onDrop}
                        onDragOver={allowDrop}
                        onChange={(event: React.ChangeEvent, value: any[], id: string) => {
                            onChangeState(value, secondaryActs, setSecondaryActs, id);
                        }}
                        label={'name'}
                        initData={secondaryActs}
                        helperText={t("")}
                        placeholder={t("typing")}
                    />

                    <Typography
                        variant="subtitle1"
                        color="text.primary"
                        fontWeight={600}
                        mb={2}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 6,
                            svg: {
                                ml: 1,
                                path: {
                                    fill: theme => theme.palette.warning.main,
                                },
                            },
                        }}
                    >
                        {t("suggestion")}
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" sx={{bgcolor: "transparent"}}>
                        {loading ?
                            initialData.map((item, index) => (
                                <Chip
                                    key={index}
                                    label={""}
                                    color="default"
                                    clickable
                                    draggable="true"
                                    avatar={<Skeleton width={90} sx={{marginLeft: '16px !important'}}
                                                      variant="text"/>}
                                    deleteIcon={<AddIcon/>}
                                    sx={{
                                        bgcolor: "#E4E4E4",
                                        filter: "drop-shadow(10px 10px 10px rgba(0, 0, 0, 0))",
                                        mb: 1,
                                        mr: 1,
                                        cursor: "move",
                                        "&:active": {
                                            boxShadow: "none",
                                            outline: "none",
                                        },
                                        "& .MuiChip-deleteIcon": {
                                            color: (theme) => theme.palette.text.primary,
                                        },
                                    }}
                                />
                            )) : (suggestion as ActModel[]).map((v: ActModel) => (
                                <Chip
                                    key={v.uuid}
                                    id={v.uuid}
                                    label={v.name}
                                    color="default"
                                    clickable
                                    draggable="true"
                                    onDragStart={onDrag(v)}
                                    onClick={onClickChip(v)}
                                    onDelete={onClickChip(v)}
                                    deleteIcon={<AddIcon/>}
                                    sx={{
                                        bgcolor: "#E4E4E4",
                                        filter: "drop-shadow(10px 10px 10px rgba(0, 0, 0, 0))",
                                        mb: 1,
                                        mr: 1,
                                        cursor: "move",
                                        "&:active": {
                                            boxShadow: "none",
                                            outline: "none",
                                        },
                                        "& .MuiChip-deleteIcon": {
                                            color: (theme) => theme.palette.text.primary,
                                        },
                                    }}
                                />
                            ))}
                    </Stack>
                </Paper>
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

export default Acts;

Acts.auth = true;

Acts.getLayout = function getLayout(page: ReactElement) {
    return <DashLayout>{page}</DashLayout>;
};